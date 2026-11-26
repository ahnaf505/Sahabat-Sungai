import { useEffect, useMemo, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Storage from 'expo-sqlite/kv-store';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DatePickerModal, { formatIndonesianDate } from './DatePickerModal';
import LocationModal, { riverLocations } from './LocationModal';
import { getCustomRivers, saveObservation } from './observationStorage';
import ArrowLeftIcon from './assets/icons/arrow-left.svg';
import BugIcon from './assets/icons/bug.svg';
import CalendarWeekIcon from './assets/icons/calendar-week.svg';
import ChevronDownIcon from './assets/icons/chevron-down.svg';
import MapPointIcon from './assets/icons/map-point.svg';
import MinusIcon from './assets/icons/minus.svg';
import PlusIcon from './assets/icons/plus.svg';
import SaveIcon from './assets/icons/save.svg';
import SproutIcon from './assets/icons/sprout.svg';

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

const parameterRows = [
  [
    { key: 'suhu', label: 'Suhu (°C)', allowNegative: true },
    { key: 'kedalaman', label: 'Kedalaman (cm)', allowNegative: false },
  ],
  [
    { key: 'kecerahan', label: 'Kecerahan (cm)', allowNegative: false },
    { key: 'ph', label: 'pH', allowNegative: false },
  ],
];

const sanitizeNumericInput = (value, { allowNegative = false, maxDecimals = 2 } = {}) => {
  let result = '';
  let hasDecimal = false;
  let decimalDigits = 0;

  for (const char of value) {
    if (char >= '0' && char <= '9') {
      if (hasDecimal) {
        if (decimalDigits >= maxDecimals) {
          continue;
        }
        decimalDigits += 1;
      }
      result += char;
    } else if (allowNegative && char === '-' && result.length === 0) {
      result += char;
    } else if ((char === '.' || char === ',') && !hasDecimal) {
      hasDecimal = true;
      result += char;
    }
  }

  return result;
};

const parseNumericInput = (raw, { allowNegative = false, maxDecimals = 2 } = {}) => {
  const normalized = (raw ?? '').trim().replace(',', '.');
  const decimalPart = `\\.\\d{1,${maxDecimals}}`;
  const pattern = new RegExp(
    allowNegative
      ? `^-?(?:\\d+(?:${decimalPart})?|${decimalPart})$`
      : `^(?:\\d+(?:${decimalPart})?|${decimalPart})$`,
  );

  if (!pattern.test(normalized)) {
    return null;
  }

  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
};

const CUSTOM_ORGANISM_IMAGE = require('./assets/images/odonata-silhouette.png');
const CUSTOM_ORGANISM_IMAGE_STYLE = { width: 44, height: 44 };

const defaultBioindicators = [
  {
    key: 'gastropoda',
    name: 'Gastropoda',
    source: require('./assets/images/snail-bioindicator.png'),
    imageStyle: { width: 47, height: 49 },
    accessibilityLabel: 'Bioindikator Gastropoda',
  },
  {
    key: 'odonata',
    name: 'Odonata',
    source: require('./assets/images/odonata-bioindicator.png'),
    imageStyle: { width: 44, height: 44 },
    accessibilityLabel: 'Bioindikator Odonata',
  },
];

const STATIONS = [1, 2, 3];
const OBSERVATION_DRAFT_STORAGE_KEY = 'pantau_observation_draft_v1';
const INITIAL_COUNTS = { gastropoda: 0, odonata: 0 };
const INITIAL_PARAMETERS = { suhu: '', kedalaman: '', kecerahan: '', ph: '' };
const createInitialStationData = () => ({
  counts: { ...INITIAL_COUNTS },
  parameters: { ...INITIAL_PARAMETERS },
});
const createInitialObservations = () =>
  Object.fromEntries(STATIONS.map((point) => [point, createInitialStationData()]));
const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const serializeDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};

const deserializeDate = (value) => {
  if (!value || typeof value !== 'object') {
    return getToday();
  }
  const { year, month, day } = value;
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return getToday();
  }
  const parsed = new Date(year, month, day);
  return Number.isNaN(parsed.getTime()) ? getToday() : parsed;
};

