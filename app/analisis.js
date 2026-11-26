import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import BarChartIcon from '../assets/icons/bar-chart.svg';
import WarningBadgeIcon from '../assets/icons/warning-badge.svg';
import WaterDropIcon from '../assets/icons/water-drop.svg';

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

export default function AnalisisScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

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
            onPress={() => router.replace('/')}
            style={styles.backButton}
          >
            <ArrowLeftIcon width={25} height={25} color="#000000" />
          </Pressable>
          <Text style={styles.title}>Ringkasan Kondisi Sungai</Text>
          <BarChartIcon width={31} height={31} color="#005E36" style={styles.rightIcon} />
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.waterMarkBox}>
            <WaterDropIcon width={104} height={104} accessibilityLabel="Status kualitas air" />
            <WarningBadgeIcon
              width={37}
              height={37}
              style={styles.warningBadge}
              accessibilityLabel="Peringatan kondisi air"
            />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.ikaLabel}>IKA</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.ikaScore} numberOfLines={1} adjustsFontSizeToFit>
                3,57
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Kotor</Text>
              </View>
            </View>
            <Text style={styles.summaryCaption}>Berdasarkan skor bioindikator makroinvertebrata</Text>
          </View>
        </View>
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
    paddingVertical: 2,
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
    marginTop: 6,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 12.5,
    lineHeight: 12.5,
    letterSpacing: 0,
    paddingVertical: 2,
  },
});
