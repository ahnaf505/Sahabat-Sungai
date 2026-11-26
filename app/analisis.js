import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { formatIsoDateLabel } from '../DatePickerModal';
import LocationModal from '../LocationModal';
import { getLatestObservationByRiver, getSavedAnalysisRivers } from '../observationStorage';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import BarChartIcon from '../assets/icons/bar-chart.svg';
import ChevronRightIcon from '../assets/icons/chevron-right.svg';
import MapPointIcon from '../assets/icons/map-point.svg';
import WarningBadgeIcon from '../assets/icons/warning-badge.svg';
import WaterDropIcon from '../assets/icons/water-drop.svg';
import DiversityLeafIcon from '../assets/icons/diversity-leaf.svg';
import LabFlaskIcon from '../assets/icons/lab-flask.svg';
import PhDropIcon from '../assets/icons/ph-drop.svg';
import PieChartIcon from '../assets/icons/pie-chart.svg';
import SunIcon from '../assets/icons/sun.svg';
import ThermometerIcon from '../assets/icons/thermometer.svg';
import BiodiversityFillIcon from '../assets/icons/biodiversity-fill.svg';
import BiodiversityLineIcon from '../assets/icons/biodiversity-line.svg';

const backgroundGradients = [
  {
    key: 'top',
    colors: ['#CDF1CA', '#FFFFFF', '#FFFFFF', 'rgba(255, 255, 255, 0)'],
    locations: [0.3, 0.52, 0.76, 1],
    styleKey: 'topGradient',
  },
  {
    key: 'bottom',
    colors: ['rgba(255, 255, 255, 0)', '#FFFFFF', '#FFFFFF', '#CDF1CA'],
    locations: [0, 0.24, 0.48, 0.7],
    styleKey: 'bottomGradient',
  },
];

// Tolerance weights (1-10, higher = cleaner water) aligned with bioindicator sensitivity groups.
const TAXON_SCORES = [
  { terms: ['plecoptera'], score: 9 },
  { terms: ['ephemeroptera', 'mayfly', 'lalat sehari'], score: 8 },
  { terms: ['trichoptera', 'caddisfly'], score: 8 },
  { terms: ['megaloptera'], score: 7 },
  { terms: ['odonata', 'capung', 'damselfly', 'dragonfly', 'ept'], score: 6 },
  { terms: ['coleoptera', 'kumbang', 'hemiptera', 'crustacea', 'udang', 'kepiting', 'bivalvia', 'kerang'], score: 5 },
  { terms: ['mollusca'], score: 4 },
  { terms: ['gastropoda', 'siput', 'keong', 'snail'], score: 3 },
  { terms: ['diptera', 'chironomidae', 'chironomid', 'nyamuk', 'lalat'], score: 2 },
  { terms: ['hirudinea', 'lintah', 'annelida'], score: 2 },
  { terms: ['oligochaeta', 'tubifex', 'cacing'], score: 1 },
];
const DEFAULT_TAXON_SCORE = 5;

const getTaxonScore = (organismKey, organismName) => {
  const haystack = `${organismKey ?? ''} ${organismName ?? ''}`.toLowerCase();
  for (const entry of TAXON_SCORES) {
    if (entry.terms.some((term) => haystack.includes(term))) {
      return entry.score;
    }
  }
  return DEFAULT_TAXON_SCORE;
};

const formatIndonesianNumber = (value, maxDecimals = 2, minDecimals = 0) => {
  if (!Number.isFinite(value)) {
    return '0';
  }
  const fixed = value.toFixed(maxDecimals);
  let [intPart, decPart = ''] = fixed.split('.');
  while (decPart.length > minDecimals && decPart.endsWith('0')) {
    decPart = decPart.slice(0, -1);
  }
  return decPart.length > 0 ? `${intPart},${decPart}` : intPart;
};

const hslToHex = (hue, saturation, lightness) => {
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n) => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
};

const getHighContrastColor = (index, total) => {
  const count = Math.max(total, 1);
  const half = Math.ceil(count / 2);
  const colorSlot = index % 2 === 0 ? index / 2 : half + Math.floor(index / 2);
  const hue = (355 + (colorSlot * 360) / count) % 360;
  const isWarmAmber = hue >= 35 && hue <= 75;
  const saturation = isWarmAmber ? 92 : index % 2 === 0 ? 80 : 84;
  const lightness = isWarmAmber ? 45 : index % 2 === 0 ? 44 : 40;
  return hslToHex(hue, saturation, lightness);
};

