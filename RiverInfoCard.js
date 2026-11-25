import { StyleSheet, Text, View } from 'react-native';
import CalendarWeekIcon from './assets/icons/calendar-week.svg';
import ChevronRightIcon from './assets/icons/chevron-right.svg';
import MapPointIcon from './assets/icons/map-point.svg';

/** Displays the river location and last monitoring date card. */
export default function RiverInfoCard({ style }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.row}>
        <MapPointIcon width={38} height={38} accessibilityLabel="Lokasi sungai" />
        <View style={styles.locationTextGroup}>
          <Text style={styles.locationName}>Sungai Temboro Cemorokandang</Text>
          <Text style={styles.locationRegion}>Malang, Jawa Timur</Text>
        </View>
        <ChevronRightIcon width={11} height={19} color="#000000" />
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.row}>
        <CalendarWeekIcon width={28} height={28} accessibilityLabel="Monitoring terakhir" />
        <View style={styles.monitoringTextGroup}>
          <Text style={styles.monitoringLabel}>Monitoring Terakhir</Text>
          <Text style={styles.monitoringDate}>14 Oktober 2026</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 148,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextGroup: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  locationName: {
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 17,
    lineHeight: 18,
    fontWeight: '700',
    paddingVertical: 2,
  },
  locationRegion: {
    color: '#000000',
    fontFamily: 'AvantGarde Tx',
    fontSize: 17,
    lineHeight: 18,
    fontWeight: '400',
    paddingVertical: 2,
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: '#E0E0E0',
  },
  monitoringTextGroup: {
    flex: 1,
    marginLeft: 22,
  },
  monitoringLabel: {
    color: '#000000',
    fontFamily: 'AvantGarde Tx',
    fontSize: 17,
    lineHeight: 15,
    letterSpacing: 0,
    fontWeight: '400',
    paddingVertical: 4,
  },
  monitoringDate: {
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 17,
    lineHeight: 15,
    letterSpacing: 0,
    fontWeight: '700',
    paddingVertical: 4,
  },
});
