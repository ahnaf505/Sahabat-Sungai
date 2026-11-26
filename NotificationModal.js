import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import ArrowLeftIcon from './assets/icons/arrow-left.svg';
import ClipboardListIcon from './assets/icons/clipboard-list.svg';
import GraduationCapIcon from './assets/icons/graduation-cap.svg';
import WarningTriangleIcon from './assets/icons/warning-triangle.svg';

const notifications = [
  {
    key: 'monitoring',
    label: 'PENGAMATAN',
    title: 'Waktunya memantau sungai',
    description: 'Catat kondisi air dan bioindikator secara rutin agar perubahan kualitas sungai mudah dikenali.',
    Icon: ClipboardListIcon,
  },
  {
    key: 'data-quality',
    label: 'PENGINGAT',
    title: 'Pastikan data pengamatan lengkap',
    description: 'Periksa kembali lokasi, tanggal, parameter air, dan temuan biota sebelum menyimpan data.',
    Icon: WarningTriangleIcon,
  },
  {
    key: 'education',
    label: 'EDUKASI',
    title: 'Kenali bioindikator sungai',
    description: 'Pelajari hubungan keanekaragaman makroinvertebrata dengan tingkat kesehatan ekosistem sungai.',
    Icon: GraduationCapIcon,
  },
];

/** App updates and monitoring reminders shown from the home screen. */
export default function NotificationModal({ visible, onClose }) {
  const { height } = useWindowDimensions();
  const cardHeight = Math.min(760, Math.round(height * 0.9));

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable accessibilityRole="button" accessibilityLabel="Tutup notifikasi" onPress={onClose} style={styles.overlay}>
        <Pressable onPress={(event) => event.stopPropagation()} style={[styles.card, { height: cardHeight }]}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kembali"
              onPress={onClose}
              style={styles.backButton}
            >
              <ArrowLeftIcon width={23} height={23} color="#005E36" />
            </Pressable>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>Notifikasi</Text>
              <Text style={styles.subtitle}>Informasi untuk Sahabat Sungai</Text>
            </View>
            <View style={styles.unreadBadge}><Text style={styles.unreadCount}>{notifications.length}</Text></View>
          </View>

          <ScrollView
            style={styles.notificationList}
            contentContainerStyle={styles.notificationListContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.featuredMessage}>
              <Text style={styles.featuredEyebrow}>JAGA SUNGAI BERSAMA</Text>
              <Text style={styles.featuredTitle}>Pengamatan kecil membawa dampak besar</Text>
              <Text style={styles.featuredDescription}>
                Data yang Anda kumpulkan membantu membangun gambaran kesehatan sungai yang lebih akurat.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Terbaru</Text>
            {notifications.map(({ key, label, title, description, Icon }) => (
              <View key={key} style={styles.notificationItem}>
                <View style={styles.iconContainer}>
                  <Icon width={25} height={25} color="#005E36" />
                </View>
                <View style={styles.notificationCopy}>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemLabel}>{label}</Text>
                    <View style={styles.unreadDot} />
                  </View>
                  <Text style={styles.itemTitle}>{title}</Text>
                  <Text style={styles.itemDescription}>{description}</Text>
                </View>
              </View>
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
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width: '100%',
    maxWidth: 460,
    paddingTop: 20,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 12px 0px #00000040',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EEE9',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#EAF5EF',
  },
  headerCopy: { flex: 1, marginLeft: 13 },
  title: { color: '#10251B', fontFamily: 'AvantGarde-Demi', fontSize: 22, lineHeight: 27, fontWeight: '700' },
  subtitle: { marginTop: 2, color: '#63756C', fontFamily: 'AvantGarde Tx', fontSize: 12, lineHeight: 16 },
  unreadBadge: { minWidth: 28, height: 28, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#005E36' },
  unreadCount: { color: '#FFFFFF', fontFamily: 'AvantGarde-Demi', fontSize: 12, fontWeight: '700' },
  notificationList: { flex: 1 },
  notificationListContent: { padding: 20, paddingBottom: 28 },
  featuredMessage: { padding: 19, borderRadius: 20, backgroundColor: '#005E36' },
  featuredEyebrow: { color: '#BDE7CF', fontFamily: 'AvantGarde-Demi', fontSize: 10, lineHeight: 14, letterSpacing: 1, fontWeight: '700' },
  featuredTitle: { marginTop: 8, color: '#FFFFFF', fontFamily: 'AvantGarde-Demi', fontSize: 19, lineHeight: 24, fontWeight: '700' },
  featuredDescription: { marginTop: 7, color: '#E0F1E7', fontFamily: 'AvantGarde Tx', fontSize: 13, lineHeight: 19 },
  sectionTitle: { marginTop: 24, marginBottom: 12, color: '#10251B', fontFamily: 'AvantGarde-Demi', fontSize: 16, lineHeight: 20, fontWeight: '700' },
  notificationItem: { flexDirection: 'row', paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E6EEE9' },
  iconContainer: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: '#EAF5EF' },
  notificationCopy: { flex: 1, marginLeft: 13 },
  itemMeta: { flexDirection: 'row', alignItems: 'center' },
  itemLabel: { color: '#007A46', fontFamily: 'AvantGarde-Demi', fontSize: 9, lineHeight: 13, letterSpacing: 0.8, fontWeight: '700' },
  unreadDot: { width: 6, height: 6, marginLeft: 7, borderRadius: 3, backgroundColor: '#43A66B' },
  itemTitle: { marginTop: 4, color: '#10251B', fontFamily: 'AvantGarde-Demi', fontSize: 15, lineHeight: 20, fontWeight: '700' },
  itemDescription: { marginTop: 5, color: '#63756C', fontFamily: 'AvantGarde Tx', fontSize: 12, lineHeight: 18 },
});
