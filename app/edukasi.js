import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import LeafIcon from '../assets/icons/leaf.svg';
import ToleranceDropIcon from '../assets/icons/tolerance-drop.svg';
import WarningTriangleIcon from '../assets/icons/warning-triangle.svg';

const backgroundGradients = [
  {
    key: 'top',
    colors: ['#CDF1CA', '#F2FBF1', '#F2FBF1', 'rgba(242, 251, 241, 0)'],
    locations: [0.3, 0.52, 0.76, 1],
    styleKey: 'topGradient',
  },
  {
    key: 'bottom',
    colors: ['rgba(242, 251, 241, 0)', '#F2FBF1', '#F2FBF1', '#CDF1CA'],
    locations: [0, 0.24, 0.48, 0.7],
    styleKey: 'bottomGradient',
  },
];

const toleranceLevels = [
  {
    key: 'peka',
    label: 'Peka',
    detail: '(air bersih)',
    backgroundColor: '#D5EED4',
    Icon: LeafIcon,
    iconWidth: 28,
    iconHeight: 28,
  },
  {
    key: 'sedang',
    label: 'Sedang',
    detail: '(cukup baik)',
    backgroundColor: '#FDE8BD',
    Icon: ToleranceDropIcon,
    iconWidth: 22,
    iconHeight: 29,
  },
  {
    key: 'toleran',
    label: 'Toleran',
    detail: '(air tercemar)',
    backgroundColor: '#FBD8CA',
    Icon: WarningTriangleIcon,
    iconWidth: 28,
    iconHeight: 28,
  },
];

export default function EdukasiScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const circleSize = Math.min(250, width - 80);

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
            paddingHorizontal: width < 360 ? 14 : 20,
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
          <Text style={styles.headerTitle}>Kenali Bioindikator</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 0,
            paddingBottom: Math.max(insets.bottom, 16) + 124,
            paddingHorizontal: width < 360 ? 14 : 20,
          },
        ]}
      >
        <View style={styles.card}>
          <View
            style={[
              styles.imageCircle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
              },
            ]}
          >
            <Image
              source={require('../assets/images/odonata-bioindicator.png')}
              style={styles.odonataImage}
              resizeMode="contain"
              accessibilityLabel="Odonata"
            />
          </View>

          <Text style={styles.title}>Odonata</Text>
          <Text style={styles.subtitle}>(Nimfa Lalat Sehari)</Text>

          <View style={styles.groupBadge}>
            <Text style={styles.groupBadgeText}>Kelompok EPT</Text>
          </View>

          <Text style={styles.description}>
            Umumnya peka terhadap perubahan kualitas air dan membutuhkan oksigen terlarut yang cukup.
          </Text>

          <View style={styles.toleranceRow}>
            {toleranceLevels.map(({ key, label, detail, backgroundColor, Icon, iconWidth, iconHeight }) => (
              <View key={key} style={[styles.toleranceCard, { backgroundColor }]}>
                <View style={styles.toleranceIconBox}>
                  <Icon width={iconWidth} height={iconHeight} />
                </View>
                <Text style={styles.toleranceTitle} numberOfLines={1} adjustsFontSizeToFit>
                  {label}
                </Text>
                <Text style={styles.toleranceDetail} numberOfLines={1} adjustsFontSizeToFit>
                  {detail}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2FBF1',
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
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
  },
  stickyHeader: {
    maxWidth: 460,
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
  headerTitle: {
    paddingHorizontal: 60,
    textAlign: 'center',
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0,
    paddingVertical: 2,
  },
  card: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  imageCircle: {
    backgroundColor: '#F3F7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  odonataImage: {
    width: 110,
    height: 110,
  },
  title: {
    marginTop: 18,
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 28,
    lineHeight: 28,
    letterSpacing: 0,
    includeFontPadding: false,
    paddingVertical: 2,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    color: '#1F2937',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    includeFontPadding: false,
    paddingVertical: 2,
    textAlign: 'center',
  },
  groupBadge: {
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#BBE4BD',
  },
  groupBadgeText: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    includeFontPadding: false,
    paddingVertical: 2,
  },
  description: {
    marginTop: 16,
    paddingHorizontal: 6,
    color: '#111827',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'center',
  },
  toleranceRow: {
    width: '100%',
    marginTop: 22,
    flexDirection: 'row',
    gap: 10,
  },
  toleranceCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 14,
    alignItems: 'center',
  },
  toleranceIconBox: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toleranceTitle: {
    marginTop: 6,
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
    includeFontPadding: false,
    paddingVertical: 2,
    textAlign: 'center',
  },
  toleranceDetail: {
    marginTop: 2,
    color: '#1F2937',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    includeFontPadding: false,
    paddingVertical: 1,
    textAlign: 'center',
  },
});
