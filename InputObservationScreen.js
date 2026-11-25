import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function InputObservationScreen({ onBack }) {
  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', '#CDF1CA']}
        locations={[0, 0.4423]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Input Observasi</Text>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 82,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  backLabel: {
    color: '#005E36',
    fontSize: 38,
    lineHeight: 40,
  },
  title: {
    marginTop: 24,
    color: '#005E36',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 28,
    lineHeight: 34,
  },
});
