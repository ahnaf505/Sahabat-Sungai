import { useRef } from 'react';
import { Animated, Dimensions, Easing, Image, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CalendarWeekIcon from './assets/icons/calendar-week.svg';
import MapPointIcon from './assets/icons/map-point.svg';
import NavBookIcon from './assets/icons/nav-book.svg';
import NavHomeIcon from './assets/icons/nav-home.svg';
import NavPantauIcon from './assets/icons/nav-search.svg';
import NavProfileIcon from './assets/icons/nav-profile.svg';
import NotificationIcon from './assets/icons/notification.svg';
import { createStyles } from './App.styles';

const { width: screenWidth } = Dimensions.get('window');

const tabs = [
  { key: 'beranda' },
  { key: 'pantau' },
  { key: 'edukasi' },
  { key: 'profil' },
];

const styles = createStyles(screenWidth, tabs.length);

function HomeScreen() {
  return (
    <View style={styles.homeScreen}>
      <Image
        source={require('./assets/images/river-illustration.png')}
        style={styles.riverIllustration}
        resizeMode="contain"
        accessibilityLabel="River illustration"
      />
      <Text style={styles.greeting}>Halo, Penjelajah Sungai!</Text>
      <Text style={styles.subtext}>Ayo kita jaga kualitas sungai-sungai di lingkungan kita!</Text>
      <View style={styles.infoCard}>
        <MapPointIcon width={38} height={38} style={styles.mapPointIcon} accessibilityLabel="Lokasi sungai" />
        <Text style={styles.locationName}>Sungai Temboro Cemorokandang</Text>
        <Text style={styles.locationRegion}>Malang, Jawa Timur</Text>
        <View style={styles.cardDivider} />
        <CalendarWeekIcon width={28} height={28} style={styles.monitoringIcon} accessibilityLabel="Monitoring terakhir" />
        <Text style={styles.monitoringLabel}>Monitoring Terakhir</Text>
      </View>
    </View>
  );
}

function PantauScreen() {
  return (
    <View style={styles.contentScreen}>
      <Text style={styles.pageTitle}>Pantau Sungai</Text>
      <Text style={styles.pageIntro}>Pilih lokasi untuk melihat kondisi sungai terkini.</Text>
      <View style={styles.statusCard}>
        <MapPointIcon width={32} height={32} style={styles.statusIcon} />
        <Text style={styles.statusTitle}>Sungai Temboro</Text>
        <Text style={styles.statusDetail}>Cemorokandang, Malang</Text>
        <View style={styles.statusDivider} />
        <Text style={styles.statusLabel}>Status kualitas air</Text>
        <Text style={styles.statusValue}>Baik</Text>
      </View>
      <Pressable style={styles.primaryButton} accessibilityRole="button">
        <Text style={styles.primaryButtonLabel}>Lihat Detail Monitoring</Text>
      </Pressable>
    </View>
  );
}

function EdukasiScreen() {
  return (
    <View style={styles.contentScreen}>
      <Text style={styles.pageTitle}>Edukasi Sungai</Text>
      <Text style={styles.pageIntro}>Mulai dari kebiasaan kecil untuk menjaga sungai tetap bersih.</Text>
      <View style={styles.lessonCard}>
        <Text style={styles.lessonNumber}>01</Text>
        <Text style={styles.lessonTitle}>Jangan buang sampah ke sungai</Text>
        <Text style={styles.lessonDescription}>Pisahkan sampah organik dan anorganik sebelum dibuang.</Text>
      </View>
      <View style={styles.lessonCard}>
        <Text style={styles.lessonNumber}>02</Text>
        <Text style={styles.lessonTitle}>Gunakan air secukupnya</Text>
        <Text style={styles.lessonDescription}>Kurangi limbah rumah tangga yang masuk ke saluran air.</Text>
      </View>
    </View>
  );
}

function ProfilScreen() {
  return (
    <View style={styles.contentScreen}>
      <View style={styles.profileAvatar}><Text style={styles.profileInitial}>P</Text></View>
      <Text style={styles.profileName}>Penjelajah Sungai</Text>
      <Text style={styles.profileRole}>Sahabat Sungai</Text>
      <View style={styles.profileCard}>
        <Text style={styles.profileItemTitle}>Aktivitas Saya</Text>
        <Text style={styles.profileItemDetail}>Belum ada aktivitas yang tercatat.</Text>
      </View>
      <View style={styles.profileCard}>
        <Text style={styles.profileItemTitle}>Pengaturan</Text>
        <Text style={styles.profileItemDetail}>Kelola informasi dan preferensi akun Anda.</Text>
      </View>
    </View>
  );
}

const screens = [
  <HomeScreen key="beranda" />,
  <PantauScreen key="pantau" />,
  <EdukasiScreen key="edukasi" />,
  <ProfilScreen key="profil" />,
];

export default function App() {
  const pageOffset = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.lowerBackgroundGradient} />
      <View style={styles.brand}>
        <Image source={require('./assets/water-drop.png')} style={styles.waterDrop} accessibilityLabel="Sahabat Sungai logo" />
        <Text style={styles.brandName}>Sahabat{'\n'}Sungai</Text>
        <NotificationIcon width={46} height={46} style={styles.brandNotificationIcon} accessibilityLabel="Notifikasi" />
      </View>

      <View style={styles.pageViewport}>
        <Animated.View style={[styles.pageTrack, { transform: [{ translateX: pageOffset }] }]}>
          {screens.map((screen, index) => (
            <View key={tabs[index].key} style={styles.page}>
              {screen}
            </View>
          ))}
        </Animated.View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

