import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    'AvantGarde-Demi': require('./assets/fonts/AVGARDD2.otf'),
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
      <Image
        source={require('./assets/images/river-illustration.png')}
        style={styles.riverIllustration}
        resizeMode="contain"
        accessibilityLabel="River illustration"
      />
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
  riverIllustration: {
    position: 'absolute',
    top: 115,
    left: 0,
    width: '100%',
    aspectRatio: 440 / 392,
  },
});
