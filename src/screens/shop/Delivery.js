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
import React, {useContext, useEffect} from 'react';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/AntDesign';

import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';

const Delivery = (props, {navigation}) => {
  const {t} = useTranslation();
  const navigatio = useNavigation();
  const {shop} = props.route.params;
  const {user} = useContext(UserContext);

  const [loading, error, deliveries, fetchData] = useDataFetching(
    `${config.app.api_url}/delivery/${shop._id}`,
  );

  console.log('deliveries', deliveries);

  useEffect(() => {
    const updateData = navigatio.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigatio]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.shopContainer}>
        <TouchableOpacity
          onPress={() => navigatio.navigate('EditDelivery', item)}
          style={{alignSelf: 'flex-end'}}>
          <Icon name="edit" size={18} />
        </TouchableOpacity>
        <Text style={styles.shopName} numberOfLines={1}>
          {t('shipping')}
        </Text>
        <Text style={styles.shopName} numberOfLines={1}>
          {item.city}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text style={styles.location}>XAF {item.price}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar title={t('deliveryTitle')} />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
          style={{marginHorizontal: 15, paddingVertical: 15}}>
          <Button
            labelStyle={{fontSize: 14}}
            style={{
              paddingTop: 3,
              paddingBottom: 3,
              paddingRight: 2,
              alignSelf: 'flex-end',
            }}
            mode="contained"
            disabled={deliveries && deliveries.length >= 2 ? true : false}
            icon="plus-circle-outline"
            onPress={() => navigatio.navigate('AddNewDelivery', {shop})}>
            {t('addDelivery')}
          </Button>
          {deliveries == null ? (
            <Text>{t('noDelivery')}</Text>
          ) : (
            <FlatList
              columnWrapperStyle={{justifyContent: 'space-between'}}
              showVerticalScrollIndicator={false}
              contentContainerStyle={{
                marginTop: 20,
              }}
              numColumns={2}
              data={deliveries.data}
              // scrollEnabled={true}
              renderItem={renderItem}
              keyExtractor={(item, index) => index}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchData} />
              }
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const width = Dimensions.get('window').width / 2 - 25;

export default Delivery;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 15,
  },

  content: {
    marginTop: 20,
  },
  shopContainer: {
    padding: 20,
    width,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  shopName: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
