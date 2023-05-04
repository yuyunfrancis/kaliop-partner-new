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

const Destinations = props => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [loadstatus, setLoadstatus] = useState(false);

  const [loading, error, costs, fetchCosts] = useDataFetching(
    `${config.app.api_url}/cost/by-user/${user._id}`,
  );

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchCosts();
    });
    return updateData;
  }, [navigation]);

  const handleDialogStatus = (item) => {
    return Alert.alert(
      'Are you sure?',
      `Are you sure you want to deleted this destination?`,
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
      url: `${config.app.api_url}/cost/${item._id}`,
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
              onPress: () => navigation.navigate('Destinations'),
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

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.contain, { marginTop: 20 }]}>
        <Text style={[styles.title, { marginBottom: 15, fontWeight: '600' }]}>
          {item?.typeVehicle?.name}
        </Text>
        <TouchableOpacity
          onPress={() => handleDialogStatus(item)}
          style={{
            alignSelf: 'flex-end',
            position: 'absolute',
            right: 6,
            top:12
          }}>
          <Icons name="delete-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { fontWeight: '500' }]}>
            {item?.destination?.depart} - {item?.destination?.arrival}
          </Text>
          <View style={{ marginTop: 6 }}>
            <Text style={[styles.info, {color:COLORS.primary}]}>{item?.price} FCFA</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar title={t('destination')} />
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
              onPress={() => navigation.navigate('AddNewCost')}>
              {t('addCost')}
            </Button>
          </View>

          {loading ? (
            <Loader />
          ) : (
            <View style={styles.content}>
              <Text style={{ fontSize: 16, color: '#262525', fontWeight: '700' }}>
                {costs?.data?.length > 0 ? `${t('costList')}` : `${t('noCost')}`}
              </Text>
              <FlatList
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showVerticalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 20,
                  flexGrow: 1,
                }}
                numColumns={2}
                data={costs.data}
                scrollEnabled={true}
                renderItem={renderItem}
                keyExtractor={(item, index) => index}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchCosts}
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

export default Destinations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contain: {
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
