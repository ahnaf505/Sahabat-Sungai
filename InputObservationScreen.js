import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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

const bioindicators = [
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

export default function InputObservationScreen({ onBack }) {
  const [selectedPoint, setSelectedPoint] = useState(1);
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [observationsByPoint, setObservationsByPoint] = useState(createInitialObservations);
  const [invalidFieldsByPoint, setInvalidFieldsByPoint] = useState({});
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

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

  const handleSave = () => {
    const missingFields = [];
    const nextInvalidFieldsByPoint = {};

    if (!selectedDate) {
      missingFields.push('Tanggal Pengamatan');
    }

    for (const point of STATIONS) {
      const stationParams = observationsByPoint[point]?.parameters ?? INITIAL_PARAMETERS;
      const pointInvalidFields = {};

      for (const { key, label, allowNegative } of parameterRows.flat()) {
        if (parseNumericInput(stationParams[key], { allowNegative }) === null) {
          missingFields.push(`Titik ${point}: ${label}`);
          pointInvalidFields[key] = true;
        }
      }

      if (Object.keys(pointInvalidFields).length > 0) {
        nextInvalidFieldsByPoint[point] = pointInvalidFields;
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

    setSelectedPoint(1);
    setSelectedDate(getToday());
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
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: Math.max(insets.bottom, 16) + 130 + keyboardHeight,
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
        <View style={styles.body}>
          <View style={styles.card}>
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
              {bioindicators.map(({ key, name, source, imageStyle, accessibilityLabel }) => (
                <View key={key} style={styles.bioindicatorItem}>
                  <View style={styles.bioindicatorImageBox}>
                    <Image
                      source={source}
                      style={imageStyle}
                      resizeMode="contain"
                      accessibilityLabel={accessibilityLabel}
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
            <Pressable style={styles.listActionButton} accessibilityRole="button">
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
                          {label ? <Text style={styles.parameterLabel}>{label}</Text> : null}
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

      <DatePickerModal
        visible={datePickerVisible}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        onClose={() => setDatePickerVisible(false)}
      />

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
    paddingTop: 16,
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
    width: 100,
    flexShrink: 1,
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
});
