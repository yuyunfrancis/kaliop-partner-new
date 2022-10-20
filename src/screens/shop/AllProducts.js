import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import {Dimensions} from 'react-native';

import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';
import Loader from '../../components/Loader';
import {useTranslation} from 'react-i18next';

const AllProducts = ({route}) => {
  const {t} = useTranslation();
  const {user} = useContext(UserContext);
  const [like, setLike] = useState(false);
  // const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(false);
  const stats = route.params;
  const [loading, error, products, fetchData] = useDataFetching(
    `${config.app.api_url}/products/by-store/${stats.shop._id}`,
  );

  console.log('====================================');
  console.log('Products', products);
  console.log('====================================');
  // console.log(products);
  const navigation = useNavigation();

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigation]);

  // const getProducts = () => {
  //   setLoading(true);
  //   const productsUrl = `${config.app.api_url}/products/by-store/${stats.shop._id}`;
  //   console.log("Items", productsUrl);

  //   const getProducts = axios.get(productsUrl, {
  //     headers: {
  //       Authorization: "Bearer " + user.token,
  //     },
  //   });

  //   axios.all([getProducts]).then(
  //     axios.spread((...allData) => {
  //       const allproductsData = allData[0].data.data;

  //       setProducts(allproductsData);
  //       setLoading(false);
  //       console.log("====================================");
  //       console.log("Products", products);
  //       console.log("====================================");
  //     })
  //   );
  // };

  const renderItem = ({item}) => {
    console.log('====================================');
    console.log(`${config.app.api_url}/products/images/${item.image}`);
    console.log('====================================');

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetails', {productDetails: item})
        }>
        <View style={styles.item}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="cover"
              source={{
                uri: `${config.app.api_url}/products/images/${item.image}`,
              }}
              style={{
                width: 150,
                height: 100,
                borderRadius: 12,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
              marginBottom: 5,
            }}>
            <Text numberOfLines={1} style={{fontSize: 15, fontWeight: '600'}}>
              {item.name}
            </Text>
            <TouchableOpacity>
              <Icon
                name={'ios-trash-outline'}
                size={25}
                color={COLORS.primary}
                style={{alignSelf: 'flex-end'}}
              />
            </TouchableOpacity>
          </View>
          <Text numberOfLines={3}>
            {item.description} {item.price}
            {item.currency.code}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar title={t('allProducts')} />
      <View style={styles.container}>
        <View style={styles.addBtn}>
          <Button
            labelStyle={{fontSize: 14}}
            style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
            mode="contained"
            icon="plus-circle-outline"
            onPress={() => navigation.navigate('AddProduct', stats)}>
            {t('addProducts')}
          </Button>
        </View>

        {loading ? (
          <Loader />
        ) : (
          <FlatList
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: 20,
              flexGrow: 1,
            }}
            numColumns={2}
            data={products.data}
            scrollEnabled={true}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchData} />
            }
          />
        )}
      </View>
    </>
  );
};

const width = Dimensions.get('window').width / 2 - 20;
export default AllProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 15,
  },
  addBtn: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    width,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  imageContainer: {
    alignSelf: 'center',
  },
});
