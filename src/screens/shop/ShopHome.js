import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconLocation from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';

import Loader from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const shops = [
  {
    id: 1,
    name: 'My First Shop',
    location: 'Marche Essos',
    orders: [
      {
        name: 'Orders',
        value: '30',
        iconType: 'Ionicons',
        iconName: 'ios-cart-outline',
        color: '#FFF1C6',
        iconContainerColor: '#FFC10D',
      },
      {
        name: 'Pending',
        value: '30',
        iconType: 'MaterialIcons',
        iconName: 'md-time-outline',
        color: '#E8EFFF',
        iconContainerColor: '#4C84FF',
      },
      {
        name: 'Processing',
        value: '30',
        iconType: 'Feather',
        iconName: 'ios-logo-electron',
        color: '#FFE8CE',
        iconContainerColor: '#FFA53C',
      },
      {
        name: 'Cancelled',
        value: '30',
        iconType: 'Ionicons',
        iconName: 'ios-stop-circle-outline',
        color: '#FFEDED',
        iconContainerColor: '#D74B4A',
      },
      {
        name: 'Completed',
        value: '30',
        iconType: 'Ionicons',
        iconName: 'md-checkmark-circle-outline',
        color: '#E7F5EC',
        iconContainerColor: COLORS.primary,
      },
    ],
  },
];

const ShopHome = props => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {user} = useContext(UserContext);

  console.log('user', user);

  const [loading, error, stores, fetchStores] = useDataFetching(
    `${config.app.api_url}/stores/by-user/${user._id}`,
  );

  console.log('stores', stores);

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchStores();
    });
    return updateData;
  }, [navigation]);

  const renderItem = ({item}) => {
    console.log(`${config.app.api_url}/stores/images/${item.image}`);
    return (
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={() => navigation.navigate('ShopDetails', item)}>
        <View style={[styles.shopContainer, styles.shadowProp]}>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              position: 'absolute',
              top: 10,
              right: 8,
            }}>
            <Icons name="delete-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {item.image == undefined ? (
            <View style={styles.iconContainer}>
              <Icon name="shop" size={40} color={COLORS.primary} />
            </View>
          ) : (
            <View>
              <Image
                source={{
                  uri: `${config.app.api_url}/stores/images/${item.image}`,
                }}
                style={{width: '20%', height: '20%'}}
              />
            </View>
          )}
          <Text style={styles.shopName} numberOfLines={1}>
            {item.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View style={styles.locationIconContainer}>
              <IconLocation
                name="ios-location-outline"
                size={15}
                color="#7D7D7D"
              />
            </View>
            <Text style={styles.location}>
              {item.country}, {item.city}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar title={t('shop')} />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 20}}
          showsVerticalScrollIndicator={false}
          style={{marginTop: 20, paddingBottom: 20, marginHorizontal: 15}}>
          <View style={styles.addBtn}>
            <Button
              labelStyle={{fontSize: 14}}
              style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
              mode="contained"
              disabled={stores.data && stores.data.length >= 1 ? true : false}
              icon="plus-circle-outline"
              onPress={() => navigation.navigate('AddNewShop')}>
              {t('addShop')}
            </Button>
          </View>

          {loading ? (
            <Loader />
          ) : (
            <View style={styles.content}>
              <Text style={{fontSize: 16, color: '#262525', fontWeight: '700'}}>
                {shops.length > 0 ? `${t('shopList')}` : `${t('noShop')}`}
              </Text>
              <FlatList
                columnWrapperStyle={{justifyContent: 'space-between'}}
                showVerticalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 20,
                  flexGrow: 1,
                }}
                numColumns={2}
                data={stores.data}
                scrollEnabled={true}
                renderItem={renderItem}
                keyExtractor={(item, index) => index}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchStores}
                  />
                }
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const width = Dimensions.get('window').width / 2 - 25;

export default ShopHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addBtn: {
    alignItems: 'flex-end',
  },
  content: {
    marginTop: 20,
  },
  shopContainer: {
    padding: 30,
    width,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  shadowProp: {
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  iconContainer: {
    padding: 20,
    backgroundColor: '#D3E9DC',
    borderRadius: 50,
    marginBottom: 10,
  },
  shopName: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  locationIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C2C2C2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  location: {
    fontWeight: '600',
    fontSize: 12,
    color: '#7D7D7D',
  },
});
