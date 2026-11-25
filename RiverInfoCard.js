import { StyleSheet, Text, View } from 'react-native';
import CalendarWeekIcon from './assets/icons/calendar-week.svg';
import MapPointIcon from './assets/icons/map-point.svg';

/** Displays the river location and last monitoring date card. */
export default function RiverInfoCard({ style }) {
  return (
    <View style={[styles.card, style]}>
      <MapPointIcon width={38} height={38} style={styles.mapPointIcon} accessibilityLabel="Lokasi sungai" />
      <Text style={styles.locationName}>Sungai Temboro Cemorokandang</Text>
      <Text style={styles.locationRegion}>Malang, Jawa Timur</Text>
      <View style={styles.cardDivider} />
      <CalendarWeekIcon width={28} height={28} style={styles.monitoringIcon} accessibilityLabel="Monitoring terakhir" />
      <Text style={styles.monitoringLabel}>Monitoring Terakhir</Text>
      <Text style={styles.monitoringDate}>14 Oktober 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 148,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0000000D',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
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
    width: 38,
    height: 38,
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
    fontWeight: '400',
    paddingVertical: 4,
  },
  monitoringIcon: {
    position: 'absolute',
    top: 96,
    left: 20,
    width: 28,
    height: 28,
  },
  monitoringLabel: {
    position: 'absolute',
    top: 88,
    left: 70,
    color: '#000000',
    fontFamily: 'AvantGarde Tx',
    fontSize: 17,
    lineHeight: 15,
    letterSpacing: 0,
    fontWeight: '400',
    paddingVertical: 4,
  },
  monitoringDate: {
    position: 'absolute',
    top: 110,
    left: 70,
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 17,
    lineHeight: 15,
    letterSpacing: 0,
    fontWeight: '700',
    paddingVertical: 4,
  },
});
