import { useFonts } from 'expo-font';
import { router, Stack, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import BottomNavigation from '../BottomNavigation';

function AppNavigation() {
  const pathname = usePathname();
  const activeTab = pathname === '/input-observation' ? 'pantau' : pathname === '/edukasi' ? 'edukasi' : pathname === '/profil' ? 'profil' : 'beranda';

  const navigateToTab = (tab) => {
    if (tab.key !== activeTab) router.replace(tab.path);
  };

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.screenContent,
          animation: 'none',
        }}
      />
      <BottomNavigation activeTab={activeTab} onNavigate={navigateToTab} />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'AvantGarde-Demi': require('../assets/fonts/AVGARDD2.otf'),
    'AvantGarde Tx': require('../assets/fonts/AVGARDR2.otf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <AppNavigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContent: {
    backgroundColor: '#CCE7F0',
  },
});
