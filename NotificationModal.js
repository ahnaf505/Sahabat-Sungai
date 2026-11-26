import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import ArrowLeftIcon from './assets/icons/arrow-left.svg';

/** Blank notification popup with translucent dark backdrop and top-left back button. */
export default function NotificationModal({ visible, onClose }) {
  const { height } = useWindowDimensions();
  const cardHeight = Math.min(420, Math.round(height * 0.55));

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
});