const aggregateOrganisms = (stations) => {
  const totalsByTaxon = new Map();

  for (const station of stations) {
    for (const organism of station.organisms ?? []) {
      const count = Math.max(0, Number(organism.count) || 0);
      const name = (organism.organism_name ?? organism.name ?? '').trim();
      const key = (organism.organism_key ?? organism.key ?? name).trim();
      const mapKey = name.toLowerCase() || key.toLowerCase();
      if (!mapKey) {
        continue;
      }

      const existing = totalsByTaxon.get(mapKey);
      if (existing) {
        existing.count += count;
      } else {
        totalsByTaxon.set(mapKey, {
          key: key || mapKey,
          label: name || key,
          count,
          score: getTaxonScore(key, name),
        });
      }
    }
  }

  const active = Array.from(totalsByTaxon.values())
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const totalCount = active.reduce((sum, item) => sum + item.count, 0);
  if (totalCount === 0) {
    return { totalCount: 0, active: [], rows: [] };
  }

  // Largest-remainder rounding keeps displayed legend percentages summing to 100%.
  const withExact = active.map((item, index) => {
    const exact = (item.count / totalCount) * 100;
    const floorVal = Math.floor(exact);
    return {
      ...item,
      index,
      percentage: floorVal,
      remainder: exact - floorVal,
    };
  });

  let remainderPoints = 100 - withExact.reduce((sum, item) => sum + item.percentage, 0);
  const byRemainder = [...withExact].sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  for (let i = 0; i < remainderPoints && i < byRemainder.length; i += 1) {
    byRemainder[i].percentage += 1;
  }

  const rows = withExact.map((item, index, list) => ({
    label: item.label,
    count: item.count,
    percentage: item.percentage,
    color: getHighContrastColor(index, list.length),
  }));

  return { totalCount, active, rows };
};

const calculateShannonDiversity = (activeOrganisms, totalCount) => {
  if (totalCount <= 0 || activeOrganisms.length === 0) {
    return 0;
  }
  let index = 0;
  for (const item of activeOrganisms) {
    const proportion = item.count / totalCount;
    if (proportion > 0) {
      index -= proportion * Math.log(proportion);
    }
  }
  return Math.abs(index) < 1e-9 ? 0 : index;
};

const getWaterQualityStatus = (ikaScore, totalCount) => {
  if (totalCount <= 0) {
    return { label: 'Nihil', cardBg: '#FBEBD5', badgeBg: '#C16500', showWarning: true };
  }
  if (ikaScore >= 6.5) {
    return { label: 'Bersih', cardBg: '#D5EED4', badgeBg: '#005E36', showWarning: false };
  }
  if (ikaScore >= 4.5) {
    return { label: 'Cukup Baik', cardBg: '#FDE8BD', badgeBg: '#B45309', showWarning: false };
  }
  if (ikaScore >= 2.5) {
    return { label: 'Kotor', cardBg: '#FBEBD5', badgeBg: '#C16500', showWarning: true };
  }
  return { label: 'Tercemar', cardBg: '#FBD8CA', badgeBg: '#B91C1C', showWarning: true };
};

const formatParameterRange = (stations, fieldKey, unit) => {
  const values = stations
    .map((station) => Number(station[fieldKey]))
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return '-';
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const minText = formatIndonesianNumber(min, 2, 0);
  const maxText = formatIndonesianNumber(max, 2, 0);
  return min === max ? `${minText}${unit}` : `${minText} – ${maxText}${unit}`;
};

