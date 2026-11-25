import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export default function App() {
  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.lowerBackgroundGradient} />
      <View style={styles.brand}>
        <Image
          source={require('./assets/water-drop.png')}
          style={styles.waterDrop}
          accessibilityLabel="Sahabat Sungai logo"
        />
        <Text style={styles.brandName}>Sahabat{'\n'}Sungai</Text>
        <Svg
          width={46}
          height={46}
          viewBox="0 0 46 46"
          style={styles.brandNotificationIcon}
          accessibilityLabel="Notifikasi"
        >
          <Circle cx={23} cy={23} r={23} fill="#FFFFFF" />
          <Path
            d="M26.8747 29.25V30.0938C26.8747 30.9889 26.5191 31.8473 25.8862 32.4802C25.2533 33.1132 24.3948 33.4688 23.4997 33.4688C22.6046 33.4688 21.7462 33.1132 21.1132 32.4802C20.4803 31.8473 20.1247 30.9889 20.1247 30.0938V29.25M32.5531 27.5324C31.1989 25.875 30.2429 25.0313 30.2429 20.4618C30.2429 16.2773 28.1061 14.7865 26.3474 14.0625C26.1138 13.9665 25.8939 13.7461 25.8227 13.5062C25.5142 12.4562 24.6493 11.5312 23.4997 11.5312C22.3501 11.5312 21.4847 12.4567 21.1794 13.5072C21.1082 13.7498 20.8883 13.9665 20.6547 14.0625C18.8939 14.7876 16.7592 16.2731 16.7592 20.4618C16.7566 25.0313 15.8005 25.875 14.4463 27.5324C13.8852 28.219 14.3767 29.25 15.3581 29.25H31.6466C32.6228 29.25 33.1111 28.2159 32.5531 27.5324Z"
            fill="none"
            stroke="#000000"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <View style={styles.imageArea}>
        <Image
          source={require('./assets/images/river-illustration.png')}
          style={styles.riverIllustration}
          resizeMode="contain"
          accessibilityLabel="River illustration"
        />
        <Text style={styles.greeting}>Halo, Penjelajah Sungai!</Text>
        <Text style={styles.subtext}>
          Ayo kita jaga kualitas sungai-sungai di lingkungan kita!
        </Text>
        <View style={styles.infoCard}>
          <Svg
            width={38}
            height={38}
            viewBox="0 0 38 38"
            style={styles.mapPointIcon}
            accessibilityLabel="Location"
          >
            <Path
              d="M18.9997 3.16699C25.9953 3.16699 31.6663 9.50441 31.6663 16.6253C31.6663 23.6905 27.6235 31.3706 21.3159 34.3188C19.8456 35.0059 18.1537 35.0059 16.6834 34.3188C10.3758 31.3706 6.33301 23.6905 6.33301 16.6253C6.33301 9.50441 12.0041 3.16699 18.9997 3.16699ZM18.9997 11.0837C16.3762 11.0837 14.2497 13.2103 14.2497 15.8337C14.2497 18.4571 16.3762 20.5837 18.9997 20.5837C21.6231 20.5837 23.7497 18.4571 23.7497 15.8337C23.7497 13.2103 21.6231 11.0837 18.9997 11.0837Z"
              fill="#005E36"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </Svg>
          <Text style={styles.locationName}>Sungai Temboro Cemorokandang</Text>
          <Text style={styles.locationRegion}>Malang, Jawa Timur</Text>
          <View style={styles.cardDivider} />
          <Svg
            width={28}
            height={28}
            viewBox="0 0 28 28"
            style={styles.monitoringIcon}
            accessibilityLabel="Monitoring terakhir"
          >
            <Path
              d="M19.25 11.375C19.25 11.1429 19.3422 10.9204 19.5063 10.7563C19.6704 10.5922 19.8929 10.5 20.125 10.5H21.875C22.1071 10.5 22.3296 10.5922 22.4937 10.7563C22.6578 10.9204 22.75 11.1429 22.75 11.375V13.125C22.75 13.3571 22.6578 13.5796 22.4937 13.7437C22.3296 13.9078 22.1071 14 21.875 14H20.125C19.8929 14 19.6704 13.9078 19.5063 13.7437C19.3422 13.5796 19.25 13.3571 19.25 13.125V11.375ZM14 11.375C14 11.1429 14.0922 10.9204 14.2563 10.7563C14.4204 10.5922 14.6429 10.5 14.875 10.5H16.625C16.8571 10.5 17.0796 10.5922 17.2437 10.7563C17.4078 10.9204 17.5 11.1429 17.5 11.375V13.125C17.5 13.3571 17.4078 13.5796 17.2437 13.7437C17.0796 13.9078 16.8571 14 16.625 14H14.875C14.6429 14 14.4204 13.9078 14.2563 13.7437C14.0922 13.5796 14 13.3571 14 13.125V11.375ZM5.25 16.625C5.25 16.3929 5.34219 16.1704 5.50628 16.0063C5.67038 15.8422 5.89294 15.75 6.125 15.75H7.875C8.10706 15.75 8.32962 15.8422 8.49372 16.0063C8.65781 16.1704 8.75 16.3929 8.75 16.625V18.375C8.75 18.6071 8.65781 18.8296 8.49372 18.9937C8.32962 19.1578 8.10706 19.25 7.875 19.25H6.125C5.89294 19.25 5.67038 19.1578 5.50628 18.9937C5.34219 18.8296 5.25 18.6071 5.25 18.375V16.625ZM10.5 16.625C10.5 16.3929 10.5922 16.1704 10.7563 16.0063C10.9204 15.8422 11.1429 15.75 11.375 15.75H13.125C13.3571 15.75 13.5796 15.8422 13.7437 16.0063C13.9078 16.1704 14 16.3929 14 16.625V18.375C14 18.6071 13.9078 18.8296 13.7437 18.9937C13.5796 19.1578 13.3571 19.25 13.125 19.25H11.375C11.1429 19.25 10.9204 19.1578 10.7563 18.9937C10.5922 18.8296 10.5 18.6071 10.5 18.375V16.625Z"
              fill="#005E36"
            />
            <Path
              d="M6.125 0C6.35706 0 6.57962 0.0921872 6.74372 0.256282C6.90781 0.420376 7 0.642936 7 0.875V1.75H21V0.875C21 0.642936 21.0922 0.420376 21.2563 0.256282C21.4204 0.0921872 21.6429 0 21.875 0C22.1071 0 22.3296 0.0921872 22.4937 0.256282C22.6578 0.420376 22.75 0.642936 22.75 0.875V1.75H24.5C25.4283 1.75 26.3185 2.11875 26.9749 2.77513C27.6313 3.4315 28 4.32174 28 5.25V24.5C28 25.4283 27.6313 26.3185 26.9749 26.9749C26.3185 27.6313 25.4283 28 24.5 28H3.5C2.57174 28 1.6815 27.6313 1.02513 26.9749C0.368749 26.3185 0 25.4283 0 24.5V5.25C0 4.32174 0.368749 3.4315 1.02513 2.77513C1.6815 2.11875 2.57174 1.75 3.5 1.75H5.25V0.875C5.25 0.642936 5.34219 0.420376 5.50628 0.256282C5.67038 0.0921872 5.89294 0 6.125 0ZM1.75 7V24.5C1.75 24.9641 1.93437 25.4092 2.26256 25.7374C2.59075 26.0656 3.03587 26.25 3.5 26.25H24.5C24.9641 26.25 25.4092 26.0656 25.7374 25.7374C26.0656 25.4092 26.25 24.9641 26.25 24.5V7H1.75Z"
              fill="#005E36"
            />
          </Svg>
          <Text style={styles.monitoringLabel}>Monitoring Terakhir</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cce7f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lowerBackgroundGradient: {
    position: 'absolute',
    top: '65%',
    left: 0,
    right: 0,
    bottom: 82,
    backgroundImage:
      'linear-gradient(180deg, rgba(205, 241, 202, 0) 0%, rgba(205, 241, 202, 0.22) 36%, rgba(205, 241, 202, 0.62) 72%, #CDF1CA 100%)',
  },
  brand: {
    position: 'absolute',
    top: 80,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterDrop: {
    width: 60,
    height: 60,
  },
  brandName: {
    marginLeft: 12,
    color: '#005E36',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 26,
    lineHeight: 25.42,
    letterSpacing: 0,
    fontWeight: '700',
    paddingTop: 4,
    paddingBottom: 4,
  },
  brandNotificationIcon: {
    marginLeft: 'auto',
  },
  imageArea: {
    position: 'absolute',
    top: 115,
    left: 0,
    width: '100%',
    aspectRatio: 440 / 392,
  },
  riverIllustration: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    position: 'absolute',
    top: 52,
    left: 32,
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: 0,
    fontWeight: '700',
  },
  subtext: {
    position: 'absolute',
    top: 85,
    left: 32,
    width: 300,
    color: '#000000',
    fontFamily: 'AvantGarde Tx',
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: 0,
    fontWeight: '400',
  },
  infoCard: {
    position: 'absolute',
    top: 230,
    left: 20,
    right: 20,
    height: 148,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0000000D',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardDivider: {
    position: 'absolute',
    top: 74,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  mapPointIcon: {
    position: 'absolute',
    top: 18,
    left: 20,
  },
  locationName: {
    position: 'absolute',
    top: 18,
    left: 70,
    right: 16,
    color: '#000000',
    fontFamily: 'AvantGarde-Demi',
    fontSize: 17,
    lineHeight: 15,
    letterSpacing: 0,
    fontWeight: '700',
    paddingVertical: 4,
  },
  locationRegion: {
    position: 'absolute',
    top: 40,
    left: 70,
    right: 16,
    color: '#000000',
    fontFamily: 'AvantGarde Tx',
    fontSize: 17,
    lineHeight: 15,
    letterSpacing: 0,
    fontWeight: '400',
    paddingVertical: 4,
  },
  monitoringIcon: {
    position: 'absolute',
    top: 96,
    left: 20,
  },
  monitoringLabel: {
    position: 'absolute',
    top: 102,
    left: 70,
    color: '#000000',
    fontFamily: 'AvantGarde Tx',
    fontSize: 17,
    lineHeight: 15,
    letterSpacing: 0,
    fontWeight: '400',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 82,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
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
  activeTabUnderline: {
    position: 'absolute',
    bottom: -9,
    width: 76,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#005E36',
  },
  activeTabLabel: {
    color: '#005E36',
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 24.08,
    textAlign: 'center',
  },
});
