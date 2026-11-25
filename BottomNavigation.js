import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const tabs = [
  { key: 'beranda', label: 'Beranda', icon: 'home', path: '/' },
  { key: 'pantau', label: 'Pantau', icon: 'location', path: '/input-observation' },
  { key: 'edukasi', label: 'Edukasi', icon: 'book', path: '/' },
  { key: 'profil', label: 'Profil', icon: 'profile', path: '/' },
];

function TabIcon({ name, color }) {
  if (name === 'home') {
    return <Svg width={24} height={24} viewBox="0 0 24 24" accessible={false}><Path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" /></Svg>;
  }

  if (name === 'location') {
    return <Svg width={24} height={24} viewBox="0 0 24 24" accessible={false}><Path d="M12 21s7-5.4 7-12A7 7 0 1 0 5 9c0 6.6 7 12 7 12Z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" /><Circle cx={12} cy={9} r={2.5} fill="none" stroke={color} strokeWidth={2} /></Svg>;
  }

  if (name === 'book') {
    return <Svg width={24} height={24} viewBox="0 0 24 24" accessible={false}><Path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" /></Svg>;
  }

  return <Svg width={24} height={24} viewBox="0 0 24 24" accessible={false}><Circle cx={12} cy={8} r={4} fill="none" stroke={color} strokeWidth={2} /><Path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" /></Svg>;
}

export default function BottomNavigation({ activeTab, onNavigate }) {
  return (
    <View style={styles.navigation} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const color = isActive ? '#005E36' : '#6B7280';

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            onPress={() => onNavigate(tab)}
            style={styles.tabButton}
          >
            <TabIcon name={tab.icon} color={color} />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
            {isActive && <View style={styles.activeTabUnderline} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: {
    position: 'absolute', bottom: 16, left: 16, right: 16, minHeight: 82,
    paddingTop: 12, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 24, elevation: 12,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8,
  },
  tabButton: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 2 },
  tabLabel: { color: '#8C8C8C', fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: '400', letterSpacing: 0, lineHeight: 24.08, textAlign: 'center' },
  activeTabLabel: { color: '#005E36', fontFamily: 'AvantGarde-Demi', fontWeight: '700' },
  activeTabUnderline: { position: 'absolute', bottom: -9, width: 76, height: 5, borderRadius: 3, backgroundColor: '#005E36' },
});
