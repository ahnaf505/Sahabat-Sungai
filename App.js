import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function App() {
  const [fontsLoaded] = useFonts({
    'AvantGarde-Demi': require('./assets/fonts/AVGARDD2.otf'),
    'AvantGarde Tx': require('./assets/fonts/AVGARDR2.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Image
          source={require('./assets/water-drop.png')}
          style={styles.waterDrop}
          accessibilityLabel="Sahabat Sungai logo"
        />
        <Text style={styles.brandName}>Sahabat{'\n'}Sungai</Text>
      </View>
      <View style={styles.imageArea}>
        <Image
          source={require('./assets/images/river-illustration.png')}
          style={styles.riverIllustration}
          resizeMode="contain"
          accessibilityLabel="River illustration"
        />
        <Text style={styles.greeting}>Halo, Penjelajah Sungai!</Text>
        <Text style={styles.subtext}>
          Ayo kita jaga kualitas sungai-sungai di lingkungan kita!
        </Text>
        <View style={styles.infoCard}>
          <Svg
            width={38}
            height={38}
            viewBox="0 0 38 38"
            style={styles.mapPointIcon}
            accessibilityLabel="Location"
          >
            <Path
              d="M18.9997 3.16699C25.9953 3.16699 31.6663 9.50441 31.6663 16.6253C31.6663 23.6905 27.6235 31.3706 21.3159 34.3188C19.8456 35.0059 18.1537 35.0059 16.6834 34.3188C10.3758 31.3706 6.33301 23.6905 6.33301 16.6253C6.33301 9.50441 12.0041 3.16699 18.9997 3.16699ZM18.9997 11.0837C16.3762 11.0837 14.2497 13.2103 14.2497 15.8337C14.2497 18.4571 16.3762 20.5837 18.9997 20.5837C21.6231 20.5837 23.7497 18.4571 23.7497 15.8337C23.7497 13.2103 21.6231 11.0837 18.9997 11.0837Z"
              fill="#005E36"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </Svg>
          <Text style={styles.locationName}>Sungai Temboro Cemorokandang</Text>
          <Text style={styles.locationRegion}>Malang, Jawa Timur</Text>
          <View style={styles.cardDivider} />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cce7f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    position: 'absolute',
    top: 80,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterDrop: {
    width: 60,
    height: 60,
  },
  brandName: {
    marginLeft: 12,
    color: '#005E36',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 26,
    lineHeight: 25.42,
    letterSpacing: 0,
    fontWeight: '700',
    paddingTop: 4,
    paddingBottom: 4,
  },
  imageArea: {
    position: 'absolute',
    top: 115,
    left: 0,
    width: '100%',
    aspectRatio: 440 / 392,
  },
  riverIllustration: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    position: 'absolute',
    top: 52,
    left: 32,
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: 0,
    fontWeight: '700',
  },
  subtext: {
    position: 'absolute',
    top: 85,
    left: 32,
    width: 300,
    color: '#000000',
    fontFamily: 'AvantGarde Tx',
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: 0,
    fontWeight: '400',
  },
  infoCard: {
    position: 'absolute',
    top: 230,
    left: 20,
    right: 20,
    height: 148,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0000000D',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardDivider: {
    position: 'absolute',
    top: 74,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  mapPointIcon: {
    position: 'absolute',
    top: 18,
    left: 20,
  },
  locationName: {
    position: 'absolute',
    top: 18,
    left: 70,
    right: 16,
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 17,
    lineHeight: 15,
    letterSpacing: 0,
    fontWeight: '700',
    paddingVertical: 4,
  },
  locationRegion: {
    position: 'absolute',
    top: 40,
    left: 70,
    right: 16,
    color: '#000000',
    fontFamily: 'AvantGarde Tx',
    fontSize: 17,
    lineHeight: 15,
    letterSpacing: 0,
    fontWeight: '400',
    paddingVertical: 4,
  },
});
