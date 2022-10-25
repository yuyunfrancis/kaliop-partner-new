import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useCallback, useState} from 'react';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';
import Loader from '../../components/Loader';

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

const ServiceHome = (props, {navigation}) => {
  const {t} = useTranslation();
  const navigatio = useNavigation();
  const {user} = useContext(UserContext);
  // const [services, setServices] = useState([]);
  // const [loading, setLoading] = useState(false);

  const [loading, error, services, fetchData] = useDataFetching(
    `${config.app.api_url}/services/by-user/${user._id}`,
  );

  useEffect(() => {
    const updateData = navigatio.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigatio]);
  // useEffect(() => {
  //   return async () => {
  //     try {
  //       setLoading(true);
  //       const data = await fetch(
  //         `${config.app.api_url}/services/by-user/${user._id}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: "Bearer " + user.token,
  //           },
  //         }
  //       );
  //       const result = await data.json();

  //       if (result) {
  //         setServices(result);
  //         // console.log('result', result);
  //         setLoading(false);
  //       }
  //     } catch (e) {
  //       setError(e.message);
  //       setLoading(false);
  //     }
  //   };
  // }, [navigation]);

  console.log('services', services);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={() => navigatio.navigate('ServiceDetails', item)}>
        <View style={[styles.shopContainer, styles.shadowProp]}>
          {/* <Icons
            name="delete-outline"
            size={24}
            color={COLORS.primary}
            style={{
              alignSelf: "flex-end",
              position: "absolute",
              top: 10,
              right: 8,
            }}
          /> */}

          {item.image == undefined ? (
            <View style={styles.iconContainer}>
              <Icon name="service" size={40} color={COLORS.primary} />
            </View>
          ) : (
            <View>
              <Image
                source={{
                  uri: `${config.app.api_url}/services/images/${item.image}`,
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
            {/* <View style={styles.locationIconContainer}>
              <IconLocation
                name="ios-location-outline"
                size={15}
                color="#7D7D7D"
              />
            </View> */}
            <Text style={styles.location}>
              {item.free == 1 ? 'Free' : `XAF${item.price}/${item.duree}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar title={t('myService')} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1, marginTop: 20, marginHorizontal: 15}}>
          <View style={styles.addBtn}>
            <Button
              labelStyle={{fontSize: 14}}
              style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
              mode="contained"
              disabled={services && services.length >= 1 ? true : false}
              icon="plus-circle-outline"
              onPress={() => navigatio.navigate('AddNewService')}>
              {t('addService')}
            </Button>
          </View>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Text style={{fontSize: 16, color: '#262525', fontWeight: '700'}}>
                {services?.data?.length > 0
                  ? t('textService')
                  : t('textService')}
              </Text>
              <FlatList
                columnWrapperStyle={{justifyContent: 'space-between'}}
                showVerticalScrollIndicator={false}
                scrollEnabled={true}
                contentContainerStyle={{
                  marginTop: 20,
                  flexGrow: 1,
                }}
                numColumns={2}
                data={services.data}
                // scrollEnabled={true}
                renderItem={renderItem}
                keyExtractor={(item, index) => index}
                refreshControl={
                  <RefreshControl refreshing={loading} onRefresh={fetchData} />
                }
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const width = Dimensions.get('window').width / 2 - 25;

export default ServiceHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addBtn: {
    alignItems: 'flex-end',
  },
  // content: {
  //   marginTop: 20,
  //   flex: 1,
  // },
  shopContainer: {
    padding: 30,
    width,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    // marginBottom: 20,
  },
  shadowProp: {
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  shopName: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  location: {
    fontWeight: '600',
    fontSize: 12,
    color: '#7D7D7D',
  },
});
