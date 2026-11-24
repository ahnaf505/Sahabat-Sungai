import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Image, StyleSheet, Text, View } from 'react-native';

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
});
