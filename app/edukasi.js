import { StyleSheet, Text, View } from 'react-native';

export default function EdukasiScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Edukasi Sungai</Text>
      <Text style={styles.intro}>Mulai dari kebiasaan kecil untuk menjaga sungai tetap bersih.</Text>
      <View style={styles.card}>
        <Text style={styles.number}>01</Text>
        <Text style={styles.cardTitle}>Jangan buang sampah ke sungai</Text>
        <Text style={styles.description}>Pisahkan sampah organik dan anorganik sebelum dibuang.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.number}>02</Text>
        <Text style={styles.cardTitle}>Gunakan air secukupnya</Text>
        <Text style={styles.description}>Kurangi limbah rumah tangga yang masuk ke saluran air.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 180, paddingHorizontal: 24, backgroundColor: '#CCE7F0' },
  title: { color: '#005E36', fontFamily: 'AvantGarde-Demi', fontSize: 28, lineHeight: 34, fontWeight: '700' },
  intro: { marginTop: 10, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 16, lineHeight: 23, fontWeight: '400' },
  card: { marginTop: 20, padding: 20, borderRadius: 24, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  number: { color: '#005E36', fontFamily: 'AvantGarde-Demi', fontSize: 16, lineHeight: 20, fontWeight: '700' },
  cardTitle: { marginTop: 8, color: '#000000', fontFamily: 'AvantGarde-Demi', fontSize: 18, lineHeight: 23, fontWeight: '700' },
  description: { marginTop: 7, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 15, lineHeight: 21, fontWeight: '400' },
});
