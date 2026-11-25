import { Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BarChartIcon from './assets/icons/bar-chart.svg';
import ChevronRightIcon from './assets/icons/chevron-right.svg';
import ClipboardListIcon from './assets/icons/clipboard-list.svg';
import GraduationCapIcon from './assets/icons/graduation-cap.svg';
import MapPointIcon from './assets/icons/map-point.svg';
import NotificationIcon from './assets/icons/notification.svg';
import { styles } from './App.styles';
import RiverInfoCard from './RiverInfoCard';

const tabs = [
  { key: 'beranda' },
  { key: 'pantau' },
  { key: 'edukasi' },
  { key: 'profil' },
];

const homeActions = [
  {
    key: 'input-pengamatan',
    label: 'Input Pengamatan',
    Icon: ClipboardListIcon,
    iconWidth: 29,
    iconHeight: 36,
    iconColor: '#FFFFFF',
    buttonStyle: [styles.primaryActionButton, styles.inputActionButton],
    labelStyle: styles.primaryActionButtonLabel,
  },
  {
    key: 'lihat-analisis',
    label: 'Lihat Analisis',
    Icon: BarChartIcon,
    iconWidth: 31,
    iconHeight: 31,
    iconColor: '#000000',
    buttonStyle: [styles.secondaryActionButton, styles.analysisActionButton],
    labelStyle: styles.secondaryActionButtonLabel,
  },
  {
    key: 'belajar-bioindikator',
    label: 'Belajar Bioindikator',
    Icon: GraduationCapIcon,
    iconWidth: 35,
    iconHeight: 35,
    iconColor: '#000000',
    buttonStyle: [styles.secondaryActionButton, styles.educationActionButton],
    labelStyle: styles.secondaryActionButtonLabel,
  },
];

function useResponsiveMetrics() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const horizontalPadding = width < 360 ? 16 : 20;
  const bottomNavClearance = Math.max(insets.bottom, 16) + 96;

  return { insets, width, height, horizontalPadding, bottomNavClearance };
}

function HomeScreen() {
  const { insets, width, height, horizontalPadding, bottomNavClearance } = useResponsiveMetrics();
  const isCompactHeight = height < 720;
  const heroGap = isCompactHeight ? 10 : Math.min(24, Math.round(height * 0.025));
  const stackGap = isCompactHeight ? 12 : 16;
  const cardTopMargin = Math.max(isCompactHeight ? 18 : 28, Math.min(130, height - 700));

  return (
    <ScrollView
      style={styles.homeScreen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.homeScrollContent,
        {
          paddingTop: insets.top + (isCompactHeight ? 10 : 16),
          paddingBottom: bottomNavClearance + 16,
          paddingHorizontal: horizontalPadding,
        },
      ]}
    >
      <Image
        source={require('./assets/images/river-illustration.png')}
        style={[
          styles.riverIllustration,
          {
            top: insets.top + (isCompactHeight ? 36 : 52),
            width: Math.min(width, 500),
          },
        ]}
        resizeMode="contain"
        accessibilityLabel="River illustration"
      />
      <View style={[styles.brand, { paddingHorizontal: width < 360 ? 0 : 4 }]}>
        <Image source={require('./assets/water-drop.png')} style={styles.waterDrop} accessibilityLabel="Sahabat Sungai logo" />
        <Text style={styles.brandName}>Sahabat{'\n'}Sungai</Text>
        <NotificationIcon width={46} height={46} style={styles.brandNotificationIcon} accessibilityLabel="Notifikasi" />
      </View>

      <View style={[styles.heroTextGroup, { marginTop: heroGap }]}>
        <Text style={styles.greeting}>Halo, Penjelajah Sungai!</Text>
        <Text style={styles.subtext}>Ayo kita jaga kualitas sungai-sungai di lingkungan kita!</Text>
      </View>

      <View style={[styles.homeActionsStack, { marginTop: cardTopMargin, gap: stackGap }]}>
        <RiverInfoCard />
        <View style={styles.homeButtonsGroup}>
          {homeActions.map(({ key, label, Icon, iconWidth, iconHeight, iconColor, buttonStyle, labelStyle }) => (
            <Pressable key={key} style={[styles.actionButton, buttonStyle]} accessibilityRole="button">
              <Icon width={iconWidth} height={iconHeight} color={iconColor} />
              <Text style={[styles.actionButtonLabel, labelStyle]} numberOfLines={1} adjustsFontSizeToFit>
                {label}
              </Text>
              <ChevronRightIcon width={11} height={19} color={iconColor} style={styles.actionButtonChevron} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function PantauScreen() {
  const { insets, horizontalPadding, bottomNavClearance } = useResponsiveMetrics();

  return (
    <ScrollView
      style={styles.contentScreen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentScrollContent,
        {
          paddingTop: insets.top + 28,
          paddingBottom: bottomNavClearance + 16,
          paddingHorizontal: horizontalPadding + 4,
        },
      ]}
    >
      <Text style={styles.pageTitle}>Pantau Sungai</Text>
      <Text style={styles.pageIntro}>Pilih lokasi untuk melihat kondisi sungai terkini.</Text>
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <MapPointIcon width={32} height={32} />
          <View>
            <Text style={styles.statusTitle}>Sungai Temboro</Text>
            <Text style={styles.statusDetail}>Cemorokandang, Malang</Text>
          </View>
        </View>
        <View style={styles.statusDivider} />
        <Text style={styles.statusLabel}>Status kualitas air</Text>
        <Text style={styles.statusValue}>Baik</Text>
      </View>
      <Pressable style={styles.primaryButton} accessibilityRole="button">
        <Text style={styles.primaryButtonLabel}>Lihat Detail Monitoring</Text>
      </Pressable>
    </ScrollView>
  );
}

function EdukasiScreen() {
  const { insets, horizontalPadding, bottomNavClearance } = useResponsiveMetrics();

  return (
    <ScrollView
      style={styles.contentScreen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentScrollContent,
        {
          paddingTop: insets.top + 28,
          paddingBottom: bottomNavClearance + 16,
          paddingHorizontal: horizontalPadding + 4,
        },
      ]}
    >
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
    </ScrollView>
  );
}

function ProfilScreen() {
  const { insets, horizontalPadding, bottomNavClearance } = useResponsiveMetrics();

  return (
    <ScrollView
      style={styles.contentScreen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentScrollContent,
        {
          paddingTop: insets.top + 28,
          paddingBottom: bottomNavClearance + 16,
          paddingHorizontal: horizontalPadding + 4,
        },
      ]}
    >
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
    </ScrollView>
  );
}

const screens = [
  <HomeScreen key="beranda" />,
  <PantauScreen key="pantau" />,
  <EdukasiScreen key="edukasi" />,
  <ProfilScreen key="profil" />,
];

export default function App() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255, 255, 255, 0)', '#FFFFFF', '#FFFFFF', '#CDF1CA']}
        locations={[0, 0.24, 0.48, 0.7]}
        style={styles.lowerBackgroundGradient}
      />
      <Image
        pointerEvents="none"
        source={require('./assets/images/bush-illustration.png')}
        style={[
          styles.bottomLeftBush,
          { bottom: Math.max(insets.bottom, 16) + 4 },
        ]}
        resizeMode="contain"
        accessibilityLabel="Bush illustration"
      />

      <View style={styles.pageViewport}>
        <View style={[styles.pageTrack, { width: width * tabs.length }]}>
          {screens.map((screen, index) => (
            <View key={tabs[index].key} style={[styles.page, { width }]}>
              {screen}
            </View>
          ))}
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
