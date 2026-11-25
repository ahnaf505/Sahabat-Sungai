import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from './assets/icons/arrow-left.svg';
import BugIcon from './assets/icons/bug.svg';
import CalendarWeekIcon from './assets/icons/calendar-week.svg';
import ChevronDownIcon from './assets/icons/chevron-down.svg';
import MapPointIcon from './assets/icons/map-point.svg';
import MinusIcon from './assets/icons/minus.svg';
import PlusIcon from './assets/icons/plus.svg';
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

export default function InputObservationScreen({ onBack }) {
  const [selectedPoint, setSelectedPoint] = useState(1);
  const [counts, setCounts] = useState({ gastropoda: 0, odonata: 0 });
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const updateCount = (key, delta) => {
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] ?? 0) + delta),
    }));
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: Math.max(insets.bottom, 16) + 130,
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
              {[1, 2, 3].map((point) => {
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
            <View style={styles.dateInputBox}>
              <Text style={styles.dateInputText}>14 oktober 2026</Text>
              <ChevronDownIcon width={18} height={10} color="#000000" style={styles.dateInputChevron} />
            </View>
            <View style={styles.sectionHeader}>
              <BugIcon width={28} height={28} accessibilityLabel="Bioindikator" />
              <Text style={styles.bioindicatorHeaderTitle}>Makroinvertebrata</Text>
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
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Image
                  source={require('./assets/icons/flask.png')}
                  style={styles.flaskIcon}
                  resizeMode="contain"
                  accessibilityLabel="Parameter kimia"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

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
  sectionHeader: {
    marginTop: 16,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  bioindicatorHeaderTitle: {
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
});
