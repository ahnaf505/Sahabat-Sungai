import { useFonts } from 'expo-font';
import { router, Stack, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import BottomNavigation from '../BottomNavigation';

function AppNavigation() {
  const pathname = usePathname();
  const activeTab = pathname === '/input-observation' ? 'pantau' : 'beranda';

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNavigation
        activeTab={activeTab}
        onNavigate={(tab) => router.navigate(tab.path)}
      />
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
});
