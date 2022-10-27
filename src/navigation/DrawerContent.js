import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import React, {useContext, useState} from 'react';
import {Drawer} from 'react-native-paper';
import {COLORS, SIZES, FONTS, icons} from '../constants';
import UserContext from '../contexts/UserContext';
import {useTranslation} from 'react-i18next';

const CustomDrawerItem = ({label, icon, isFocused, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: SIZES.radius,
        borderRadius: SIZES.radius,
        marginBottom: SIZES.base,
        height: 40,
      }}
      onPress={onPress}>
      <Image
        source={icon}
        style={{
          width: 20,
          height: 20,
          tintColor: COLORS.lightWhite,
        }}
      />
      <Text style={{color: COLORS.lightWhite, marginLeft: 15}}>{label}</Text>
    </TouchableOpacity>
  );
};

const DrawerContent = props => {
  const {t} = useTranslation();
  const {user, logoutUser} = useContext(UserContext);
  const [state, setUser] = useState(null);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.primary}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={{flex: 1, paddingHorizontal: SIZES.radius}}>
            <View
              style={{
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingTop: 20,
              }}>
              <TouchableOpacity
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() => props.navigation.closeDrawer()}>
                <Image
                  source={icons.cross}
                  style={{
                    height: 35,
                    width: 35,
                    tintColor: COLORS.lightWhite,
                    alignSelf: 'flex-end',
                  }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: -50,
                alignItems: 'center',
                alignSelf: 'flex-start',
                marginLeft: 20,
              }}
              onPress={() => console.log('Profile')}>
              <Image
                source={icons.logo}
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: SIZES.radius,
                }}
              />
              <View style={{marginLeft: SIZES.radius}}>
                <Text
                  style={{
                    color: COLORS.lightWhite,
                    fontSize: 25,
                    fontWeight: 'bold',
                  }}>
                  Kalio
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                height: 1.5,
                width: '50%',
                backgroundColor: COLORS.lightWhite,
                alignSelf: 'flex-start',
                marginLeft: 20,
              }}
            />
            <Drawer.Section style={{flex: 1, marginTop: 30}}>
              <CustomDrawerItem
                label={t('home')}
                icon={icons.home}
                onPress={() => props.navigation.navigate('Home')}
              />
              {/* <CustomDrawerItem
                label={t('profile')}
                icon={icons.profile_pic}
                onPress={() => props.navigation.navigate('Profile')}
              /> */}
              <CustomDrawerItem
                label={t('appoinments')}
                icon={icons.access}
                onPress={() => props.navigation.navigate('My Appointments')}
              />
              <CustomDrawerItem
                label={t('myService')}
                icon={icons.access}
                onPress={() => props.navigation.navigate('Services')}
              />
              <CustomDrawerItem
                label={t('logout')}
                icon={icons.logout}
                onPress={() => {
                  logoutUser();
                }}
              />
            </Drawer.Section>
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
});
