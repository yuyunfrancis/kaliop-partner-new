import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import Loader from 'react-native-modal-loader';
import axios from 'axios';

import StatusBar from '../../components/StatusBar';
import Search from '../../components/utils/Search';
import {COLORS} from '../../constants';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';

const OrderDetails = ({route}) => {
  const [catergoryIndex, setCategoryIndex] = useState(0);
  const categories = [
    {label: 'All orders', value: 1},
    {label: 'Accepted', value: 3},
    {label: 'Processing', value: 2},
    {label: 'Delivered', value: 4},
    {label: 'Rejected', value: 7},
    {label: 'Canceled', value: 6},
    {label: 'Received', value: 5},
  ];
  const navigation = useNavigation();
  const [loadstatus, setLoadstatus] = useState(false);
  const [open, setOpen] = useState(false);
  const order = route.params;

  const [loading, error, orders, fetchData] = useDataFetching(
    `${config.app.api_url}/order/by-store/${order.shop._id}`,
  );

  const [loadingstat, errorStat, stats, fetchStats] = useDataFetching(
    `${config.app.api_url}/order/stats/${order.shop._id}`,
  );

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
      fetchStats();
    });
    return updateData;
  }, [navigation]);

  searchByRef = ref => {
    return orders.data.find(data => data.ref === ref);
  };

  const handleDialogStatus = (order, item, route) => {
    return Alert.alert(
      'Are your sure?',
      `Are you sure you want to ${route} this order?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            console.log('ROUTE', route);
            handleChangeStatus(order, item, route);
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const handleChangeStatus = async (order, item, route) => {
    setLoadstatus(true);
    console.log(`${config.app.api_url}/order/${route}/${item._id}`);
    let data = new FormData();
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
            {
              title: 'Ok',
              onPress: () => navigation.navigate('OrderDetails', order),
            },
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

  const CategoryList = () => {
    return (
      <View style={styles.categoryContainer}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.2}
            onPress={() => setCategoryIndex(index)}>
            <Text
              style={[
                styles.categoryText,
                catergoryIndex === index && styles.categoryTextSelected,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <View style={[styles.item, {backgroundColor: item.color}]}>
        <Text style={{padding: 5, fontSize: 12, fontWeight: '600'}}>
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginRight: 5,
            fontWeight: '700',
            color: '#262525',
          }}>
          {item.value}
        </Text>
      </View>
    );
  };

  const renderOrder = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Order', item)}
        style={[styles.orderHistory, styles.shadow]}>
        <View style={styles.orderDetails}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.orderTitle}>#{item.ref}</Text>
            <Text style={styles.orderDate}>
              {item.createdAt.replace(/T/, ' ').replace(/\..+/, '')}
            </Text>
          </View>
          <Text style={styles.productPrice}>{item.total} XAF</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                backgroundColor: '#FFEDED',
                // alignSelf: "flex-start",
                paddingVertical: 5,
                paddingHorizontal: 15,
                borderRadius: 15,
              }}>
              {item.status == 1 ? (
                <Text>Pending</Text>
              ) : item.status == 2 ? (
                <Text>Confirmed</Text>
              ) : item.status == 3 ? (
                <Text>Accepted</Text>
              ) : item.status == 4 ? (
                <Text>Delivered</Text>
              ) : item.status == 5 ? (
                <Text>Received</Text>
              ) : item.status == 6 ? (
                <Text>Canceled</Text>
              ) : (
                <Text>Rejected</Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {item.status == 1 ? (
                <Text>Pending</Text>
              ) : item.status == 2 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Button
                    style={{marginRight: 8}}
                    mode="contained"
                    onPress={() => handleDialogStatus(order, item, 'accepted')}
                    uppercase={false}>
                    Accept
                  </Button>
                  <Button
                    // theme={{ colors: { primary: "#FFEDED" } }}
                    mode="outlined"
                    labelStyle={{color: '#FF0000'}}
                    uppercase={false}
                    onPress={() => handleDialogStatus(order, item, 'rejected')}>
                    Decline
                  </Button>
                </View>
              ) : item.status == 3 ? (
                <View>
                  <Button
                    style={{marginRight: 8}}
                    mode="contained"
                    onPress={() => handleDialogStatus(order, item, 'delivered')}
                    uppercase={false}>
                    Deliver
                  </Button>
                </View>
              ) : item.status == 4 ? (
                <Text></Text>
              ) : item.status == 5 ? (
                <Text></Text>
              ) : item.status == 6 ? (
                <Text></Text>
              ) : (
                <Text></Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar title="Order Details" />
      <View style={styles.container}>
        <Loader loading={loadstatus} color={COLORS.primary} />
        <View
          style={{
            // flexDirection: "row",
            // alignItems: "center",
            // justifyContent: "space-between",
            // marginRight: 15,
            marginTop: 20,
          }}>
          <View>
            <Search
              colorIcon={COLORS.primary}
              borderColor="#C1C1C1"
              colorPlaceholder="#C1C1C1"
              placeholderText={'Search Product'}
              searchWidth="95%"
              bgColor="#fff"
            />
          </View>

          {/* <TouchableOpacity style={styles.iconContainer} onPress={()=> setOpen(true)}>
            <Icon name="md-options-outline" size={35} color={COLORS.primary} />
          </TouchableOpacity> */}
        </View>

        <View style={[styles.summary, styles.shadow]}>
          <Text
            style={{
              alignSelf: 'flex-start',
              marginLeft: 10,
              marginBottom: 10,
              fontSize: 16,
              fontWeight: '700',
              color: '#262525',
            }}>
            Order Summary
          </Text>
          {loadingstat ? <ActivityIndicator /> : <View></View>}
          <FlatList
            data={stats.data}
            horizontal
            keyExtractor={(item, index) => index}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
      <View style={styles.orderListConatiner}>
        {/* <CategoryList /> */}
        <View style={{marginHorizontal: 15, paddingBottom: 50, paddingTop: 30}}>
          <View style={[styles.container, styles.horizontal]}>
            {loading ? <ActivityIndicator /> : <View></View>}
          </View>
          <FlatList
            data={orders.data}
            keyExtractor={(item, index) => index}
            renderItem={renderOrder}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
};

export default OrderDetails;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginTop: 15,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 15,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  iconContainer: {
    // padding: 10,
    paddingTop: 3,
    paddingBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C1C1C1',
    width: 47,
    height: 43,
    backgroundColor: '#fff',
    // marginRight: 15,
  },
  summary: {
    width: '100%',
    marginTop: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 8,
  },
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.15)',
  },
  item: {
    height: 60,
    paddingHorizontal: 5,
    marginRight: 6,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },

  categoryContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  categoryText: {fontSize: 15, color: 'grey', fontWeight: 'bold'},
  categoryTextSelected: {
    color: COLORS.primary,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
  },
  orderListConatiner: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 45,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  orderHistory: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  shadow: {
    shadowColor: '#E1E1E1',
    // shadowColor: "#171717",
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: '600',
    alignSelf: 'flex-end',
    color: COLORS.primary,
  },
  productId: {
    fontSize: 14,
    color: '#ACACAC',
    marginTop: 5,
    marginBottom: 15,
  },
});
