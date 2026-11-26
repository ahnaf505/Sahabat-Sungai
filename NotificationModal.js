import { useEffect } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from './assets/icons/arrow-left.svg';

/** Blank notification popup with blurred backdrop and top-left back button. */
export default function NotificationModal({ visible, blurTarget, onClose }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) return undefined;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => subscription.remove();
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <View
      style={[
        styles.overlay,
        {
          paddingTop: insets.top + 16,
          paddingBottom: Math.max(insets.bottom, 16) + 118,
        },
      ]}
      accessibilityViewIsModal
    >
      <BlurView
        intensity={60}
        tint="dark"
        blurMethod="dimezisBlurView"
        blurTarget={blurTarget}
        style={StyleSheet.absoluteFillObject}
      />
      <Pressable style={styles.scrim} onPress={onClose} />
      <View style={styles.card}>
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
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  card: {
    width: '100%',
    maxWidth: 460,
    minHeight: 380,
    maxHeight: '100%',
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
