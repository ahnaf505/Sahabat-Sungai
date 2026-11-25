import { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CalendarWeekIcon from './assets/icons/calendar-week.svg';
import MapPointIcon from './assets/icons/map-point.svg';
import NavBookIcon from './assets/icons/nav-book.svg';
import NavHomeIcon from './assets/icons/nav-home.svg';
import NavPantauIcon from './assets/icons/nav-search.svg';
import NavProfileIcon from './assets/icons/nav-profile.svg';
import NotificationIcon from './assets/icons/notification.svg';

const { width: screenWidth } = Dimensions.get('window');

const tabs = [
  { key: 'beranda', label: 'Beranda', Icon: NavHomeIcon },
  { key: 'pantau', label: 'Pantau', Icon: NavPantauIcon },
  { key: 'edukasi', label: 'Edukasi', Icon: NavBookIcon },
  { key: 'profil', label: 'Profil', Icon: NavProfileIcon },
];

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
  const [activeTab, setActiveTab] = useState(0);
  const pageOffset = useRef(new Animated.Value(0)).current;

  const selectTab = (index) => {
    if (index === activeTab) return;

    setActiveTab(index);
    Animated.timing(pageOffset, {
      toValue: -index * screenWidth,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

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

      <View style={styles.bottomNavigation} accessibilityRole="tablist">
        {tabs.map(({ key, label, Icon }, index) => {
          const isActive = index === activeTab;
          return (
            <Pressable
              key={key}
              style={styles.tabButton}
              onPress={() => selectTab(index)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={label}
            >
              <Icon width={36} height={34} opacity={isActive ? 1 : 0.58} />
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{label}</Text>
              {isActive && <View style={styles.activeTabUnderline} />}
            </Pressable>
          );
        })}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#cce7f0', overflow: 'hidden' },
  lowerBackgroundGradient: { position: 'absolute', top: '65%', left: 0, right: 0, bottom: 82, backgroundColor: '#CDF1CA' },
  brand: { position: 'absolute', zIndex: 1, top: 80, left: 24, right: 24, flexDirection: 'row', alignItems: 'center' },
  waterDrop: { width: 60, height: 60 },
  brandName: { marginLeft: 12, color: '#005E36', fontFamily: 'AvantGarde-Demi', fontSize: 26, lineHeight: 25.42, fontWeight: '700', paddingVertical: 4 },
  brandNotificationIcon: { marginLeft: 'auto', width: 46, height: 46 },
  pageViewport: { flex: 1, overflow: 'hidden', paddingBottom: 82 },
  pageTrack: { flex: 1, flexDirection: 'row', width: screenWidth * tabs.length },
  page: { width: screenWidth, flex: 1 },
  homeScreen: { flex: 1 },
  riverIllustration: { position: 'absolute', top: 115, width: '100%', aspectRatio: 440 / 392 },
  greeting: { position: 'absolute', top: 167, left: 32, color: '#000000', fontFamily: 'AvantGarde-Demi', fontSize: 25, lineHeight: 30, fontWeight: '700' },
  subtext: { position: 'absolute', top: 200, left: 32, width: 300, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 15, lineHeight: 19, fontWeight: '400' },
  infoCard: { position: 'absolute', top: 345, left: 20, right: 20, height: 148, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#0000000D', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 4 },
  cardDivider: { position: 'absolute', top: 74, left: 20, right: 20, height: 1, backgroundColor: '#E0E0E0' },
  mapPointIcon: { position: 'absolute', top: 18, left: 20, width: 38, height: 38 },
  locationName: { position: 'absolute', top: 18, left: 70, right: 16, color: '#000000', fontFamily: 'AvantGarde-Demi', fontSize: 17, lineHeight: 15, fontWeight: '700', paddingVertical: 4 },
  locationRegion: { position: 'absolute', top: 40, left: 70, right: 16, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 17, lineHeight: 15, fontWeight: '400', paddingVertical: 4 },
  monitoringIcon: { position: 'absolute', top: 96, left: 20, width: 28, height: 28 },
  monitoringLabel: { position: 'absolute', top: 102, left: 70, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 17, lineHeight: 15, fontWeight: '400' },
  contentScreen: { flex: 1, paddingTop: 180, paddingHorizontal: 24 },
  pageTitle: { color: '#005E36', fontFamily: 'AvantGarde-Demi', fontSize: 28, lineHeight: 34, fontWeight: '700' },
  pageIntro: { marginTop: 10, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 16, lineHeight: 23, fontWeight: '400' },
  statusCard: { marginTop: 28, minHeight: 195, padding: 20, borderRadius: 24, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  statusIcon: { position: 'absolute', top: 19, left: 20 },
  statusTitle: { marginLeft: 44, color: '#000000', fontFamily: 'AvantGarde-Demi', fontSize: 18, lineHeight: 22, fontWeight: '700' },
  statusDetail: { marginTop: 4, marginLeft: 44, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 14, lineHeight: 18, fontWeight: '400' },
  statusDivider: { height: 1, marginTop: 20, backgroundColor: '#E0E0E0' },
  statusLabel: { marginTop: 17, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 15, lineHeight: 19, fontWeight: '400' },
  statusValue: { marginTop: 4, color: '#005E36', fontFamily: 'AvantGarde-Demi', fontSize: 20, lineHeight: 25, fontWeight: '700' },
  primaryButton: { marginTop: 20, minHeight: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#005E36' },
  primaryButtonLabel: { color: '#FFFFFF', fontFamily: 'AvantGarde-Demi', fontSize: 15, lineHeight: 19, fontWeight: '700' },
  lessonCard: { marginTop: 20, padding: 20, borderRadius: 24, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  lessonNumber: { color: '#005E36', fontFamily: 'AvantGarde-Demi', fontSize: 16, lineHeight: 20, fontWeight: '700' },
  lessonTitle: { marginTop: 8, color: '#000000', fontFamily: 'AvantGarde-Demi', fontSize: 18, lineHeight: 23, fontWeight: '700' },
  lessonDescription: { marginTop: 7, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 15, lineHeight: 21, fontWeight: '400' },
  profileAvatar: { width: 88, height: 88, marginTop: 6, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#005E36' },
  profileInitial: { color: '#FFFFFF', fontFamily: 'AvantGarde-Demi', fontSize: 36, lineHeight: 42, fontWeight: '700' },
  profileName: { marginTop: 16, color: '#000000', fontFamily: 'AvantGarde-Demi', fontSize: 24, lineHeight: 29, fontWeight: '700' },
  profileRole: { marginTop: 4, color: '#005E36', fontFamily: 'AvantGarde Tx', fontSize: 16, lineHeight: 20, fontWeight: '400' },
  profileCard: { marginTop: 20, padding: 20, borderRadius: 24, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  profileItemTitle: { color: '#000000', fontFamily: 'AvantGarde-Demi', fontSize: 18, lineHeight: 23, fontWeight: '700' },
  profileItemDetail: { marginTop: 8, color: '#000000', fontFamily: 'AvantGarde Tx', fontSize: 15, lineHeight: 21, fontWeight: '400' },
  bottomNavigation: { position: 'absolute', bottom: 0, left: 0, right: 0, minHeight: 82, paddingTop: 12, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', elevation: 12, shadowColor: '#000000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  tabButton: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 2 },
  navIcon: { width: 36, height: 34, resizeMode: 'contain' },
  tabLabel: { color: '#8C8C8C', fontFamily: 'AvantGarde Tx', fontSize: 15, fontWeight: '400', lineHeight: 24.08, textAlign: 'center' },
  activeTabUnderline: { position: 'absolute', bottom: -9, width: 76, height: 5, borderRadius: 3, backgroundColor: '#005E36' },
  activeTabLabel: { color: '#005E36', fontFamily: 'AvantGarde-Demi', fontWeight: '700' },
});
