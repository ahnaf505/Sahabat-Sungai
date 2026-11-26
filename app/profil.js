import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import ClipboardListIcon from '../assets/icons/clipboard-list.svg';
import MapPointIcon from '../assets/icons/map-point.svg';
import ProfileIcon from '../assets/icons/nav-profile.svg';
import SproutIcon from '../assets/icons/sprout.svg';
import WarningTriangleIcon from '../assets/icons/warning-triangle.svg';
import { clearAllObservations, getObservationCount } from '../observationStorage';

const backgroundGradients = [
  {
    key: 'top',
    colors: ['#CDF1CA', '#FFFFFF', '#FFFFFF', 'rgba(255, 255, 255, 0)'],
    locations: [0.3, 0.52, 0.76, 1],
    styleKey: 'topGradient',
  },
  {
    key: 'bottom',
    colors: ['rgba(255, 255, 255, 0)', '#FFFFFF', '#FFFFFF', '#CDF1CA'],
    locations: [0, 0.24, 0.48, 0.7],
    styleKey: 'bottomGradient',
  },
];

const profileDetails = [
  { label: 'Peran', value: 'Pecinta & Pemantau Sungai' },
  { label: 'Wilayah Fokus', value: 'DAS Brantas, Malang Raya' },
  { label: 'Komunitas', value: 'Sahabat Sungai Malang' },
  { label: 'Fokus Pantauan', value: 'Makroinvertebrata & Kualitas Air' },
];

const profileHighlights = [
  { label: 'Status', value: 'Relawan Aktif' },
  { label: 'Domisili', value: 'Malang' },
  { label: 'Bergabung', value: '2026' },
];