const buildAnalysisFromObservation = (observation) => {
  if (!observation || !Array.isArray(observation.stations) || observation.stations.length === 0) {
    return null;
  }

  const { stations } = observation;
  const { totalCount, active, rows } = aggregateOrganisms(stations);
  const ikaValue =
    totalCount > 0
      ? active.reduce((sum, item) => sum + item.count * item.score, 0) / totalCount
      : 0;
  const diversityValue = calculateShannonDiversity(active, totalCount);
  const status = getWaterQualityStatus(ikaValue, totalCount);

  return {
    riverName: observation.river_name,
    riverRegion: observation.river_region,
    observedAtLabel: formatIsoDateLabel(observation.observed_at),
    stationCount: stations.length,
    ikaScore: formatIndonesianNumber(ikaValue, 2, 2),
    status,
    diversityScore: formatIndonesianNumber(diversityValue, 2, 2),
    organismRows: rows,
    parameters: {
      suhu: formatParameterRange(stations, 'suhu', ' °C'),
      ph: formatParameterRange(stations, 'ph', ''),
      kecerahan: formatParameterRange(stations, 'kecerahan', ' cm'),
    },
  };
};

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function createDonutSlicePath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

function DonutChart({ data, size = 126, thickness = 26, gapDegrees = 2 }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 2;
  const innerR = outerR - thickness;
  const total = data.reduce((sum, item) => sum + item.percentage, 0);

  if (total <= 0) {
    return (
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={cx} cy={cy} r={(outerR + innerR) / 2} fill="none" stroke="#E5E7EB" strokeWidth={thickness} />
      </Svg>
    );
  }

  const activeSlices = data.filter((item) => item.percentage > 0);
  if (activeSlices.length === 1) {
    return (
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={cx}
          cy={cy}
          r={(outerR + innerR) / 2}
          fill="none"
          stroke={activeSlices[0].color}
          strokeWidth={thickness}
        />
      </Svg>
    );
  }

  const slices = activeSlices.reduce((acc, item) => {
    const previousEnd = acc.length > 0 ? acc[acc.length - 1].rawEnd : 0;
    const sliceAngle = (item.percentage / total) * 360;
    const rawEnd = previousEnd + sliceAngle;
    acc.push({
      ...item,
      rawEnd,
      startAngle: previousEnd + gapDegrees / 2,
      endAngle: rawEnd - gapDegrees / 2,
    });
    return acc;
  }, []);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map(({ label, color, startAngle, endAngle }) => (
        <Path
          key={label}
          d={createDonutSlicePath(cx, cy, outerR, innerR, startAngle, endAngle)}
          fill={color}
        />
      ))}
    </Svg>
  );
}