const loadPersistedDraft = () => {
  const fallback = {
    selectedPoint: 1,
    selectedLocation: riverLocations[0],
    selectedDate: getToday(),
    customOrganisms: [],
    observationsByPoint: createInitialObservations(),
  };

  try {
    const raw = Storage.getItemSync(OBSERVATION_DRAFT_STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    const selectedPoint = STATIONS.includes(parsed?.selectedPoint) ? parsed.selectedPoint : 1;
    const savedLocation = parsed?.selectedLocation;
    const storedLocations = getCustomRivers();
    const selectedLocation =
      [...storedLocations, ...riverLocations].find((loc) => loc.name === savedLocation?.name) ??
      (savedLocation &&
      typeof savedLocation.name === 'string' &&
      typeof savedLocation.region === 'string' &&
      typeof savedLocation.latitude === 'number' &&
      typeof savedLocation.longitude === 'number'
        ? savedLocation
        : riverLocations[0]);
    const customOrganisms = Array.isArray(parsed?.customOrganisms)
      ? parsed.customOrganisms.filter(
          (item) =>
            item &&
            typeof item.key === 'string' &&
            item.key.length > 0 &&
            typeof item.name === 'string' &&
            item.name.trim().length > 0,
        )
      : [];
    const observationsByPoint = Object.fromEntries(
      STATIONS.map((point) => {
        const savedStation = parsed?.observationsByPoint?.[point];
        const savedCounts = savedStation?.counts ?? {};
        const savedParams = savedStation?.parameters ?? {};
        const customCounts = Object.fromEntries(
          customOrganisms.map(({ key }) => [key, Math.max(0, Number(savedCounts[key]) || 0)]),
        );

        return [
          point,
          {
            counts: {
              ...customCounts,
              gastropoda: Math.max(0, Number(savedCounts.gastropoda) || 0),
              odonata: Math.max(0, Number(savedCounts.odonata) || 0),
            },
            parameters: {
              suhu: typeof savedParams.suhu === 'string' ? savedParams.suhu : '',
              kedalaman: typeof savedParams.kedalaman === 'string' ? savedParams.kedalaman : '',
              kecerahan: typeof savedParams.kecerahan === 'string' ? savedParams.kecerahan : '',
              ph: typeof savedParams.ph === 'string' ? savedParams.ph : '',
            },
          },
        ];
      }),
    );

    return { selectedPoint, selectedLocation, selectedDate, customOrganisms, observationsByPoint };
  } catch {
    return fallback;
  }
};

export default function InputObservationScreen({ onBack }) {
  const initialDraft = useMemo(() => loadPersistedDraft(), []);
  const [selectedPoint, setSelectedPoint] = useState(initialDraft.selectedPoint);
  const [selectedLocation, setSelectedLocation] = useState(initialDraft.selectedLocation);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDraft.selectedDate);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [customOrganisms, setCustomOrganisms] = useState(initialDraft.customOrganisms);
  const [addOrganismModalVisible, setAddOrganismModalVisible] = useState(false);
  const [newOrganismName, setNewOrganismName] = useState('');
  const [newOrganismError, setNewOrganismError] = useState('');
  const [observationsByPoint, setObservationsByPoint] = useState(initialDraft.observationsByPoint);
  const [invalidFieldsByPoint, setInvalidFieldsByPoint] = useState({});
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  useEffect(() => {
    try {
      Storage.setItemSync(
        OBSERVATION_DRAFT_STORAGE_KEY,
        JSON.stringify({
          selectedPoint,
          selectedLocation,
          selectedDate: serializeDate(selectedDate),
          customOrganisms,
          observationsByPoint,
        }),
      );
    } catch {
      // Ignore storage write failures so input remains responsive.
    }
  }, [selectedPoint, selectedLocation, selectedDate, customOrganisms, observationsByPoint]);

  const currentStationData = selectedPoint ? observationsByPoint[selectedPoint] : null;
  const counts = currentStationData?.counts ?? INITIAL_COUNTS;
  const parameters = currentStationData?.parameters ?? INITIAL_PARAMETERS;
  const invalidFields = selectedPoint ? (invalidFieldsByPoint[selectedPoint] ?? {}) : {};

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates?.height ?? 0);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const updateCount = (key, delta) => {
    if (!selectedPoint) {
      return;
    }

    setObservationsByPoint((prev) => {
      const station = prev[selectedPoint] ?? createInitialStationData();
      return {
        ...prev,
        [selectedPoint]: {
          ...station,
          counts: {
            ...station.counts,
            [key]: Math.max(0, (station.counts[key] ?? 0) + delta),
          },
        },
      };
    });
  };

  const handleParameterKeyPress = (event, fieldKey, allowNegative) => {
    const pressedKey = event.nativeEvent?.key ?? event.key;
    const hasModifier = Boolean(
      event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.nativeEvent?.ctrlKey ||
        event.nativeEvent?.metaKey ||
        event.nativeEvent?.altKey,
    );

    if (!pressedKey || pressedKey.length > 1 || hasModifier) {
      return;
    }

    const current = parameters[fieldKey] ?? '';
    const target = event.target;
    const start = typeof target?.selectionStart === 'number' ? target.selectionStart : current.length;
    const end = typeof target?.selectionEnd === 'number' ? target.selectionEnd : current.length;
    const nextValue = current.slice(0, start) + pressedKey + current.slice(end);

    if (sanitizeNumericInput(nextValue, { allowNegative }) !== nextValue) {
      event.preventDefault?.();
    }
  };

  const allBioindicators = [...defaultBioindicators, ...customOrganisms];

  const closeAddOrganismModal = () => {
    setAddOrganismModalVisible(false);
    setNewOrganismName('');
    setNewOrganismError('');
  };

  const handleAddOrganism = () => {
    const trimmedName = newOrganismName.trim();
    if (!trimmedName) {
      setNewOrganismError('Nama organisme tidak boleh kosong.');
      return;
    }

    const exists = allBioindicators.some(
      (item) => item.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (exists) {
      setNewOrganismError('Organisme sudah ada di daftar.');
      return;
    }

    const key = `custom-${Date.now()}`;
    setCustomOrganisms((prev) => [...prev, { key, name: trimmedName }]);
    closeAddOrganismModal();
  };

  const handleSave = () => {
    const missingFields = [];
    const nextInvalidFieldsByPoint = {};
    const parsedStations = [];

    if (!selectedLocation) {
      missingFields.push('Nama Sungai');
    }
    if (!selectedDate) {
      missingFields.push('Tanggal Pengamatan');
    }

    for (const point of STATIONS) {
      const stationData = observationsByPoint[point];
      const stationParams = stationData?.parameters ?? INITIAL_PARAMETERS;
      const stationCounts = stationData?.counts ?? INITIAL_COUNTS;
      const pointInvalidFields = {};
      const parsedParams = {};

      for (const { key, label, allowNegative } of parameterRows.flat()) {
        const numeric = parseNumericInput(stationParams[key], { allowNegative });
        if (numeric === null) {
          missingFields.push(`Titik ${point}: ${label}`);
          pointInvalidFields[key] = true;
        } else {
          parsedParams[key] = numeric;
        }
      }

      if (Object.keys(pointInvalidFields).length > 0) {
        nextInvalidFieldsByPoint[point] = pointInvalidFields;
      } else {
        parsedStations.push({
          point,
          ...parsedParams,
          organisms: allBioindicators.map(({ key, name }) => ({
            key,
            name,
            count: Math.max(0, Number(stationCounts[key]) || 0),
          })),
        });
      }
    }

    if (missingFields.length > 0) {
      setInvalidFieldsByPoint(nextInvalidFieldsByPoint);
      setFeedbackModal({
        type: 'error',
        title: 'Data Belum Lengkap',
        message: `Harap lengkapi semua kolom dengan benar:\n• ${missingFields.join('\n• ')}`,
      });
      return;
    }

    try {
      saveObservation({
        location: selectedLocation,
        date: selectedDate,
        stations: parsedStations,
      });
    } catch {
      setFeedbackModal({
        type: 'error',
        title: 'Gagal Menyimpan',
        message: 'Terjadi kesalahan saat menyimpan data pengamatan ke penyimpanan lokal.',
      });
      return;
    }

    setSelectedPoint(1);
    setSelectedLocation(riverLocations[0]);
    setSelectedDate(getToday());
    setCustomOrganisms([]);
    setObservationsByPoint(createInitialObservations());
    setInvalidFieldsByPoint({});
    setFeedbackModal({
      type: 'success',
      title: 'Data Tersimpan',
      message: 'Data pengamatan berhasil disimpan.',
    });
  };

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
            maxWidth: width >= 600 ? 720 : 500,
            paddingTop: insets.top + 16,
            paddingHorizontal: width < 360 ? 16 : 24,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            onPress={onBack ?? (() => router.replace('/'))}
            style={styles.backButton}
          >
            <ArrowLeftIcon width={25} height={25} color="#000000" />
          </Pressable>
          <Text style={styles.title}>Input Pengamatan</Text>
          <SproutIcon width={30} height={29} color="#049E4C" style={styles.rightIcon} />
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: width >= 600 ? 720 : 500,
            paddingTop: 0,
            paddingBottom: Math.max(insets.bottom, 16) + 130 + keyboardHeight,
            paddingHorizontal: width < 360 ? 16 : 24,
          },
        ]}
      >
        <View style={[styles.body, width >= 600 && { flex: 0 }]}>
          <View style={[styles.card, width >= 600 && { flex: 0 }]}>
            <View style={styles.cardHeader}>
              <MapPointIcon width={38} height={38} accessibilityLabel="Lokasi sungai" />
              <Text style={styles.cardHeaderTitle}>Titik Pengamatan</Text>
            </View>
            <View style={styles.stationRow}>
              {STATIONS.map((point) => {
                const isSelected = selectedPoint === point;

                return (
                  <Pressable
                    key={point}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelectedPoint(point)}
                    style={[styles.stationBox, isSelected && styles.stationBoxActive]}
                  >
                    <Text
                      style={[styles.stationBoxLabel, isSelected && styles.stationBoxLabelActive]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {`Titik ${point}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.dateHeader}>
              <MapPointIcon width={28} height={28} accessibilityLabel="Nama sungai" />
              <Text style={styles.dateHeaderTitle}>Nama Sungai</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pilih nama sungai"
              onPress={() => setLocationModalVisible(true)}
              style={styles.dateInputBox}
            >
              <Text
                style={[styles.dateInputText, !selectedLocation && styles.dateInputPlaceholder]}
                numberOfLines={1}
              >
                {selectedLocation ? selectedLocation.name : 'Pilih nama sungai'}
              </Text>
              <ChevronDownIcon width={18} height={10} color="#000000" style={styles.dateInputChevron} />
            </Pressable>
            <View style={styles.dateHeader}>
              <CalendarWeekIcon width={28} height={28} accessibilityLabel="Tanggal pengamatan" />
              <Text style={styles.dateHeaderTitle}>Tanggal Pengamatan</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pilih tanggal pengamatan"
              onPress={() => setDatePickerVisible(true)}
              style={styles.dateInputBox}
            >
              <Text style={[styles.dateInputText, !selectedDate && styles.dateInputPlaceholder]}>
                {selectedDate ? formatIndonesianDate(selectedDate) : 'Pilih tanggal'}
              </Text>
              <ChevronDownIcon width={18} height={10} color="#000000" style={styles.dateInputChevron} />
            </Pressable>
            <View style={styles.sectionHeader}>
              <BugIcon width={28} height={28} accessibilityLabel="Bioindikator" />
              <Text style={styles.sectionHeaderTitle}>Makroinvertebrata</Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.bioindicatorList}>
              {allBioindicators.map(({ key, name, source, imageStyle, accessibilityLabel }) => (
                <View key={key} style={styles.bioindicatorItem}>
                  <View style={styles.bioindicatorImageBox}>
                    <Image
                      source={source ?? CUSTOM_ORGANISM_IMAGE}
                      style={imageStyle ?? CUSTOM_ORGANISM_IMAGE_STYLE}
                      resizeMode="contain"
                      accessibilityLabel={accessibilityLabel ?? `Bioindikator ${name}`}
                    />
                  </View>
                  <View style={styles.bioindicatorInfo}>
                    <Text style={styles.bioindicatorName}>{name}</Text>
                  </View>
                  <View style={styles.counterGroup}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Kurangi jumlah ${name}`}
                      onPress={() => updateCount(key, -1)}
                      style={styles.counterButton}
                    >
                      <MinusIcon width={14} height={2} />
                    </Pressable>
                    <Text style={styles.counterValue}>{counts[key] ?? 0}</Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Tambah jumlah ${name}`}
                      onPress={() => updateCount(key, 1)}
                      style={styles.counterButton}
                    >
                      <PlusIcon width={12} height={12} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
            <Pressable
              style={styles.listActionButton}
              accessibilityRole="button"
              onPress={() => setAddOrganismModalVisible(true)}
            >
              <PlusIcon width={12} height={12} />
              <Text style={styles.listActionButtonLabel}>Tambah Organisme</Text>
            </Pressable>
            <View style={[styles.sectionHeader, styles.chemicalSectionHeader]}>
              <View style={styles.sectionIconBox}>
                <Image
                  source={require('./assets/icons/flask.png')}
                  style={styles.flaskIcon}
                  resizeMode="contain"
                  accessibilityLabel="Parameter fisik dan kimia"
                />
              </View>
              <Text style={styles.sectionHeaderTitle}>Parameter Fisik &amp; Kimia</Text>
            </View>
            <View style={styles.parameterGrid}>
              {parameterRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.parameterRow}>
                  {row.map(({ key, label, allowNegative }) => {
                    const isInvalid = Boolean(invalidFields[key]);

                    return (
                      <View
                        key={key}
                        style={[styles.parameterBox, isInvalid && styles.parameterBoxError]}
                      >
                        <View style={styles.parameterTopBox}>
                          {label ? (
                            <Text style={styles.parameterLabel} numberOfLines={1} adjustsFontSizeToFit>
                              {label}
                            </Text>
                          ) : null}
                        </View>
                        <TextInput
                          style={[styles.parameterInput, isInvalid && styles.parameterInputError]}
                          value={parameters[key]}
                          editable={Boolean(selectedPoint)}
                          onKeyPress={(event) => handleParameterKeyPress(event, key, allowNegative)}
                          onChangeText={(value) => {
                            if (!selectedPoint) {
                              return;
                            }

                            const sanitized = sanitizeNumericInput(value, { allowNegative });
                            setObservationsByPoint((prev) => {
                              const station = prev[selectedPoint] ?? createInitialStationData();
                              return {
                                ...prev,
                                [selectedPoint]: {
                                  ...station,
                                  parameters: {
                                    ...station.parameters,
                                    [key]: sanitized,
                                  },
                                },
                              };
                            });
                            if (invalidFields[key]) {
                              setInvalidFieldsByPoint((prev) => ({
                                ...prev,
                                [selectedPoint]: {
                                  ...(prev[selectedPoint] ?? {}),
                                  [key]: false,
                                },
                              }));
                            }
                          }}
                          keyboardType="decimal-pad"
                          inputMode="decimal"
                          autoCorrect={false}
                          autoCapitalize="none"
                          spellCheck={false}
                          onFocus={() => {
                            setTimeout(() => {
                              scrollViewRef.current?.scrollToEnd({ animated: true });
                            }, 100);
                          }}
                          accessibilityLabel={label}
                        />
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
            <Pressable style={styles.submitButton} accessibilityRole="button" onPress={handleSave}>
              <SaveIcon width={18} height={18} />
              <Text style={styles.submitButtonLabel}>Simpan Data</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
        selectedLocation={selectedLocation}
        onSelect={(location) => {
          setSelectedLocation(location);
          setLocationModalVisible(false);
        }}
      />

      <DatePickerModal
        visible={datePickerVisible}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        onClose={() => setDatePickerVisible(false)}
      />

      <Modal
        visible={addOrganismModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAddOrganismModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeAddOrganismModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Tambah Organisme</Text>
            <TextInput
              style={[styles.addOrganismInput, Boolean(newOrganismError) && styles.addOrganismInputError]}
              value={newOrganismName}
              onChangeText={(text) => {
                setNewOrganismName(text);
                if (newOrganismError) {
                  setNewOrganismError('');
                }
              }}
              placeholder="Nama organisme"
              placeholderTextColor="#8C8C8C"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAddOrganism}
              accessibilityLabel="Nama organisme"
            />
            {newOrganismError ? <Text style={styles.addOrganismErrorText}>{newOrganismError}</Text> : null}
            <View style={styles.modalActionRow}>
              <Pressable
                accessibilityRole="button"
                onPress={closeAddOrganismModal}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelLabel}>Batal</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleAddOrganism}
                style={styles.modalConfirmButton}
              >
                <Text style={styles.modalOkLabel}>Tambah</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={Boolean(feedbackModal)}
        transparent
        animationType="fade"
        onRequestClose={() => setFeedbackModal(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setFeedbackModal(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View
              style={[
                styles.modalBadge,
                feedbackModal?.type === 'error' ? styles.modalBadgeError : styles.modalBadgeSuccess,
              ]}
            >
              <Text
                style={[
                  styles.modalBadgeText,
                  feedbackModal?.type === 'error' ? styles.modalBadgeTextError : styles.modalBadgeTextSuccess,
                ]}
              >
                {feedbackModal?.type === 'error' ? '!' : '✓'}
              </Text>
            </View>
            <Text style={styles.modalTitle}>{feedbackModal?.title}</Text>
            <Text style={styles.modalMessage}>{feedbackModal?.message}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setFeedbackModal(null)}
              style={styles.modalOkButton}
            >
              <Text style={styles.modalOkLabel}>OK</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <StatusBar style="dark" />
    </View>
  );
}

const poppinsSemiBold20 = {
  color: '#000000',
  fontFamily: 'Poppins-SemiBold',
  fontWeight: '600',
  fontSize: 20,
  lineHeight: 20,
  letterSpacing: 0,
  paddingVertical: 2,
};

const poppinsSemiBold16 = {
  color: '#000000',
  fontFamily: 'Poppins-SemiBold',
  fontWeight: '600',
  fontSize: 16,
  lineHeight: 16,
  letterSpacing: 0,
  paddingVertical: 2,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '42%',
  },
  bottomGradient: {
    position: 'absolute',
    top: '42%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flexGrow: 1,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  stickyHeader: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 16,
    zIndex: 10,
  },
  headerRow: {
    minHeight: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27.5,
    backgroundColor: '#FFFFFF',
  },
  rightIcon: {
    position: 'absolute',
    right: 0,
  },
  title: {
    ...poppinsSemiBold20,
    paddingHorizontal: 64,
    textAlign: 'center',
  },
  body: {
    flex: 1,
    paddingTop: 2,
  },
  card: {
    flex: 1,
    width: '100%',
    minHeight: 460,
    padding: 20,
    alignItems: 'flex-start',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0000000D',
    boxShadow: '0px 4px 4px 0px #00000040',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardHeaderTitle: {
    ...poppinsSemiBold20,
    flexShrink: 1,
  },
  stationRow: {
    width: '100%',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stationBox: {
    flex: 1,
    height: 53,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#EDF7F0',
  },
  stationBoxActive: {
    backgroundColor: '#005E36',
  },
  stationBoxLabel: {
    ...poppinsSemiBold20,
  },
  stationBoxLabelActive: {
    color: '#FFFFFF',
  },
  dateHeader: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateHeaderTitle: {
    ...poppinsSemiBold16,
    flexShrink: 1,
  },
  dateInputBox: {
    width: '100%',
    height: 42,
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BABABA',
    backgroundColor: '#FFFFFF',
  },
  dateInputChevron: {
    marginLeft: 'auto',
  },
  dateInputText: {
    flexShrink: 1,
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingVertical: 2,
  },
  dateInputPlaceholder: {
    color: '#8C8C8C',
  },
  sectionHeader: {
    marginTop: 16,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chemicalSectionHeader: {
    marginTop: 24,
  },
  sectionIconBox: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flaskIcon: {
    width: 17,
    height: 24,
  },
  parameterGrid: {
    width: '100%',
    marginTop: 12,
    gap: 12,
  },
  parameterRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  parameterBox: {
    flex: 1,
    height: 57,
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1.1,
    borderColor: '#C4C3C3',
    backgroundColor: '#FFFFFF',
  },
  parameterBoxError: {
    borderColor: '#B91C1C',
  },
  parameterTopBox: {
    height: 26.31,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  parameterLabel: {
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 8.77,
    lineHeight: 8.77,
    letterSpacing: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingVertical: 1,
  },
  parameterInput: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30.69,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 16,
    borderWidth: 1.1,
    borderColor: '#C4C3C3',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  parameterInputError: {
    borderColor: '#B91C1C',
  },
  sectionHeaderTitle: {
    ...poppinsSemiBold16,
    flexShrink: 1,
  },
  sectionDivider: {
    width: '94%',
    alignSelf: 'center',
    height: 1,
    marginTop: 8,
    backgroundColor: '#00000012',
  },
  bioindicatorList: {
    width: '100%',
    marginTop: 6,
    paddingHorizontal: 10,
    gap: 12,
  },
  listActionButton: {
    width: '100%',
    height: 32,
    marginTop: 12,
    borderRadius: 15,
    backgroundColor: '#EDF7F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  listActionButtonLabel: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingVertical: 3,
  },
  bioindicatorItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bioindicatorImageBox: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioindicatorInfo: {
    flex: 1,
  },
  bioindicatorName: {
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  counterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterButton: {
    width: 29.16,
    height: 29.16,
    borderRadius: 14.58,
    backgroundColor: '#EDF7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    minWidth: 16,
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 13.33,
    lineHeight: 13.33,
    letterSpacing: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  submitButton: {
    width: '100%',
    height: 36,
    marginTop: 16,
    borderRadius: 15,
    backgroundColor: '#1C5C3D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonLabel: {
    ...poppinsSemiBold16,
    color: '#FFFFFF',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  modalBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalBadgeSuccess: {
    backgroundColor: '#EDF7F0',
  },
  modalBadgeError: {
    backgroundColor: '#FAD2C8',
  },
  modalBadgeText: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalBadgeTextSuccess: {
    color: '#1C5C3D',
  },
  modalBadgeTextError: {
    color: '#B91C1C',
  },
  modalTitle: {
    ...poppinsSemiBold20,
    textAlign: 'center',
  },
  modalMessage: {
    marginTop: 8,
    color: '#374151',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalOkButton: {
    marginTop: 18,
    width: '100%',
    height: 40,
    borderRadius: 14,
    backgroundColor: '#1C5C3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOkLabel: {
    ...poppinsSemiBold16,
    color: '#FFFFFF',
  },
  addOrganismInput: {
    width: '100%',
    height: 42,
    marginTop: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C4C3C3',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    includeFontPadding: false,
  },
  addOrganismInputError: {
    borderColor: '#B91C1C',
  },
  addOrganismErrorText: {
    width: '100%',
    marginTop: 6,
    color: '#B91C1C',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  modalActionRow: {
    width: '100%',
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#EDF7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelLabel: {
    ...poppinsSemiBold16,
    color: '#1C5C3D',
  },
  modalConfirmButton: {
    flex: 1,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#1C5C3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
