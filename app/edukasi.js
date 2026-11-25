import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';

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

function LeafBadgeIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Path
        d="M21.5 4.5C14.5 4.5 7.5 8 5.5 14.5C4.7 17.1 5.6 19.6 7.4 20.6C9.5 21.7 12.6 21.1 15.6 18.6C19.5 15.3 21.5 10.2 21.5 4.5Z"
        fill="#2E9B41"
      />
      <Path
        d="M5.5 21.5C7.8 17.8 11.4 14.2 16.5 11.5"
        stroke="#CEEBD0"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function DropBadgeIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Path
        d="M13 3C13 3 6.5 10.5 6.5 15.5C6.5 19.3 9.4 22.5 13 22.5C16.6 22.5 19.5 19.3 19.5 15.5C19.5 10.5 13 3 13 3Z"
        stroke="#F5A623"
        strokeWidth={2}
        strokeLinejoin="round"
        fill="#FFF3D6"
      />
      <Path
        d="M8.7 15.8C8.7 18.3 10.6 20.3 13 20.3C15.4 20.3 17.3 18.3 17.3 15.8C17.3 14.8 16.9 13.7 16.4 12.8C14.3 13.8 11.5 13.8 9.4 13C8.9 13.9 8.7 14.9 8.7 15.8Z"
        fill="#F5A623"
      />
    </Svg>
  );
}

function AlertBadgeIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Path
        d="M11.4 4.8C12.1 3.5 13.9 3.5 14.6 4.8L22.2 18.7C22.9 20 22 21.5 20.5 21.5H5.5C4 21.5 3.1 20 3.8 18.7L11.4 4.8Z"
        fill="#D95B43"
      />
      <Path d="M13 9.8V14.5" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" />
      <Circle cx={13} cy={17.8} r={1.2} fill="#FFFFFF" />
    </Svg>
  );
}

const toleranceLevels = [
  {
    key: 'peka',
    label: 'Peka',
    detail: '(air bersih)',
    backgroundColor: '#CEEBD0',
    Icon: LeafBadgeIcon,
  },
  {
    key: 'sedang',
    label: 'Sedang',
    detail: '(cukup baik)',
    backgroundColor: '#FCE6BC',
    Icon: DropBadgeIcon,
  },
  {
    key: 'toleran',
    label: 'Toleran',
    detail: '(air tercemar)',
    backgroundColor: '#FAD2C8',
    Icon: AlertBadgeIcon,
  },
];

export default function EdukasiScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const circleSize = width < 360 ? 148 : 172;
  const imageSize = Math.round(circleSize * 0.74);

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
        </View>
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
              style={{ width: imageSize, height: imageSize }}
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
            {toleranceLevels.map(({ key, label, detail, backgroundColor, Icon }) => (
              <View key={key} style={[styles.toleranceCard, { backgroundColor }]}>
                <Icon />
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
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
  },
  headerRow: {
    minHeight: 55,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27.5,
    backgroundColor: '#FFFFFF',
  },
  card: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    boxShadow: '0px 4px 4px 0px #00000040',
  },
  imageCircle: {
    backgroundColor: '#F3F7F6',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#B5DDB4',
  },
  groupBadgeText: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 16,
  },
  description: {
    marginTop: 16,
    paddingHorizontal: 6,
    color: '#111827',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 13.5,
    lineHeight: 20,
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
  toleranceTitle: {
    marginTop: 6,
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
  },
  toleranceDetail: {
    marginTop: 2,
    color: '#1F2937',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 10.5,
    lineHeight: 13,
    textAlign: 'center',
  },
});
