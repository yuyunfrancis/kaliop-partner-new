import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Fontisto';

import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';
import DialogInput from 'react-native-dialog-input';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const products = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Product 1 description goes here and everything',
  },
];

const ShopDetails = ({route}) => {
  const {t} = useTranslation();
  const options = [
    {
      id: 1,
      option: t('orders'),
      screen: 'OrderDetails',
      icon: 'prescription',
    },
    {
      id: 2,
      option: t('products'),
      screen: 'AllProducts',
      icon: 'shopping-basket',
    },
    {
      id: 3,
      option: t('shopProfile'),
      screen: 'ShopProfile',
      icon: 'shopping-store',
    },
    {
      id: 4,
      option: t('delivery'),
      screen: 'Delivery',
      icon: 'automobile',
    },
  ];
  const items = route.params;
  const navigation = useNavigation();
  const {user} = useContext(UserContext);
  const [dialog, setDialog] = useState(false);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingstat, error, stats, fetchData] = useDataFetching(
    `${config.app.api_url}/order/stats/${items._id}`,
  );
  console.log('Stats', stats.data);

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigation]);

  const updateDeliveryPrice = async price => {
    setDialog(false);
    setLoading(true);
    const data = new FormData();
    data.append('price_livraison', price);
    const configurationData = {
      method: 'PATCH',
      url: `${config.app.api_url}/stores/delivery/${items._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      },
      data: {
        price_livraison: price,
      },
    };
    console.log(configurationData);
    await axios(configurationData)
      .then(response => {
        console.log('response', response);
        setLoading(false);
        if (response.data.status === 'success') {
          setPrice(price);
          items.price_livraison = price;
          Alert.alert('success', response.data.message, [
            {title: 'Ok', onPress: () => navigation.goBack()},
          ]);
        }
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('error', error, [
          {title: 'Ok', onPress: () => navigation.goBack()},
        ]);
      });
  };

  const renderItems = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(item.screen, {stats: stats.data, shop: items})
        }>
        <View style={styles.card}>
          <Icons name={item.icon} size={45} color={COLORS.primary} />
          <Text
            numberOfLines={1}
            style={{marginTop: 10, fontSize: 14, fontWeight: '600'}}>
            {item.option}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={() =>
          navigation.navigate('OrderDetails', {
            stats: stats.data,
            shop: items,
          })
        }>
        <View
          style={[
            styles.summaryCard,
            styles.shadow,
            {backgroundColor: item.color},
          ]}>
          <View style={styles.summaryCardHeader}>
            <View
              style={[
                styles.iconView,
                {backgroundColor: item.iconContainerColor},
              ]}>
              <Icon name={item.iconName} size={15} color="#FFF" />
            </View>
            <Text style={{fontSize: 14, fontWeight: '600', color: '#262525'}}>
              {item.name}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '500',
              color: '#262525',
              marginTop: 10,
            }}>
            {item.value}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  let order = items.orders.map(order => {});

  return (
    <>
      <StatusBar title={items.name} />
      <SafeAreaView style={styles.container}>
        <View>
          {loadingstat || loading ? <ActivityIndicator /> : <View></View>}
          <FlatList
            contentContainerStyle={{marginVertical: 10}}
            showsHorizontalScrollIndicator={false}
            data={stats.data}
            scrollEnabled={true}
            horizontal={true}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
          />
        </View>
        <View>
          <View style={[styles.shopOptions, styles.shadow]}>
            <View>
              <FlatList
                data={options}
                renderItem={renderItems}
                keyExtractor={(item, index) => index}
                numColumns={2}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
        <DialogInput
          isDialogVisible={dialog}
          title={'Update Delivery Price'}
          message={'Delivery Price'}
          hintInput={`${items.price_livraison}`}
          submitInput={inputText => {
            updateDeliveryPrice(inputText);
          }}
          closeDialog={() => {
            setDialog(false);
          }}></DialogInput>
        {/* <View style={styles.shopProducts}>
          <Text>Top Products</Text>
        </View> */}
      </SafeAreaView>
    </>
  );
};
const width = Dimensions.get('window').width / 2 - 60;

export default ShopDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  summaryCard: {
    padding: 10,
    width,
    height: 85,
    borderRadius: 8,
    marginRight: 15,
  },

  shadow: {
    shadowColor: '#E1E1E1',
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconView: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  shopOptions: {
    marginTop: 20,
    width: '100%',
    height: 320,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  // shadow: {
  //   shadowColor: "rgba(0, 0, 0, 0.15)",
  // },
  card: {
    width: width * 1.1,
    height: 128,
    borderWidth: 1,
    borderColor: '#C1C1C1',
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
