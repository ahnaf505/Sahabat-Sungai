import { Pressable, StyleSheet, Text, View } from 'react-native';
import BookIcon from './assets/icons/nav-book.svg';
import HomeIcon from './assets/icons/nav-home.svg';
import ProfileIcon from './assets/icons/nav-profile.svg';
import SearchIcon from './assets/icons/nav-search.svg';

const tabs = [
  { key: 'beranda', label: 'Beranda', Icon: HomeIcon, path: '/' },
  { key: 'pantau', label: 'Pantau', Icon: SearchIcon, path: '/input-observation' },
  { key: 'edukasi', label: 'Edukasi', Icon: BookIcon, path: '/edukasi' },
  { key: 'profil', label: 'Profil', Icon: ProfileIcon, path: '/profil' },
];

export default function BottomNavigation({ activeTab, onNavigate }) {
  return (
    <View style={styles.navigation} accessibilityRole="tablist">
      {tabs.map(({ key, label, Icon, path }) => {
        const isActive = activeTab === key;

        return (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
            onPress={() => onNavigate({ key, path })}
            style={styles.tabButton}
          >
            <Icon width={36} height={34} color={isActive ? '#005E36' : '#8C8C8C'} />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{label}</Text>
            {isActive && <View style={styles.activeTabUnderline} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 110,
    paddingTop: 28,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabButton: {
    width: 88,
    alignItems: 'center',
    gap: 4,
    paddingTop: 0,
    paddingBottom: 8,
    transform: [{ translateY: -4 }],
  },
  tabLabel: {
    color: '#8C8C8C',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 24.08,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#005E36',
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
  },
  activeTabUnderline: {
    position: 'absolute',
    bottom: -1,
    width: 76,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#005E36',
  },
});