export default function AnalisisScreen({ analysisData = null }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [savedRivers, setSavedRivers] = useState([]);
  const [selectedRiverName, setSelectedRiverName] = useState(null);
  const selectedRiverNameRef = useRef(null);
  const [loadedAnalysis, setLoadedAnalysis] = useState(null);
  const [locationsVisible, setLocationsVisible] = useState(false);

  const loadRiverAnalysis = useCallback((preferredRiverName) => {
    try {
      const rivers = getSavedAnalysisRivers();
      setSavedRivers(rivers);

      if (rivers.length === 0) {
        selectedRiverNameRef.current = null;
        setSelectedRiverName(null);
        setLoadedAnalysis(null);
        return;
      }

      const activeRiver =
        rivers.find((river) => river.name === preferredRiverName) ?? rivers[0];
      selectedRiverNameRef.current = activeRiver.name;
      setSelectedRiverName(activeRiver.name);
      const observation = getLatestObservationByRiver(activeRiver.name);
      setLoadedAnalysis(buildAnalysisFromObservation(observation));
    } catch {
      setSavedRivers([]);
      selectedRiverNameRef.current = null;
      setSelectedRiverName(null);
      setLoadedAnalysis(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (analysisData) {
        return;
      }
      loadRiverAnalysis(selectedRiverNameRef.current);
    }, [analysisData, loadRiverAnalysis]),
  );

  const handleSelectRiver = (location) => {
    selectedRiverNameRef.current = location.name;
    setSelectedRiverName(location.name);
    setLocationsVisible(false);
    try {
      const observation = getLatestObservationByRiver(location.name);
      setLoadedAnalysis(buildAnalysisFromObservation(observation));
    } catch {
      setLoadedAnalysis(null);
    }
  };

  const effectiveAnalysis = analysisData ?? loadedAnalysis;
  const selectedLocation =
    savedRivers.find((river) => river.name === selectedRiverName) ?? savedRivers[0] ?? null;
  const hasMultipleRivers = savedRivers.length > 1;
  const statusCardBg = effectiveAnalysis?.status?.cardBg ?? '#FBEBD5';
  const statusBadgeBg = effectiveAnalysis?.status?.badgeBg ?? '#C16500';
  const statusLabel = effectiveAnalysis?.status?.label ?? 'Kotor';
  const showWarningBadge = effectiveAnalysis?.status?.showWarning ?? true;
  const isCompact = width < 380;
  const waterDropSize = isCompact ? 86 : 104;
  const warningBadgeSize = isCompact ? 31 : 37;
  const donutSize = isCompact ? 104 : 126;
  const cardPadding = isCompact ? 18 : 26;

  const riverCardContent = selectedLocation ? (
    <>
      <MapPointIcon width={34} height={34} accessibilityLabel="Lokasi sungai" />
      <View style={styles.riverTextGroup}>
        <Text style={styles.riverEyebrow}>Sungai Dianalisis</Text>
        <Text style={styles.riverName} numberOfLines={1}>{selectedLocation.name}</Text>
        <Text style={styles.riverRegion} numberOfLines={1}>
          {effectiveAnalysis?.observedAtLabel
            ? `${selectedLocation.region} • ${effectiveAnalysis.observedAtLabel}`
            : selectedLocation.region}
        </Text>
      </View>
      {hasMultipleRivers ? <ChevronRightIcon width={11} height={19} color="#000000" /> : null}
    </>
  ) : null;

  return (
    <View style={styles.screen}>
      {backgroundGradients.map(({ key, colors, locations, styleKey }) => (
        <LinearGradient
          key={key}
          pointerEvents="none"
          colors={colors}
          locations={locations}
          style={styles[styleKey]}
        />
      ))}
      <View
        style={[
          styles.stickyHeader,
          {
            paddingTop: insets.top + 16,
            maxWidth: width >= 600 ? 720 : 500,
            paddingHorizontal: width < 360 ? 16 : 24,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Kembali" onPress={() => router.replace('/')} style={styles.backButton}>
            <ArrowLeftIcon width={25} height={25} color="#000000" />
          </Pressable>
          <Text style={styles.title}>Analisis Sungai</Text>
          <BarChartIcon width={31} height={31} color="#005E36" style={styles.rightIcon} />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { maxWidth: width >= 600 ? 720 : 500, paddingTop: 0, paddingBottom: Math.max(insets.bottom, 16) + 130, paddingHorizontal: width < 360 ? 16 : 24 }]}
      >
        {!effectiveAnalysis ? (
          <View style={[styles.emptyCard, { padding: cardPadding }]}>
            <View style={styles.emptyIconBadge}>
              <BarChartIcon width={36} height={36} color="#005E36" />
            </View>
            <Text style={styles.emptyTitle}>Belum Ada Data Analisis</Text>
            <Text style={styles.emptyDescription}>
              Simpan data pengamatan di halaman Input Pengamatan untuk melihat ringkasan kondisi sungai.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Input Pengamatan"
              onPress={() => router.replace('/input-observation')}
              style={styles.emptyActionButton}
            >
              <Text style={styles.emptyActionLabel}>Input Pengamatan</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {selectedLocation ? (
              hasMultipleRivers ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Pilih sungai yang dianalisis: ${selectedLocation.name}, ${selectedLocation.region}`}
                  onPress={() => setLocationsVisible(true)}
                  style={styles.riverCard}
                >
                  {riverCardContent}
                </Pressable>
              ) : (
                <View style={styles.riverCard}>{riverCardContent}</View>
              )
            ) : null}

            <View style={[styles.summaryCard, { backgroundColor: statusCardBg }]}>
              <View style={[styles.waterMarkBox, { width: waterDropSize, height: waterDropSize }]}>
                <WaterDropIcon width={waterDropSize} height={waterDropSize} accessibilityLabel="Status kualitas air" />
                {showWarningBadge ? (
                  <WarningBadgeIcon width={warningBadgeSize} height={warningBadgeSize} style={styles.warningBadge} accessibilityLabel="Peringatan kondisi air" />
                ) : null}
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.ikaLabel}>IKA</Text>
                <View style={styles.scoreRow}>
                  <Text style={styles.ikaScore} numberOfLines={1} adjustsFontSizeToFit>{effectiveAnalysis.ikaScore}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusBadgeBg }]}>
                    <Text style={styles.statusBadgeText}>{statusLabel}</Text>
                  </View>
                </View>
                <Text style={styles.summaryCaption}>
                  {`Gabungan ${effectiveAnalysis.stationCount ?? 3} titik pengamatan bioindikator`}
                </Text>
              </View>
            </View>
            <View style={styles.detailCard}>
              <View pointerEvents="none" style={styles.detailCardIllustration}>
                <BiodiversityFillIcon width={154} height={47} style={styles.detailCardIllustrationFill} />
                <BiodiversityLineIcon width={159} height={53} style={styles.detailCardIllustrationLine} />
              </View>
              <DiversityLeafIcon width={29} height={32} accessibilityLabel="Keanekaragaman" />
              <View style={styles.detailCardTextGroup}>
                <Text style={styles.detailCardTitle}>Keanekaragaman H’</Text>
                <Text style={styles.detailCardScore}>{effectiveAnalysis.diversityScore}</Text>
              </View>
            </View>

            <View style={[styles.card, { padding: cardPadding }]}>
              <View style={styles.cardHeading}><PieChartIcon width={32} height={32} accessibilityLabel="Komposisi organisme" /><Text style={styles.cardTitle}>Komposisi Organisme</Text></View>
              <View style={styles.compositionContent}>
                <DonutChart data={effectiveAnalysis.organismRows} size={donutSize} thickness={isCompact ? 22 : 26} />
                <View style={styles.legend}>
                  {effectiveAnalysis.organismRows.length > 0 ? (
                    effectiveAnalysis.organismRows.map(({ label, percentage, color }) => (
                      <View key={label} style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: color }]} />
                        <Text style={styles.legendLabel} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
                        <Text style={styles.legendValue}>{`${percentage}%`}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyLegendText}>
                      Belum ada organisme tercatat pada 3 titik pengamatan.
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={[styles.card, { padding: cardPadding }]}>
              <View style={styles.cardHeading}><LabFlaskIcon width={24} height={28} accessibilityLabel="Parameter pendukung" /><Text style={styles.cardTitle}>Parameter Pendukung</Text></View>
              <View style={styles.parameterGrid}>
                <View style={styles.parameter}><ThermometerIcon width={18} height={39} accessibilityLabel="Suhu" /><Text style={styles.parameterLabel}>Suhu</Text><Text style={styles.parameterValue} numberOfLines={1} adjustsFontSizeToFit>{effectiveAnalysis.parameters.suhu}</Text></View>
                <View style={styles.divider} />
                <View style={styles.parameter}><PhDropIcon width={27} height={39} accessibilityLabel="pH" /><Text style={styles.parameterLabel}>pH</Text><Text style={styles.parameterValue} numberOfLines={1} adjustsFontSizeToFit>{effectiveAnalysis.parameters.ph}</Text></View>
                <View style={styles.divider} />
                <View style={styles.parameter}><SunIcon width={39} height={39} accessibilityLabel="Kecerahan" /><Text style={styles.parameterLabel}>Kecerahan</Text><Text style={styles.parameterValue} numberOfLines={1} adjustsFontSizeToFit>{effectiveAnalysis.parameters.kecerahan}</Text></View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      {hasMultipleRivers ? (
        <LocationModal
          visible={locationsVisible}
          locations={savedRivers}
          selectedLocation={selectedLocation}
          onClose={() => setLocationsVisible(false)}
          onSelect={handleSelectRiver}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: '42%' },
  bottomGradient: { position: 'absolute', top: '42%', left: 0, right: 0, bottom: 0 },
  content: { flexGrow: 1, width: '100%', maxWidth: 500, alignSelf: 'center' },
  stickyHeader: { width: '100%', maxWidth: 500, alignSelf: 'center', paddingBottom: 16, zIndex: 10 },
  headerRow: { minHeight: 55, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', left: 0, width: 55, height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 27.5, backgroundColor: '#FFFFFF' },
  rightIcon: { position: 'absolute', right: 0 },
  title: { paddingHorizontal: 64, color: '#000000', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 20, lineHeight: 20, letterSpacing: 0, paddingVertical: 2, textAlign: 'center' },
  riverCard: { width: '100%', marginTop: 2, marginBottom: 14, paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', borderRadius: 22, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 3px 0px #0000001F', elevation: 2 },
  riverTextGroup: { flex: 1, marginLeft: 12, marginRight: 12 },
  riverEyebrow: { color: '#005E36', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 11.5, lineHeight: 15 },
  riverName: { marginTop: 2, color: '#000000', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 15.5, lineHeight: 20 },
  riverRegion: { color: '#4B5563', fontFamily: 'Poppins-Regular', fontWeight: '400', fontSize: 13, lineHeight: 17 },
  summaryCard: { width: '100%', minHeight: 160, marginTop: 2, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 25, backgroundColor: '#FBEBD5' },
  waterMarkBox: { width: 104, height: 104, position: 'relative' },
  warningBadge: { position: 'absolute', left: 6, bottom: 4 },
  summaryContent: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  ikaLabel: { color: '#000000', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 20, lineHeight: 20, paddingVertical: 2 },
  scoreRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  ikaScore: { color: '#000000', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 45, lineHeight: 45, includeFontPadding: false, flexShrink: 1 },
  statusBadge: { paddingHorizontal: 22, paddingVertical: 8, borderRadius: 999, backgroundColor: '#C16500', alignItems: 'center', justifyContent: 'center' },
  statusBadgeText: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 20, lineHeight: 20, paddingVertical: 2 },
  summaryCaption: { marginTop: 2, color: '#000000', fontFamily: 'Poppins-Regular', fontWeight: '400', fontSize: 12.5, lineHeight: 18, includeFontPadding: false },
  detailCard: { width: '100%', minHeight: 90, marginTop: 16, paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 14, overflow: 'hidden', borderRadius: 25, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 3px 0px #0000001F', elevation: 2 },
  detailCardTextGroup: { flex: 1, justifyContent: 'center' },
  detailCardIllustration: { position: 'absolute', right: -2, bottom: -2, width: 159, height: 53 },
  detailCardIllustrationFill: { position: 'absolute', right: 0, bottom: 0 },
  detailCardIllustrationLine: { position: 'absolute', right: 0, bottom: 0 },
  detailCardTitle: { color: '#000000', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 15, lineHeight: 18, letterSpacing: 0 },
  detailCardScore: { marginTop: 4, color: '#000000', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 35, lineHeight: 38, letterSpacing: 0, includeFontPadding: false },
  card: { marginTop: 22, padding: 26, borderRadius: 30, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 3px 0px #0000001F', elevation: 2 },
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: 17 },
  cardTitle: { color: '#101010', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 15, lineHeight: 15, letterSpacing: 0, includeFontPadding: false },
  compositionContent: { marginTop: 16, flexDirection: 'row', alignItems: 'center' },
  legend: { flex: 1, marginLeft: 16, gap: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 14, height: 14, marginRight: 10, borderRadius: 7 },
  legendLabel: { flex: 1, marginRight: 8, color: '#101010', fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 18 },
  legendValue: { color: '#101010', fontFamily: 'Poppins-SemiBold', fontSize: 14, lineHeight: 18 },
  emptyLegendText: { color: '#4B5563', fontFamily: 'Poppins-Regular', fontSize: 13, lineHeight: 19 },
  parameterGrid: { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  parameter: { flex: 1, alignItems: 'center' },
  divider: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', backgroundColor: '#777' },
  parameterLabel: { marginTop: 5, color: '#101010', fontFamily: 'Poppins-Regular', fontSize: 12, lineHeight: 16 },
  parameterValue: { marginTop: 2, color: '#101010', fontFamily: 'Poppins-Bold', fontSize: 13, lineHeight: 18, textAlign: 'center' },
  emptyCard: { marginTop: 12, borderRadius: 25, backgroundColor: '#FFFFFF', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
  emptyIconBadge: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EDF7F0', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { color: '#000000', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 18, lineHeight: 24, textAlign: 'center' },
  emptyDescription: { marginTop: 8, color: '#4B5563', fontFamily: 'Poppins-Regular', fontSize: 13.5, lineHeight: 20, textAlign: 'center' },
  emptyActionButton: { marginTop: 20, paddingHorizontal: 22, height: 42, borderRadius: 15, backgroundColor: '#005E36', alignItems: 'center', justifyContent: 'center' },
  emptyActionLabel: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 14, lineHeight: 18, includeFontPadding: false },
});
