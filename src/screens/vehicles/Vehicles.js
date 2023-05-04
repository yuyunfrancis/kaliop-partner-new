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
import React, { useContext, useEffect } from 'react';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconLocation from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import StatusBar from '../../components/StatusBar';
import { COLORS } from '../../constants';
import useDataFetching from '../../hooks/useDataFetching';
import { config } from '../../constants/config';
import UserContext from '../../contexts/UserContext';

import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

const Vehicles = props => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [loadstatus, setLoadstatus] = useState(false);

  const [loading, error, vehicles, fetchVehicles] = useDataFetching(
    `${config.app.api_url}/vehicle/by-user/${user._id}`,
  );

  const handleDialogStatus = (item) => {
    return Alert.alert(
      'Are you sure?',
      `Are you sure you want to deleted this vehicle?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            handleChangeStatus(item);
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const handleChangeStatus = async (item) => {
    setLoadstatus(true);
    const configurationData = {
      method: 'DELETE',
      url: `${config.app.api_url}/vehicle/${item._id}`,
      headers: {
        Authorization: 'Bearer ' + user.token,
      },
    };
    await axios(configurationData)
      .then(response => {
        if (response.data.status === 'success') {
          setLoadstatus(false);
          Alert.alert('success', response.data.message, [
            {
              title: 'Ok',
              onPress: () => navigation.navigate('Vehicles'),
            },
          ]);
        }
      })
      .catch(error => {
        setLoadstatus(false);
        Alert.alert('error', error, [
          { title: 'Ok', onPress: () => navigation.goBack() },
        ]);
      });
  };

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchVehicles();
    });
    return updateData;
  }, [navigation]);

  const renderItem = ({ item }) => {
    console.log(item);
    return (
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={() => navigation.navigate('VehicleDetail', item)}>
        <View style={[styles.shopContainer, styles.shadowProp]}>

          {item.image == undefined ? (
            <View style={styles.iconContainer}>
              <IconLocation name="car" size={40} color={COLORS.primary} />
            </View>
          ) : (
            <View>
              <Image
                resizeMode="cover"
                source={{
                  uri: `${config.app.api_url}/vehicle/image/${item.image}`,
                }}
                style={{
                  width: 150,
                  height: 100,
                  borderRadius: 12,
                }}
              />
            </View>
          )}
          <TouchableOpacity
            onPress={() => handleDialogStatus(item)}
            style={{
              alignSelf: 'flex-end',
              position: 'absolute',
              right: 8,
            }}>
            <Icons name="delete-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.shopName} numberOfLines={1}>
            {item.marque}-{item.model}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={styles.location}>
              {t('capacity')} : {item.capacity} {item?.unity?.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar title={t('vehicle')} />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20, paddingBottom: 20, marginHorizontal: 15 }}>
          <View style={styles.addBtn}>
            <Button
              labelStyle={{ fontSize: 14 }}
              style={{ paddingTop: 3, paddingBottom: 3, paddingRight: 2 }}
              mode="contained"
              icon="plus-circle-outline"
              onPress={() => navigation.navigate('AddNewVehicle')}>
              {t('addVehicle')}
            </Button>
          </View>

          {loading || loadstatus ? (
            <Loader />
          ) : (
            <View style={styles.content}>
              <Text style={{ fontSize: 16, color: '#262525', fontWeight: '700' }}>
                {vehicles?.data?.length > 0 ? `${t('vehicleList')}` : `${t('noVehicle')}`}
              </Text>
              <FlatList
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showVerticalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 20,
                  flexGrow: 1,
                }}
                numColumns={2}
                data={vehicles.data}
                scrollEnabled={true}
                renderItem={renderItem}
                keyExtractor={(item, index) => index}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchVehicles}
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

export default Vehicles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addBtn: {
    alignItems: 'flex-end',
  }, image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
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
