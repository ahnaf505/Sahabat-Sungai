import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfilScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 32,
          paddingBottom: Math.max(insets.bottom, 16) + 130,
          paddingHorizontal: width < 360 ? 16 : 24,
        },
      ]}
    >
      <View style={styles.avatar}><Text style={styles.initial}>P</Text></View>
      <Text style={styles.name}>Penjelajah Sungai</Text>
      <Text style={styles.role}>Sahabat Sungai</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Aktivitas Saya</Text>
        <Text style={styles.description}>Belum ada aktivitas yang tercatat.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pengaturan</Text>
        <Text style={styles.description}>Kelola informasi dan preferensi akun Anda.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#CCE7F0' },
  content: { flexGrow: 1, maxWidth: 500, width: '100%', alignSelf: 'center' },
  avatar: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#005E36' },
  initial: { color: '#FFFFFF', fontFamily: 'AvantGarde-Demi', fontSize: 36, lineHeight: 42, fontWeight: '700' },
  name: { marginTop: 16, color: '#000000', fontFamily: 'AvantGarde-Demi', fontSize: 24, lineHeight: 29, fontWeight: '700' },
  role: { marginTop: 4, color: '#005E36', fontFamily: 'AvantGarde Tx', fontSize: 16, lineHeight: 20, fontWeight: '400' },
  card: { marginTop: 20, padding: 20, borderRadius: 24, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  cardTitle: { color: '#000000', fontFamily: 'AvantGarde-Demi', fontSize: 18, lineHeight: 23, fontWeight: '700' },
  description: { marginTop: 8, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 15, lineHeight: 21, fontWeight: '400' },
});
