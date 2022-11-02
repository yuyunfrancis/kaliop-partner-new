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

const ServiceHome = (props, {navigation}) => {
  const {t} = useTranslation();
  const navigatio = useNavigation();
  const {user} = useContext(UserContext);

  const [loading, error, services, fetchData] = useDataFetching(
    `${config.app.api_url}/services/by-user/${user._id}`,
  );

  useEffect(() => {
    const updateData = navigatio.addListener('focus', () => {
      fetchData();
    });
    return updateData;
  }, [navigatio]);

  console.log('services', services);

  const renderItem = ({item}) => {
    return (
      <View style={styles.shopContainer}>
        <TouchableOpacity
          onPress={() => navigatio.navigate('ServiceDetails', item)}
          style={{alignSelf: 'flex-end'}}>
          <Icon name="eye" size={18} />
        </TouchableOpacity>
        {/* {item.image == undefined ? (
          <View style={styles.iconContainer}>
            <Icon name="service" size={40} color={COLORS.primary} />
          </View>
        ) : (
          <View>
            <Image
              source={{
                uri: `${config.app.api_url}/services/images/${item?.image}`,
              }}
              style={{width: '20%', height: '20%'}}
            />
          </View>
        )} */}
        <Text style={styles.shopName} numberOfLines={1}>
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text style={styles.location}>
            {item.free == 1 ? 'Free' : `XAF${item.price}/${item.duree}`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar title={t('myService')} />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
          style={{marginHorizontal: 15, paddingVertical: 15}}>
          {/* <View style={styles.addBtn}>
            <Button
              labelStyle={{fontSize: 14}}
              style={{paddingTop: 3, paddingBottom: 3, paddingRight: 2}}
              mode="contained"
              disabled={services && services.length >= 1 ? true : false}
              icon="plus-circle-outline"
              onPress={() => navigatio.navigate('AddNewService')}>
              {t('addService')}
            </Button>
          </View> */}
          <Button
            labelStyle={{fontSize: 14}}
            style={{
              paddingTop: 3,
              paddingBottom: 3,
              paddingRight: 2,
              alignSelf: 'flex-end',
            }}
            mode="contained"
            disabled={services && services.length >= 1 ? true : false}
            icon="plus-circle-outline"
            onPress={() => navigatio.navigate('AddNewService')}>
            {t('addService')}
          </Button>
          {loading ? (
            <Loader />
          ) : (
            <>
              {services == null ? (
                <Text>{t('noDelivery')}</Text>
              ) : (
                <FlatList
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                  showVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    marginTop: 20,
                  }}
                  numColumns={2}
                  data={services.data}
                  // scrollEnabled={true}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index}
                  refreshControl={
                    <RefreshControl
                      refreshing={loading}
                      onRefresh={fetchData}
                    />
                  }
                />
              )}
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
