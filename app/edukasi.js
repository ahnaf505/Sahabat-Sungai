import { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import LeafIcon from '../assets/icons/leaf.svg';
import ToleranceDropIcon from '../assets/icons/tolerance-drop.svg';
import WarningTriangleIcon from '../assets/icons/warning-triangle.svg';

const educationCards = [
  {
    key: 'odonata',
    image: require('../assets/images/odonata-bioindicator.png'),
    imageLabel: 'Nimfa capung Odonata',
    title: 'Odonata',
    subtitle: 'Nimfa capung',
    group: 'Predator perairan',
    description:
      'Nimfa capung hidup di dasar sungai dan memangsa hewan kecil. Keberadaannya dapat membantu membaca kondisi habitat perairan.',
    tolerance: 'sedang',
  },
  {
    key: 'mayfly',
    image: require('../assets/images/odonata-silhouette.png'),
    imageLabel: 'Nimfa lalat sehari',
    title: 'Lalat Sehari',
    subtitle: 'Nimfa Ephemeroptera',
    group: 'Kelompok EPT',
    description:
      'Nimfa lalat sehari membutuhkan air sejuk dengan oksigen terlarut yang cukup. Banyak ditemukan pada sungai yang relatif bersih.',
    tolerance: 'peka',
  },
  {
    key: 'snail',
    image: require('../assets/images/snail-bioindicator.png'),
    imageLabel: 'Siput air tawar',
    title: 'Siput Air',
    subtitle: 'Gastropoda air tawar',
    group: 'Makroinvertebrata',
    description:
      'Sebagian siput air mampu bertahan saat kadar oksigen rendah. Jumlah yang dominan dapat menjadi tanda kondisi air yang menurun.',
    tolerance: 'toleran',
  },
];

const toleranceLevels = [
  {
    key: 'peka',
    label: 'Peka',
    detail: 'air bersih',
    backgroundColor: '#D5EED4',
    Icon: LeafIcon,
    iconWidth: 28,
    iconHeight: 28,
  },
  {
    key: 'sedang',
    label: 'Sedang',
    detail: 'cukup baik',
    backgroundColor: '#FDE8BD',
    Icon: ToleranceDropIcon,
    iconWidth: 22,
    iconHeight: 29,
  },
  {
    key: 'toleran',
    label: 'Toleran',
    detail: 'air tercemar',
    backgroundColor: '#FBD8CA',
    Icon: WarningTriangleIcon,
    iconWidth: 28,
    iconHeight: 28,
  },
];

export default function EdukasiScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shellWidth = Math.min(width, 460);
  const horizontalPadding = width < 360 ? 14 : 20;
  const slideWidth = shellWidth - horizontalPadding * 2;

  const showCard = (index) => {
    carouselRef.current?.scrollTo({ x: index * slideWidth, animated: true });
    setActiveIndex(index);
  };

  const updateActiveCard = (event) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setActiveIndex(Math.max(0, Math.min(nextIndex, educationCards.length - 1)));
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        pointerEvents="none"
        colors={['#CDF1CA', '#F2FBF1', '#F2FBF1', '#D9F1D7']}
        locations={[0, 0.3, 0.68, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 16,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
          >
            <ArrowLeftIcon width={25} height={25} color="#000000" />
          </Pressable>
          <View style={styles.headingCopy}>
            <Text style={styles.headerTitle}>Kenali Bioindikator</Text>
            <Text style={styles.headerHint}>Geser untuk belajar</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 114 }}
      >
        <View style={[styles.carouselFrame, { width: shellWidth }]}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            bounces={false}
            decelerationRate="fast"
            disableIntervalMomentum
            snapToInterval={slideWidth}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={updateActiveCard}
            contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
            accessibilityRole="adjustable"
            accessibilityLabel="Kartu edukasi bioindikator"
            accessibilityValue={{
              min: 1,
              max: educationCards.length,
              now: activeIndex + 1,
              text: educationCards[activeIndex].title,
            }}
          >
            {educationCards.map((item) => (
              <View key={item.key} style={[styles.slide, { width: slideWidth }]}>
                <View style={styles.card}>
                  <View style={styles.imageStage}>
                    <View style={styles.imageGlow} />
                    <Image
                      source={item.image}
                      style={styles.bioindicatorImage}
                      resizeMode="contain"
                      accessibilityLabel={item.imageLabel}
                    />
                  </View>

                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>

                  <View style={styles.groupBadge}>
                    <Text style={styles.groupBadgeText}>{item.group}</Text>
                  </View>

                  <Text style={styles.description}>{item.description}</Text>

                  <Text style={styles.scaleLabel}>TINGKAT TOLERANSI</Text>
                  <View style={styles.toleranceRow}>
                    {toleranceLevels.map(
                      ({ key, label, detail, backgroundColor, Icon, iconWidth, iconHeight }) => {
                        const isSelected = item.tolerance === key;

                        return (
                          <View
                            key={key}
                            style={[
                              styles.toleranceCard,
                              { backgroundColor },
                              !isSelected && styles.toleranceCardMuted,
                              isSelected && styles.toleranceCardSelected,
                            ]}
                          >
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
                        );
                      },
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.pagination} accessibilityRole="tablist">
          {educationCards.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <Pressable
                key={item.key}
                accessibilityRole="tab"
                accessibilityLabel={`Tampilkan ${item.title}`}
                accessibilityState={{ selected: isActive }}
                onPress={() => showCard(index)}
                hitSlop={10}
                style={[styles.dot, isActive && styles.activeDot]}
              />
            );
          })}
        </View>
        <Text style={styles.swipeHint}>{activeIndex + 1} dari {educationCards.length}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2FBF1',
  },
  header: {
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 14,
    zIndex: 10,
  },
  headerRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27.5,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#17451D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  headingCopy: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 55,
  },
  headerTitle: {
    color: '#101812',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    lineHeight: 25,
  },
  headerHint: {
    marginTop: 1,
    color: '#527057',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  carouselFrame: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
  slide: {
    paddingHorizontal: 4,
    paddingVertical: 7,
  },
  card: {
    width: '100%',
    minHeight: 584,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#17451D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },
  imageStage: {
    width: '100%',
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageGlow: {
    position: 'absolute',
    width: 154,
    height: 154,
    borderRadius: 77,
    backgroundColor: '#EDF6EE',
  },
  bioindicatorImage: {
    width: 140,
    height: 140,
    backgroundColor: 'transparent',
    elevation: 8,
    shadowColor: '#102814',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    marginTop: 4,
    color: '#101812',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 27,
    lineHeight: 32,
    textAlign: 'center',
  },
  subtitle: {
    color: '#526057',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  groupBadge: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#CFEAD0',
  },
  groupBadgeText: {
    color: '#173C1B',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    lineHeight: 18,
  },
  description: {
    marginTop: 14,
    minHeight: 66,
    paddingHorizontal: 4,
    color: '#26342A',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  scaleLabel: {
    alignSelf: 'flex-start',
    marginTop: 16,
    marginLeft: 2,
    color: '#738077',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.2,
  },
  toleranceRow: {
    width: '100%',
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
  toleranceCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  toleranceCardMuted: {
    opacity: 0.42,
  },
  toleranceCardSelected: {
    borderColor: '#2F6B37',
    transform: [{ translateY: -2 }],
  },
  toleranceIconBox: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toleranceTitle: {
    marginTop: 5,
    color: '#111812',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  toleranceDetail: {
    color: '#435047',
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
  pagination: {
    minHeight: 34,
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A5B7A8',
  },
  activeDot: {
    width: 26,
    backgroundColor: '#2F6B37',
  },
  swipeHint: {
    color: '#647568',
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
  },
});