export default function ProfilScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [observationCount, setObservationCount] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const isCompact = width < 380;
  const cardPadding = isCompact ? 18 : 22;

  const refreshObservationCount = useCallback(() => {
    try {
      setObservationCount(getObservationCount());
    } catch {
      setObservationCount(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshObservationCount();
    }, [refreshObservationCount]),
  );

  const handleConfirmClear = () => {
    setConfirmVisible(false);
    try {
      clearAllObservations();
      setObservationCount(0);
      setFeedbackModal({
        type: 'success',
        title: 'Data Dihapus',
        message: 'Semua catatan pengamatan sungai berhasil dihapus.',
      });
    } catch {
      setFeedbackModal({
        type: 'error',
        title: 'Gagal Menghapus',
        message: 'Terjadi kesalahan saat menghapus catatan pengamatan.',
      });
    }
  };

  return (
    <View style={styles.screen}>
      {backgroundGradients.map(({ key, colors, locations, styleKey }) => (
        <LinearGradient
          key={key}
          pointerEvents="none"
          colors={colors}
          locations={locations}
          style={styles[styleKey]}
        />
      ))}

      <View
        style={[
          styles.stickyHeader,
          {
            paddingTop: insets.top + 16,
            paddingHorizontal: width < 360 ? 16 : 24,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            onPress={() => router.replace('/')}
            style={styles.backButton}
          >
            <ArrowLeftIcon width={25} height={25} color="#000000" />
          </Pressable>
          <Text style={styles.headerTitle}>Profil</Text>
          <ProfileIcon width={30} height={30} color="#005E36" style={styles.rightIcon} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: 0,
            paddingBottom: Math.max(insets.bottom, 16) + 130,
            paddingHorizontal: width < 360 ? 16 : 24,
          },
        ]}
      >
        <View style={[styles.heroCard, { padding: cardPadding }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>PS</Text>
          </View>
          <Text style={styles.name}>Penjelajah Sungai</Text>
          <View style={styles.roleBadge}>
            <SproutIcon width={16} height={16} color="#005E36" />
            <Text style={styles.roleBadgeText}>Pecinta Sungai • Sahabat Sungai</Text>
          </View>
          <Text style={styles.bio}>
            Peduli kebersihan aliran sungai dan kelestarian bioindikator makroinvertebrata di lingkungan sekitar.
          </Text>

          <View style={styles.highlightsRow}>
            {profileHighlights.map(({ label, value }, index) => (
              <View
                key={label}
                style={[styles.highlightItem, index > 0 && styles.highlightDivider]}
              >
                <Text style={styles.highlightValue} numberOfLines={1} adjustsFontSizeToFit>
                  {value}
                </Text>
                <Text style={styles.highlightLabel} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { padding: cardPadding }]}>
          <View style={styles.cardHeading}>
            <MapPointIcon width={26} height={26} accessibilityLabel="" />
            <Text style={styles.cardTitle}>Identitas Relawan</Text>
          </View>
          <View style={styles.detailList}>
            {profileDetails.map(({ label, value }, index) => (
              <View
                key={label}
                style={[
                  styles.detailRow,
                  index < profileDetails.length - 1 && styles.detailRowBorder,
                ]}
              >
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { padding: cardPadding }]}>
          <View style={styles.cardHeading}>
            <ClipboardListIcon width={24} height={28} color="#005E36" />
            <Text style={styles.cardTitle}>Data Pengamatan</Text>
          </View>
          <Text style={styles.dataSummary}>
            {observationCount > 0
              ? `Tersimpan ${observationCount} catatan pengamatan sungai di penyimpanan lokal perangkat ini.`
              : 'Belum ada catatan pengamatan sungai yang tersimpan di penyimpanan lokal.'}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hapus semua data pengamatan"
            accessibilityState={{ disabled: observationCount === 0 }}
            disabled={observationCount === 0}
            onPress={() => setConfirmVisible(true)}
            style={[
              styles.clearButton,
              observationCount === 0 && styles.clearButtonDisabled,
            ]}
          >
            <WarningTriangleIcon
              width={18}
              height={18}
              color={observationCount === 0 ? '#9CA3AF' : '#B91C1C'}
            />
            <Text
              style={[
                styles.clearButtonLabel,
                observationCount === 0 && styles.clearButtonLabelDisabled,
              ]}
            >
              Hapus Semua Data Pengamatan
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setConfirmVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setConfirmVisible(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={[styles.modalBadge, styles.modalBadgeWarning]}>
              <WarningTriangleIcon width={26} height={26} color="#B91C1C" />
            </View>
            <Text style={styles.modalTitle}>Hapus Semua Data?</Text>
            <Text style={styles.modalMessage}>
              {`Seluruh ${observationCount} catatan pengamatan sungai yang tersimpan akan dihapus secara permanen dari perangkat ini.`}
            </Text>
            <View style={styles.modalActionRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setConfirmVisible(false)}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalCancelLabel}>Batal</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleConfirmClear}
                style={styles.modalDeleteButton}
              >
                <Text style={styles.modalDeleteLabel}>Hapus</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={Boolean(feedbackModal)}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setFeedbackModal(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setFeedbackModal(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View
              style={[
                styles.modalBadge,
                feedbackModal?.type === 'error'
                  ? styles.modalBadgeWarning
                  : styles.modalBadgeSuccess,
              ]}
            >
              <Text
                style={[
                  styles.modalBadgeText,
                  feedbackModal?.type === 'error'
                    ? styles.modalBadgeTextError
                    : styles.modalBadgeTextSuccess,
                ]}
              >
                {feedbackModal?.type === 'error' ? '!' : '✓'}
              </Text>
            </View>
            <Text style={styles.modalTitle}>{feedbackModal?.title}</Text>
            <Text style={styles.modalMessage}>{feedbackModal?.message}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setFeedbackModal(null)}
              style={styles.modalOkButton}
            >
              <Text style={styles.modalOkLabel}>OK</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: '42%' },
  bottomGradient: { position: 'absolute', top: '42%', left: 0, right: 0, bottom: 0 },
  stickyHeader: { width: '100%', maxWidth: 500, alignSelf: 'center', paddingBottom: 16, zIndex: 10 },
  headerRow: { minHeight: 55, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', left: 0, width: 55, height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 27.5, backgroundColor: '#FFFFFF' },
  rightIcon: { position: 'absolute', right: 0 },
  headerTitle: { paddingHorizontal: 64, color: '#000000', fontFamily: 'Poppins-SemiBold', fontWeight: '600', fontSize: 20, lineHeight: 20, paddingVertical: 2, textAlign: 'center' },
  content: { flexGrow: 1, width: '100%', maxWidth: 500, alignSelf: 'center' },
  heroCard: {
    marginTop: 2,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    boxShadow: '0px 0px 3px 0px #0000001F',
    elevation: 2,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005E36',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 36,
    includeFontPadding: false,
  },
  name: {
    marginTop: 14,
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  roleBadge: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EDF7F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleBadgeText: {
    color: '#005E36',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 12.5,
    lineHeight: 16,
  },
  bio: {
    marginTop: 12,
    color: '#4B5563',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
  },
  highlightsRow: {
    width: '100%',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  highlightDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#D1D5DB',
  },
  highlightValue: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  highlightLabel: {
    marginTop: 2,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  card: {
    marginTop: 16,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 3px 0px #0000001F',
    elevation: 2,
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    color: '#101010',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
  },
  detailList: {
    marginTop: 12,
  },
  detailRow: {
    paddingVertical: 10,
  },
  detailRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  detailLabel: {
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 12.5,
    lineHeight: 16,
  },
  detailValue: {
    marginTop: 2,
    color: '#101010',
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 19,
  },
  dataSummary: {
    marginTop: 12,
    color: '#4B5563',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 13.5,
    lineHeight: 20,
  },
  clearButton: {
    marginTop: 16,
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  clearButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  clearButtonLabel: {
    color: '#B91C1C',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    includeFontPadding: false,
  },
  clearButtonLabelDisabled: {
    color: '#9CA3AF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  modalBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalBadgeSuccess: {
    backgroundColor: '#EDF7F0',
  },
  modalBadgeWarning: {
    backgroundColor: '#FAD2C8',
  },
  modalBadgeText: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalBadgeTextSuccess: {
    color: '#1C5C3D',
  },
  modalBadgeTextError: {
    color: '#B91C1C',
  },
  modalTitle: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
  },
  modalMessage: {
    marginTop: 8,
    color: '#374151',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalActionRow: {
    width: '100%',
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EDF7F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelLabel: {
    color: '#1C5C3D',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18,
  },
  modalDeleteButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteLabel: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18,
  },
  modalOkButton: {
    marginTop: 18,
    width: '100%',
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1C5C3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOkLabel: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18,
  },
});
