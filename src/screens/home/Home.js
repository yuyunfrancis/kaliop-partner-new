import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLORS} from '../../constants';
import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import CustomStatusBar from '../../components/CustomStatusBar';
import {STYLES} from '../../constants/theme';
import UserContext from '../../contexts/UserContext';
import {useTranslation} from 'react-i18next';

export default function Home() {
  const {user} = useContext(UserContext);
  const {t} = useTranslation();

  const [seedVendor, setSeedVendor] = React.useState(false);
  const [agroExpert, setAgroExpert] = React.useState(false);
  const [laboratory, setLaboratory] = React.useState(false);

  React.useEffect(() => {
    const userProfile = user?.profil?.map(users => {
      if (users?.name === 'AgroExpert' || users?.name === 'Laboratory') {
        setAgroExpert(true);
        setLaboratory(true);
      } else if (users.name === 'SeedVendor') {
        setSeedVendor(true);
      }
    });
  }, []);

  const navigation = useNavigation();
  // const userProfile = user?.profil?.map(users => users.name);

  const menuExpert = [
    {
      id: 1,
      title: t('appoinments'),
      description: t('desc1'),
      icon: (
        <Icon
          name="calendar-clock"
          style={{alignSelf: 'center'}}
          size={60}
          color={COLORS.primary}
        />
      ),

      onPress: function () {
        navigation.navigate('My Appointments');
      },
      iconType: 'MaterialIcons',
    },
    {
      id: 2,
      title: t('business'),
      description: t('desc2'),
      // icon: 'ios-person-outline',
      icon: (
        <Icons
          name="ios-business-sharp"
          style={{alignSelf: 'center'}}
          size={60}
          color={COLORS.primary}
        />
      ),

      onPress: function () {
        navigation.navigate('Business Profile');
      },
      iconType: 'Ionicons',
    },
    {
      id: 3,
      title: t('wallet'),
      description: t('desc3'),
      // icon: 'ios-wallet-outline',
      icon: (
        <Icons
          name="ios-wallet"
          style={{alignSelf: 'center'}}
          size={60}
          color={COLORS.primary}
        />
      ),

      onPress: function () {
        navigation.navigate('My Wallet');
      },
      iconType: 'Ionicons',
    },
    {
      id: 4,
      title: t('market'),
      description: t('desc4'),
      icon: (
        <Icons
          name="ios-basket-sharp"
          style={{alignSelf: 'center'}}
          size={60}
          color={COLORS.primary}
        />
      ),
      onPress: function () {
        navigation.navigate('ShopHome');
      },
      iconType: 'Entypo',
    },
  ];

  const menuSeed = [
    {
      id: 1,
      title: t('market'),
      description: t('desc4'),
      icon: (
        <Icons
          name="ios-basket-sharp"
          style={{alignSelf: 'center'}}
          size={60}
          color={COLORS.primary}
        />
      ),
      onPress: function () {
        navigation.navigate('ShopHome');
      },
      iconType: 'Entypo',
    },
    {
      id: 2,
      title: t('wallet'),
      description: t('desc3'),
      // icon: 'ios-wallet-outline',\
      icon: (
        <Icons
          name="ios-wallet"
          style={{alignSelf: 'center'}}
          size={60}
          color={COLORS.primary}
        />
      ),

      onPress: function () {
        navigation.navigate('My Wallet');
      },
      iconType: 'Ionicons',
    },
  ];

  function Item({item}) {
    return (
      <TouchableOpacity onPress={item.onPress}>
        <View style={[styles.card, STYLES.shadow]}>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginBottom: 20,
              marginTop: 20,
            }}>
            <View
              style={{
                backgroundColor: COLORS.iconBg,
                borderRadius: 75,
                padding: 12,
                width: 120,
                height: 120,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {item.icon}
            </View>
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              fontWeight: '500',
              color: COLORS.primary,
              marginTop: 10,
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {item.title}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              color: '#666',
              marginTop: 10,
              alignSelf: 'center',
            }}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const renderItem = ({item}) => {
    return <Item item={item} />;
  };

  return (
    <>
      <CustomStatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />

      <Header showTitle appTitle={t('home')} />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{paddingTop: height * 0.05}}
          showsVerticalScrollIndicator={false}>
          <Text
            style={{
              marginBottom: height * 0.03,
              fontSize: 18,
              fontWeight: '600',
              color: COLORS.primary,
              marginLeft: 5,
            }}>
            {t('welcome')}
          </Text>
          <FlatList
            style={{paddingBottom: 50}}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 20,
            }}
            numColumns={2}
            // data={
            //   userProfile === 'AgroExpert ' || userProfile === 'Laboratory'
            //     ? menuSeed
            //     : menuExpert
            // }
            data={agroExpert || laboratory ? menuExpert : menuSeed}
            scrollEnabled={true}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const width = Dimensions.get('window').width / 2 - 25;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: '#fff',
    width,
    // height: height * 0.32,
    marginHorizontal: 2,
    borderRadius: 15,
    marginBottom: 12,
    marginRight: 10,
  },
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.15)',
  },
  container: {
    marginHorizontal: 15,
    flex: 1,
    // paddingTop: 20,
  },
  solutionsText: {
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
});
