import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import ArrowLeftIcon from './assets/icons/arrow-left.svg';
import MapPointIcon from './assets/icons/map-point.svg';

export const riverLocations = [
  { name: 'Sungai Temboro Cemorokandang', region: 'Malang, Jawa Timur' },
  { name: 'Sungai Brantas', region: 'Malang, Jawa Timur' },
  { name: 'Sungai Citarum', region: 'Bandung, Jawa Barat' },
  { name: 'Sungai Code', region: 'Yogyakarta, DI Yogyakarta' },
];

/** Lets the user select the river shown on the home monitoring card. */
export default function LocationModal({ visible, onClose, onSelect }) {
  const { height } = useWindowDimensions();
  const cardHeight = Math.min(560, Math.round(height * 0.72));

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.scrim} onPress={onClose} />
        <View style={[styles.card, { height: cardHeight }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            onPress={onClose}
            style={styles.backButton}
          >
            <ArrowLeftIcon width={25} height={25} color="#000000" />
          </Pressable>
          <Text style={styles.title}>Pilih Lokasi Sungai</Text>
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
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
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
    marginTop: 18,
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '700',
  },
  locationScrollView: {
    flex: 1,
  },
  locationList: {
    paddingTop: 12,
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
