import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from './assets/icons/arrow-left.svg';
import MapPointIcon from './assets/icons/map-point.svg';
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

export default function InputObservationScreen({ onBack }) {
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
              {[0, 1, 2].map((index) => (
                <View key={index} style={styles.stationBox} />
              ))}
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
  fontFamily: 'Poppins-Bold',
  fontWeight: '600',
  fontSize: 20,
  lineHeight: 20,
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
    borderRadius: 20,
    backgroundColor: '#EDF7F0',
  },
});
