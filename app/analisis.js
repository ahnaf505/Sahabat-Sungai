import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';

const organismRows = [
  { label: 'Gastropoda', value: '40%', color: '#1AAEA9' },
  { label: 'Odonata', value: '30%', color: '#F85A4F' },
  { label: 'Ephemeroptera', value: '30%', color: '#FAA61F' },
];

function LeafIcon() {
  return (
    <Svg width={42} height={42} viewBox="0 0 42 42" fill="none">
      <Path d="M35.7 5.4C22.5 6.1 11.5 11 8.8 20.7c-1.3 4.7.4 8.9 4.4 10.4 4.5 1.7 9.2-1.4 10.8-5.9-4.9.4-9 2-12.3 5.1 3.4-5.9 8.9-9.7 15.7-11.2-1.5 7.9-5.8 13.2-12.9 15.9l-1.1 4.1" stroke="#006B43" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PieIcon() {
  return (
    <Svg width={46} height={46} viewBox="0 0 46 46">
      <Path d="M21 2.5A20.5 20.5 0 1 0 43.5 25H21V2.5Z" fill="#006B43" />
      <Path d="M25 2.5v17.8h18A20.5 20.5 0 0 0 25 2.5Z" fill="#006B43" />
      <Path d="M23 1v22h22" stroke="#FFF" strokeWidth={2.5} />
    </Svg>
  );
}

function FlaskIcon() {
  return (
    <Svg width={39} height={43} viewBox="0 0 39 43" fill="none">
      <Path d="M14 3h11M17 3v14L5.5 35.3A3 3 0 0 0 8.1 40h23.8a3 3 0 0 0 2.6-4.7L23 17V3" stroke="#006B43" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10.7 32h17.6" stroke="#006B43" strokeWidth={3.5} strokeLinecap="round" />
    </Svg>
  );
}

function ThermometerIcon() {
  return (
    <Svg width={28} height={39} viewBox="0 0 28 39" fill="none">
      <Path d="M11 5a3 3 0 0 1 6 0v18.6a8 8 0 1 1-6 0V5Z" stroke="#00734A" strokeWidth={2.5} />
      <Path d="M14 15v14" stroke="#00734A" strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx="14" cy="31" r="3.2" fill="#00734A" />
    </Svg>
  );
}

function HumidityIcon() {
  return (
    <Svg width={35} height={40} viewBox="0 0 35 40" fill="none">
      <Path d="M17.5 2.5S4 17.8 4 26a13.5 13.5 0 1 0 27 0c0-8.2-13.5-23.5-13.5-23.5Z" fill="#78C9DE" />
      <Path d="M23.5 30.5a7.5 7.5 0 0 1-8 3.4" stroke="#FFF" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function SunIcon() {
  return (
    <Svg width={43} height={43} viewBox="0 0 43 43" fill="none">
      <Circle cx="21.5" cy="21.5" r="8" fill="#FFC400" />
      <Path d="M21.5 3v5M21.5 35v5M3 21.5h5M35 21.5h5M8.4 8.4l3.5 3.5M31.1 31.1l3.5 3.5M34.6 8.4l-3.5 3.5M11.9 31.1l-3.5 3.5" stroke="#FFC400" strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

function DonutChart() {
  return (
    <Svg width={126} height={126} viewBox="0 0 126 126">
      <Circle cx="63" cy="63" r="46" fill="none" stroke="#1AAEA9" strokeWidth="27" strokeDasharray="91 198" strokeDashoffset="0" transform="rotate(-90 63 63)" />
      <Circle cx="63" cy="63" r="46" fill="none" stroke="#F85A4F" strokeWidth="27" strokeDasharray="68 221" strokeDashoffset="-96" transform="rotate(-90 63 63)" />
      <Circle cx="63" cy="63" r="46" fill="none" stroke="#FAA61F" strokeWidth="27" strokeDasharray="68 221" strokeDashoffset="-169" transform="rotate(-90 63 63)" />
    </Svg>
  );
}

export default function AnalisisScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.screen}>
      <LinearGradient pointerEvents="none" colors={['#FFFFFF', '#FFFFFF', '#E4F9E4']} locations={[0, 0.72, 1]} style={StyleSheet.absoluteFill} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 10, paddingBottom: Math.max(insets.bottom, 16) + 118, paddingHorizontal: width < 360 ? 14 : 18 }]}
      >
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Kembali" onPress={() => router.replace('/')} style={styles.backButton}>
            <ArrowLeftIcon width={24} height={24} color="#006B43" />
          </Pressable>
          <Text style={styles.pageTitle}>Analisis Sungai</Text>
        </View>

        <View style={styles.scoreCard}>
          <LeafIcon />
          <View style={styles.scoreCopy}>
            <Text style={styles.cardEyebrow}>Keanekaragaman H’</Text>
            <Text style={styles.score}>1,60</Text>
          </View>
          <View pointerEvents="none" style={styles.riverArt}><View style={styles.riverLine} /></View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeading}><PieIcon /><Text style={styles.cardTitle}>Komposisi Organisme</Text></View>
          <View style={styles.compositionContent}>
            <DonutChart />
            <View style={styles.legend}>
              {organismRows.map(({ label, value, color }) => (
                <View key={label} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: color }]} />
                  <Text style={styles.legendLabel}>{label}</Text>
                  <Text style={styles.legendValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.detailCard} />
      </ScrollView>
    </View>
  );
}

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
    paddingHorizontal: 64,
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0,
    paddingVertical: 2,
  },
  summaryCard: {
    width: '100%',
    minHeight: 160,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#FBEBD5',
  },
  waterMarkBox: {
    width: 104,
    height: 104,
    position: 'relative',
  },
  warningBadge: {
    position: 'absolute',
    left: 6,
    bottom: 4,
  },
  summaryContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  ikaLabel: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0,
    paddingVertical: 2,
  },
  scoreRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  ikaScore: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 45,
    lineHeight: 45,
    letterSpacing: 0,
    includeFontPadding: false,
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#C16500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0,
    paddingVertical: 2,
  },
  summaryCaption: {
    marginTop: 2,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 12.5,
    lineHeight: 18,
    letterSpacing: 0,
    includeFontPadding: false,
  },
  detailCard: {
    width: '100%',
    height: 97,
    marginTop: 16,
    padding: 20,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 5px 0px #00000040',
  },
});
