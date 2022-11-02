import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  View,
} from 'react-native';
import React, {useState, useContext} from 'react';
import axios from 'axios';
import Loader from 'react-native-modal-loader';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';

const Order = ({route}) => {
  const items = route.params;
  const [loadstatus, setLoadstatus] = useState(false);
  const navigation = useNavigation();
  const {user} = useContext(UserContext);

  console.log('Orderdetails', items.products);

  const handleDialogStatus = (item, route) => {
    return Alert.alert(
      'Are your sure?',
      `Are you sure you want to ${route} this order?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            console.log('ROUTE', route);
            handleChangeStatus(item, route);
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const handleChangeStatus = async (item, route) => {
    setLoadstatus(true);
    let data = new FormData();
    console.log(`${config.app.api_url}/order/${route}/${item._id}`);
    data.append('order', item._id);
    const configurationData = {
      method: 'PATCH',
      url: `${config.app.api_url}/order/${route}/${item._id}`,
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
      data: data,
    };
    await axios(configurationData)
      .then(response => {
        console.log('response', response);
        if (response.data.status === 'success') {
          setLoadstatus(false);
          Alert.alert('success', response.data.message, [
            {title: 'Ok', onPress: () => navigation.goBack()},
          ]);
        }
      })
      .catch(error => {
        setLoadstatus(false);
        Alert.alert('error', error, [
          {title: 'Ok', onPress: () => navigation.goBack()},
        ]);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.item} key={item._id}>
        <Image
          source={{
            uri: `${config.app.api_url}/products/images/${
              item.product ? item.product.image : ''
            }`,
          }}
          style={{width: 60, height: 60, borderRadius: 4}}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>
            {item.product ? item.product.name : ''}
          </Text>
          <Text>{`${item ? item.quantity : ''}`}</Text>
        </View>
        <Text style={styles.itemPrice}>
          {item.product ? item.product.price : ''}
        </Text>
      </View>
    );
  };

  return (
    <>
      <StatusBar title={`Order Details - #${items.ref}`} />
      <SafeAreaView style={{flex: 1, marginHorizontal: 15}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.container, {marginTop: 20}]}>
            <Loader loading={loadstatus} color={COLORS.primary} />
            <Text style={[styles.title, {marginBottom: 15, fontWeight: '600'}]}>
              Buyer Info
            </Text>
            <View>
              <Text style={[styles.title, {fontWeight: '500'}]}>
                Buyer Name & Phone
              </Text>
              <View style={{marginTop: 6}}>
                <Text style={styles.info}>{items.user.name}</Text>
                <Text>{items.address.phone}</Text>
                <Text>
                  {items.address.country}, {items.address.city}
                </Text>
                <Text>{items.address.quarter}</Text>
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[styles.title, {fontWeight: '600'}]}>
                Manage Order
              </Text>
              <View style={styles.selectStatus}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {items.status == 1 ? (
                    <Text></Text>
                  ) : items.status == 2 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Button
                        style={{marginRight: 8}}
                        mode="contained"
                        onPress={() => handleDialogStatus(items, 'accepted')}
                        uppercase={false}>
                        Accept
                      </Button>
                      <Button
                        // theme={{ colors: { primary: "#FFEDED" } }}
                        mode="outlined"
                        labelStyle={{color: '#FF0000'}}
                        uppercase={false}
                        onPress={() => handleDialogStatus(items, 'rejected')}>
                        Decline
                      </Button>
                    </View>
                  ) : items.status == 3 ? (
                    <View>
                      <Button
                        style={{marginRight: 8}}
                        mode="contained"
                        onPress={() => handleDialogStatus(items, 'delivered')}
                        uppercase={false}>
                        Deliver
                      </Button>
                    </View>
                  ) : items.status == 4 ? (
                    <Text></Text>
                  ) : items.status == 5 ? (
                    <Text></Text>
                  ) : items.status == 6 ? (
                    <Text></Text>
                  ) : (
                    <Text></Text>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text>{`${items.ref} - ${items.createdAt
                .replace(/T/, ' ')
                .replace(/\..+/, '')}`}</Text>
              <View>
                {items.status == 1 ? (
                  <Text>Pending</Text>
                ) : items.status == 2 ? (
                  <Text>Confirmed</Text>
                ) : items.status == 3 ? (
                  <Text>Accepted</Text>
                ) : items.status == 4 ? (
                  <Text>Delivered</Text>
                ) : items.status == 5 ? (
                  <Text>Received</Text>
                ) : items.status == 6 ? (
                  <Text>Canceled</Text>
                ) : (
                  <Text>Rejected</Text>
                )}
              </View>
            </View>
            <View style={{marginTop: 20}}>
              <FlatList
                data={items.items}
                keyExtractor={(item, index) => item._id}
                renderItem={renderItem}
              />
            </View>
          </View>
          <View style={styles.container}>
            <Text
              style={{
                marginBottom: 20,
                color: '#262525',
                fontSize: 15,
                fontWeight: '600',
              }}>
              Product Details
            </Text>
            <View style={[styles.priceDetails, {marginVertical: 8}]}>
              <Text>Product Price</Text>
              <Text>{items.total}</Text>
            </View>
            {/* <View style={[styles.priceDetails, { marginVertical: 8 }]}>
              <Text>Delivery Fee</Text>
              <Text>{items.Delivery}</Text>
            </View> */}
            <View style={[styles.priceDetails, {marginTop: 25}]}>
              <Text>Total Price</Text>
              <Text>{items.total}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D6DAD9',
  },
  title: {
    color: '#262525',
    fontSize: 15,
  },
  info: {
    color: '#262525',
    fontSize: 14,
    marginBottom: 4,
  },
  //   selectStatus: {
  //     backgroundColor: COLORS.primary,
  //     paddingHorizontal: 15,
  //     borderRadius: 8,

  //     paddingVertical: 8,
  //   },
  item: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
