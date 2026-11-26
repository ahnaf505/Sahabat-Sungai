import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import ArrowLeftIcon from './assets/icons/arrow-left.svg';
import MapIcon from './assets/icons/map.svg';
import MapPointIcon from './assets/icons/map-point.svg';

export const riverLocations = [
  // Malang Raya (top of list)
  { name: 'Sungai Temboro Cemorokandang', region: 'Malang, Jawa Timur' },
  { name: 'Sungai Brantas', region: 'Kedungkandang, Malang, Jawa Timur' },
  { name: 'Sungai Bango', region: 'Kedungkandang, Malang, Jawa Timur' },
  { name: 'Sungai Amprong', region: 'Kedungkandang, Malang, Jawa Timur' },
  { name: 'Sungai Metro', region: 'Sukun, Malang, Jawa Timur' },
  { name: 'Sungai Mewek', region: 'Lowokwaru, Malang, Jawa Timur' },
  { name: 'Sungai Sukun', region: 'Sukun, Malang, Jawa Timur' },
  { name: 'Sungai Sari', region: 'Blimbing, Malang, Jawa Timur' },
  { name: 'Sungai Lesti', region: 'Turen, Kab. Malang, Jawa Timur' },
  { name: 'Sungai Konto', region: 'Pujon, Kab. Malang, Jawa Timur' },
  { name: 'Sungai Molek', region: 'Kepanjen, Kab. Malang, Jawa Timur' },
  { name: 'Sungai Sumberbrantas', region: 'Bumiaji, Batu, Jawa Timur' },
  { name: 'Sungai Lahor', region: 'Sumberpucung, Kab. Malang, Jawa Timur' },
  { name: 'Sungai Bambang', region: 'Wajak, Kab. Malang, Jawa Timur' },
  // Jawa Timur & sekitarnya
  { name: 'Sungai Welang', region: 'Pasuruan, Jawa Timur' },
  { name: 'Sungai Rejoso', region: 'Pasuruan, Jawa Timur' },
  { name: 'Sungai Porong', region: 'Sidoarjo, Jawa Timur' },
  { name: 'Sungai Kali Mas', region: 'Surabaya, Jawa Timur' },
  { name: 'Sungai Kali Surabaya', region: 'Surabaya, Jawa Timur' },
  { name: 'Sungai Ngrowo', region: 'Tulungagung, Jawa Timur' },
  { name: 'Sungai Bedadung', region: 'Jember, Jawa Timur' },
  { name: 'Sungai Sampean', region: 'Situbondo, Jawa Timur' },
  { name: 'Sungai Bajulmati', region: 'Banyuwangi, Jawa Timur' },
  { name: 'Sungai Bengawan Solo', region: 'Bojonegoro, Jawa Timur' },
  { name: 'Sungai Madiun', region: 'Madiun, Jawa Timur' },
  // Wilayah lebih jauh
  { name: 'Sungai Progo', region: 'Sleman, DI Yogyakarta' },
  { name: 'Sungai Code', region: 'Yogyakarta, DI Yogyakarta' },
  { name: 'Sungai Serayu', region: 'Banyumas, Jawa Tengah' },
  { name: 'Sungai Citarum', region: 'Bandung, Jawa Barat' },
  { name: 'Sungai Ciliwung', region: 'Jakarta Selatan, DKI Jakarta' },
  { name: 'Sungai Cisadane', region: 'Tangerang, Banten' },
];

const openInGoogleMaps = (location) => {
  const query = encodeURIComponent(`${location.name}, ${location.region}`);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  Linking.openURL(url).catch(() => {});
};

/** Lets the user select the river shown on the home monitoring card. */
export default function LocationModal({ visible, onClose, onSelect }) {
  const { height } = useWindowDimensions();
  const cardHeight = Math.min(560, Math.round(height * 0.72));

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable accessibilityRole="button" accessibilityLabel="Tutup pemilih lokasi" onPress={onClose} style={styles.overlay}>
        <Pressable onPress={(event) => event.stopPropagation()} style={[styles.card, { height: cardHeight }]}>
          <View style={styles.headerRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kembali"
              onPress={onClose}
              style={styles.backButton}
            >
              <ArrowLeftIcon width={25} height={25} color="#000000" />
            </Pressable>
            <Text style={styles.title}>Pilih Lokasi Sungai</Text>
          </View>
          <ScrollView style={styles.locationScrollView} showsVerticalScrollIndicator contentContainerStyle={styles.locationList}>
            {riverLocations.map((location) => (
              <Pressable
                key={location.name}
                accessibilityRole="button"
                accessibilityLabel={`${location.name}, ${location.region}`}
                onPress={() => onSelect(location)}
                style={styles.locationRow}
              >
                <MapPointIcon width={32} height={32} accessibilityLabel="" />
                <View style={styles.locationTextGroup}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationRegion}>{location.region}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Buka ${location.name} di Google Maps`}
                  onPress={(event) => {
                    event.stopPropagation?.();
                    openInGoogleMaps(location);
                  }}
                  style={styles.mapButton}
                >
                  <MapIcon width={18} height={18} />
                </Pressable>
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width: '100%',
    maxWidth: 460,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 4px 0px #00000040',
  },
  headerRow: {
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
    borderWidth: 1,
    borderColor: '#0000000D',
  },
  title: {
    flex: 1,
    marginLeft: 14,
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '700',
  },
  locationScrollView: {
    flex: 1,
    marginTop: 8,
  },
  locationList: {
    paddingTop: 8,
  },
  locationRow: {
    minHeight: 72,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationTextGroup: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  mapButton: {
    width: 34,
    height: 34,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#EDF7F0',
  },
  locationName: {
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
  },
  locationRegion: {
    marginTop: 3,
    color: '#000000',
    fontFamily: 'AvantGarde Tx',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
  },
});
