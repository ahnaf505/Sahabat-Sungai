import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import BarChartIcon from '../assets/icons/bar-chart.svg';
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

const baseOrganismRows = [
  { label: 'Gastropoda', percentage: 28 },
  { label: 'Odonata', percentage: 22 },
  { label: 'Ephemeroptera', percentage: 18 },
  { label: 'Trichoptera', percentage: 14 },
  { label: 'Diptera', percentage: 10 },
  { label: 'Coleoptera', percentage: 8 },
];

const organismRows = baseOrganismRows.map((item, index, list) => ({
  ...item,
  color: getHighContrastColor(index, list.length),
}));



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

export default function AnalisisScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const waterDropSize = isCompact ? 86 : 104;
  const warningBadgeSize = isCompact ? 31 : 37;
  const donutSize = isCompact ? 104 : 126;
  const cardPadding = isCompact ? 18 : 26;

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
        contentContainerStyle={[styles.content, { paddingTop: 0, paddingBottom: Math.max(insets.bottom, 16) + 130, paddingHorizontal: width < 360 ? 16 : 24 }]}
      >


        <View style={styles.summaryCard}>
          <View style={[styles.waterMarkBox, { width: waterDropSize, height: waterDropSize }]}>
            <WaterDropIcon width={waterDropSize} height={waterDropSize} accessibilityLabel="Status kualitas air" />
            <WarningBadgeIcon width={warningBadgeSize} height={warningBadgeSize} style={styles.warningBadge} accessibilityLabel="Peringatan kondisi air" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.ikaLabel}>IKA</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.ikaScore} numberOfLines={1} adjustsFontSizeToFit>3,57</Text>
              <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>Kotor</Text></View>
            </View>
            <Text style={styles.summaryCaption}>Berdasarkan skor bioindikator makroinvertebrata</Text>
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
            <Text style={styles.detailCardScore}>1,60</Text>
          </View>
        </View>





        <View style={[styles.card, { padding: cardPadding }]}>
          <View style={styles.cardHeading}><PieChartIcon width={32} height={32} accessibilityLabel="Komposisi organisme" /><Text style={styles.cardTitle}>Komposisi Organisme</Text></View>
          <View style={styles.compositionContent}>
            <DonutChart data={organismRows} size={donutSize} thickness={isCompact ? 22 : 26} />
            <View style={styles.legend}>
              {organismRows.map(({ label, percentage, color }) => (
                <View key={label} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: color }]} />
                  <Text style={styles.legendLabel} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
                  <Text style={styles.legendValue}>{`${percentage}%`}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.card, { padding: cardPadding }]}>
          <View style={styles.cardHeading}><LabFlaskIcon width={24} height={28} accessibilityLabel="Parameter pendukung" /><Text style={styles.cardTitle}>Parameter Pendukung</Text></View>
          <View style={styles.parameterGrid}>
            <View style={styles.parameter}><ThermometerIcon width={18} height={39} accessibilityLabel="Suhu" /><Text style={styles.parameterLabel}>Suhu</Text><Text style={styles.parameterValue} numberOfLines={1} adjustsFontSizeToFit>25 °C</Text></View>
            <View style={styles.divider} />
            <View style={styles.parameter}><PhDropIcon width={27} height={39} accessibilityLabel="pH" /><Text style={styles.parameterLabel}>pH</Text><Text style={styles.parameterValue} numberOfLines={1} adjustsFontSizeToFit>6,8 – 7,6</Text></View>
            <View style={styles.divider} />
            <View style={styles.parameter}><SunIcon width={39} height={39} accessibilityLabel="Kecerahan" /><Text style={styles.parameterLabel}>Kecerahan</Text><Text style={styles.parameterValue} numberOfLines={1} adjustsFontSizeToFit>55,5 – 64 cm</Text></View>
          </View>
        </View>
      </ScrollView>
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
  parameterGrid: { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  parameter: { flex: 1, alignItems: 'center' },
  divider: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', backgroundColor: '#777' },
  parameterLabel: { marginTop: 5, color: '#101010', fontFamily: 'Poppins-Regular', fontSize: 12, lineHeight: 16 },
  parameterValue: { marginTop: 2, color: '#101010', fontFamily: 'Poppins-Bold', fontSize: 13, lineHeight: 18, textAlign: 'center' },
});
