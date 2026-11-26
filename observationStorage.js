import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'sahabat_sungai.db';

let database = null;
let schemaInitialized = false;

const getDatabase = () => {
  if (!database) {
    database = SQLite.openDatabaseSync(DATABASE_NAME);
  }

  if (!schemaInitialized) {
    database.execSync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        river_name TEXT NOT NULL,
        river_region TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        observed_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS custom_rivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL COLLATE NOCASE UNIQUE,
        region TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS observation_stations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        observation_id INTEGER NOT NULL,
        point INTEGER NOT NULL,
        suhu REAL NOT NULL,
        kedalaman REAL NOT NULL,
        kecerahan REAL NOT NULL,
        ph REAL NOT NULL,
        FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS observation_organisms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_id INTEGER NOT NULL,
        organism_key TEXT NOT NULL,
        organism_name TEXT NOT NULL,
        count INTEGER NOT NULL,
        FOREIGN KEY (station_id) REFERENCES observation_stations(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_observations_observed_at
        ON observations(observed_at DESC, id DESC);
      CREATE INDEX IF NOT EXISTS idx_observations_river_observed_at
        ON observations(river_name, observed_at DESC, id DESC);
      CREATE INDEX IF NOT EXISTS idx_observation_stations_obs_id
        ON observation_stations(observation_id);
      CREATE INDEX IF NOT EXISTS idx_observation_organisms_station_id
        ON observation_organisms(station_id);
    `);
    schemaInitialized = true;
  }

  return database;
};

const formatIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Saves a user-defined river and returns its normalized location record. */
export function saveCustomRiver({ name, region, latitude, longitude }) {
  const location = {
    name: name.trim(),
    region: region.trim(),
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
  const db = getDatabase();
  db.runSync(
    `INSERT INTO custom_rivers (name, region, latitude, longitude, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    location.name,
    location.region,
    location.latitude,
    location.longitude,
    new Date().toISOString(),
  );
  return location;
}

/** Returns all user-defined rivers in creation order. */
export function getCustomRivers() {
  const db = getDatabase();
  return db.getAllSync(
    `SELECT name, region, latitude, longitude
     FROM custom_rivers
     ORDER BY created_at DESC, id DESC`,
  );
}

/** Atomically saves a river observation and all station measurements to SQLite. */
export function saveObservation({ location, date, stations }) {
  const db = getDatabase();
  const observedAt = formatIsoDate(date);
  const createdAt = new Date().toISOString();
  let observationId = null;

  db.withTransactionSync(() => {
    const obsResult = db.runSync(
      `INSERT INTO observations (river_name, river_region, latitude, longitude, observed_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      location.name,
      location.region ?? '',
      typeof location.latitude === 'number' ? location.latitude : null,
      typeof location.longitude === 'number' ? location.longitude : null,
      observedAt,
      createdAt,
    );
    observationId = obsResult.lastInsertRowId;

    for (const station of stations) {
      const stationResult = db.runSync(
        `INSERT INTO observation_stations (observation_id, point, suhu, kedalaman, kecerahan, ph)
         VALUES (?, ?, ?, ?, ?, ?)`,
        observationId,
        station.point,
        station.suhu,
        station.kedalaman,
        station.kecerahan,
        station.ph,
      );
      const stationId = stationResult.lastInsertRowId;

      for (const organism of station.organisms) {
        db.runSync(
          `INSERT INTO observation_organisms (station_id, organism_key, organism_name, count)
           VALUES (?, ?, ?, ?)`,
          stationId,
          organism.key,
          organism.name,
          organism.count,
        );
      }
    }
  });

  return observationId;
}

const hydrateObservation = (db, observation) => {
  if (!observation) {
    return null;
  }

  const stations = db.getAllSync(
    `SELECT id, point, suhu, kedalaman, kecerahan, ph
     FROM observation_stations
     WHERE observation_id = ?
     ORDER BY point ASC`,
    observation.id,
  );

  const stationsWithOrganisms = stations.map((station) => ({
    ...station,
    organisms: db.getAllSync(
      `SELECT organism_key, organism_name, count
       FROM observation_organisms
       WHERE station_id = ?
       ORDER BY id ASC`,
      station.id,
    ),
  }));

  return {
    ...observation,
    stations: stationsWithOrganisms,
  };
};

/** Returns the most recently saved observation with its stations and organisms, or null. */
export function getLatestObservation() {
  const db = getDatabase();
  const observation = db.getFirstSync(
    `SELECT id, river_name, river_region, latitude, longitude, observed_at, created_at
     FROM observations
     ORDER BY observed_at DESC, id DESC
     LIMIT 1`,
  );

  return hydrateObservation(db, observation);
}

/** Returns distinct rivers with saved observations, ordered by each river's latest record. */
export function getSavedAnalysisRivers() {
  const db = getDatabase();
  const rows = db.getAllSync(
    `SELECT id, river_name, river_region, latitude, longitude, observed_at, created_at
     FROM observations o
     WHERE id = (
       SELECT o2.id
       FROM observations o2
       WHERE o2.river_name = o.river_name
         AND EXISTS (
           SELECT 1
           FROM observation_stations s
           WHERE s.observation_id = o2.id
         )
       ORDER BY o2.observed_at DESC, o2.id DESC
       LIMIT 1
     )
     ORDER BY observed_at DESC, id DESC`,
  );

  return rows.map((row) => ({
    name: row.river_name,
    region: row.river_region,
    latitude: row.latitude,
    longitude: row.longitude,
    observedAt: row.observed_at,
    createdAt: row.created_at,
  }));
}

/** Returns the latest saved observation for a given river name, or null. */
export function getLatestObservationByRiver(riverName) {
  if (!riverName) {
    return null;
  }

  const db = getDatabase();
  const observation = db.getFirstSync(
    `SELECT id, river_name, river_region, latitude, longitude, observed_at, created_at
     FROM observations
     WHERE river_name = ?
     ORDER BY observed_at DESC, id DESC
     LIMIT 1`,
    riverName,
  );

  return hydrateObservation(db, observation);
}

/** Returns the total number of saved observation records. */
export function getObservationCount() {
  const db = getDatabase();
  const row = db.getFirstSync('SELECT COUNT(*) AS count FROM observations');
  return Number(row?.count) || 0;
}

/** Atomically deletes all saved observation records and related station/organism rows. */
export function clearAllObservations() {
  const db = getDatabase();
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM observation_organisms');
    db.runSync('DELETE FROM observation_stations');
    db.runSync('DELETE FROM observations');
  });
}
