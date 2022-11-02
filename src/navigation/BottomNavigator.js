import 'react-native-gesture-handler';
import React, {useContext, useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/Ionicons';
import Bulb from 'react-native-vector-icons/MaterialCommunityIcons';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import BottomSheetScreen from './BottomSheetScreen';
import {useNavigation} from '@react-navigation/native';
import UserContext from '../contexts/UserContext';
import {COLORS} from '../constants';
import {Home, MyPlanning, Profile, Wallet} from '../screens';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {user} = useContext(UserContext);
  const [seedVendor, setSeedVendor] = useState(false);
  const [agroExpert, setAgroExpert] = useState(false);
  const [laboratory, setLaboratory] = useState(false);

  useEffect(() => {
    const userProfile = user?.profil?.map(users => {
      if (users.name === 'AgroExpert' || users.name === 'Laboratory') {
        setAgroExpert(true);
        setLaboratory(true);
      } else if (users.name === 'SeedVendor') {
        setSeedVendor(true);
      }
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        style: {
          height: 55,
          borderTopWidth: 0,
          elevation: 0,
        },
        showLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        headerShown: false,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({color}) => (
            <Icon name="home-filled" color={color} size={24} />
          ),
        }}
      />
      {agroExpert || laboratory ? (
        <Tab.Screen
          name="Booking Plan"
          component={MyPlanning}
          options={{
            tabBarLabel: t('booking'),
            tabBarIcon: ({color}) => (
              <Icons name="md-calendar" color={color} size={22} />
            ),
          }}
        />
      ) : (
        <></>
      )}
      <Tab.Screen
        name="Search"
        component={AddScreenComponent}
        options={{
          tabBarButton: () => <BottomSheetScreen />,
          tabBarIcon: ({color}) => (
            <View
              style={{
                height: 60,
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.white,
                borderColor: COLORS.primary,
                borderWidth: 2,
                borderRadius: 30,
                top: -25,
                elevation: 5,
              }}>
              <Icon name="search" color={COLORS.primary} size={28} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarLabel: t('mywallet'),
          tabBarIcon: ({color}) => (
            <Icons name="ios-wallet" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="BusinessProfile"
        component={Profile}
        options={{
          tabBarLabel: t('profile'),
          tabBarIcon: ({color}) => (
            <Bulb name="account" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const AddScreenComponent = () => {
  return null;
};
