import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import ArrowLeftIcon from './assets/icons/arrow-left.svg';
import MapIcon from './assets/icons/map.svg';
import MapPointIcon from './assets/icons/map-point.svg';

export const riverLocations = [
  // Malang Raya (top of list)
  { name: 'Sungai Temboro Cemorokandang', region: 'Malang, Jawa Timur', latitude: -7.9805, longitude: 112.6853 },
  { name: 'Sungai Brantas', region: 'Kedungkandang, Malang, Jawa Timur', latitude: -7.9718, longitude: 112.6544 },
  { name: 'Sungai Bango', region: 'Kedungkandang, Malang, Jawa Timur', latitude: -7.9139, longitude: 112.6566 },
  { name: 'Sungai Amprong', region: 'Kedungkandang, Malang, Jawa Timur', latitude: -7.9667, longitude: 112.65 },
  { name: 'Sungai Metro', region: 'Sukun, Malang, Jawa Timur', latitude: -8.005, longitude: 112.6186 },
  { name: 'Sungai Mewek', region: 'Lowokwaru, Malang, Jawa Timur', latitude: -7.8922, longitude: 112.5822 },
  { name: 'Sungai Sukun', region: 'Sukun, Malang, Jawa Timur', latitude: -8.005, longitude: 112.6186 },
  { name: 'Sungai Sari', region: 'Blimbing, Malang, Jawa Timur', latitude: -7.9304, longitude: 112.652 },
  { name: 'Sungai Lesti', region: 'Turen, Kab. Malang, Jawa Timur', latitude: -8.1667, longitude: 112.7 },
  { name: 'Sungai Konto', region: 'Pujon, Kab. Malang, Jawa Timur', latitude: -7.8433, longitude: 112.4689 },
  { name: 'Sungai Molek', region: 'Kepanjen, Kab. Malang, Jawa Timur', latitude: -8.1319, longitude: 112.5614 },
  { name: 'Sungai Sumberbrantas', region: 'Bumiaji, Batu, Jawa Timur', latitude: -7.7572, longitude: 112.5281 },
  { name: 'Sungai Lahor', region: 'Sumberpucung, Kab. Malang, Jawa Timur', latitude: -8.15, longitude: 112.425 },
  { name: 'Sungai Bambang', region: 'Wajak, Kab. Malang, Jawa Timur', latitude: -8.125, longitude: 112.725 },
  // Jawa Timur & sekitarnya
  { name: 'Sungai Welang', region: 'Pasuruan, Jawa Timur', latitude: -7.5781, longitude: 112.8706 },
  { name: 'Sungai Rejoso', region: 'Pasuruan, Jawa Timur', latitude: -7.6814, longitude: 112.9567 },
  { name: 'Sungai Porong', region: 'Sidoarjo, Jawa Timur', latitude: -7.5397, longitude: 112.6856 },
  { name: 'Sungai Kali Mas', region: 'Surabaya, Jawa Timur', latitude: -7.2353, longitude: 112.7361 },
  { name: 'Sungai Kali Surabaya', region: 'Surabaya, Jawa Timur', latitude: -7.3375, longitude: 112.7542 },
  { name: 'Sungai Ngrowo', region: 'Tulungagung, Jawa Timur', latitude: -8.07, longitude: 111.8944 },
  { name: 'Sungai Bedadung', region: 'Jember, Jawa Timur', latitude: -8.1408, longitude: 113.7342 },
  { name: 'Sungai Sampean', region: 'Situbondo, Jawa Timur', latitude: -7.7, longitude: 113.9833 },
  { name: 'Sungai Bajulmati', region: 'Banyuwangi, Jawa Timur', latitude: -7.9125, longitude: 114.3542 },
  { name: 'Sungai Bengawan Solo', region: 'Bojonegoro, Jawa Timur', latitude: -7.1354, longitude: 111.8311 },
  { name: 'Sungai Madiun', region: 'Madiun, Jawa Timur', latitude: -7.63, longitude: 111.5231 },
  // Wilayah lebih jauh
  { name: 'Sungai Progo', region: 'Sleman, DI Yogyakarta', latitude: -7.9822, longitude: 110.2028 },
  { name: 'Sungai Code', region: 'Yogyakarta, DI Yogyakarta', latitude: -7.7833, longitude: 110.3667 },
  { name: 'Sungai Serayu', region: 'Banyumas, Jawa Tengah', latitude: -7.4833, longitude: 109.2833 },
  { name: 'Sungai Citarum', region: 'Bandung, Jawa Barat', latitude: -6.9175, longitude: 107.6191 },
  { name: 'Sungai Ciliwung', region: 'Jakarta Selatan, DKI Jakarta', latitude: -6.2667, longitude: 106.85 },
  { name: 'Sungai Cisadane', region: 'Tangerang, Banten', latitude: -6.1667, longitude: 106.6333 },
];

const openInGoogleMaps = (location) => {
  const query =
    typeof location.latitude === 'number' && typeof location.longitude === 'number'
      ? `${location.latitude},${location.longitude}`
      : encodeURIComponent(`${location.name}, ${location.region}`);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  Linking.openURL(url).catch(() => {});
};

/** Lets the user select a river location from the provided list. */
export default function LocationModal({
  visible,
  onClose,
  onSelect,
  selectedLocation = null,
  locations = riverLocations,
}) {
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
            {locations.map((location) => {
              const isSelected = selectedLocation?.name === location.name;

              return (
                <Pressable
                  key={location.name}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${location.name}, ${location.region}`}
                  onPress={() => onSelect(location)}
                  style={[styles.locationRow, isSelected && styles.locationRowSelected]}
                >
                  <MapPointIcon width={32} height={32} accessibilityLabel="" />
                  <View style={styles.locationTextGroup}>
                    <Text style={[styles.locationName, isSelected && styles.locationNameSelected]}>{location.name}</Text>
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
              );
            })}
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
    paddingHorizontal: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationRowSelected: {
    backgroundColor: '#EDF7F0',
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
  locationNameSelected: {
    color: '#005E36',
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
