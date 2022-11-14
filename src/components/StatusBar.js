import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar as NativeStatusBar,
} from 'react-native';
import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {COLORS} from '../constants';
import {Avatar} from 'react-native-paper';
import {config} from '../constants/config';
import UserContext from '../contexts/UserContext';

const StatusBar = props => {
  const {user} = useContext(UserContext);
  const navigation = useNavigation();
  console.log('user', user);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.statusBar}
        onPress={() => navigation.goBack()}>
        <Ionicons
          name="ios-chevron-back-outline"
          size={28}
          color={COLORS.lightWhite}
          // style={{ marginLeft: 0 }}
        />

        <Text
          style={{
            flexDirection: 'row',

            fontSize: 18,
            color: '#fff',
            alignSelf: 'center',
            // marginLeft: width * 0.23,
          }}>
          {props.title}
        </Text>
        {props.showSettings && (
          <Icon
            name="settings"
            size={24}
            color={COLORS.white}
            // style={{ marginLeft: width * 0.28 }}
          />
        )}
      </TouchableOpacity>
      {props.showProfile && (
        <View
          style={{alignItems: 'center', marginTop: 20, alignSelf: 'center'}}>
          <Avatar.Image
            size={100}
            source={{uri: `${config.app.api_url}/avatar/${user.avatar}`}}
            style={{}}
          />
          <Text style={{color: COLORS.white, fontSize: 17, marginTop: 10}}>
            {user.name}
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 14,
              opacity: 0.7,
              marginTop: 5,
            }}>
            {user?.profile ? user.profile[0].name : ''}
          </Text>
        </View>
      )}

      {props.showProfileDetails && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: COLORS.white,
                opacity: 0.8,
                fontSize: 18,
                marginRight: 5,
                fontWeight: 'bold',
              }}>
              10
            </Text>
            <Text style={{color: COLORS.white, opacity: 0.7, fontSize: 16}}>
              Farms
            </Text>
          </View>
          <View>
            <View
              style={{
                marginLeft: 20,
                marginRight: 20,
                height: 40,
                width: 1.5,
                backgroundColor: COLORS.white,
                opacity: 0.5,
              }}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: COLORS.white,
                opacity: 0.8,
                fontSize: 18,
                marginRight: 5,
                fontWeight: 'bold',
              }}>
              10
            </Text>
            <Text style={{color: COLORS.white, opacity: 0.7, fontSize: 16}}>
              Farms
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const {width} = Dimensions.get('window');
export default StatusBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 20,
    backgroundColor: COLORS.primary,
    shadowRadius: 6,
    elevation: 8,
    paddingTop: 15,
  },
  statusBar: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: "space-between",
    marginHorizontal: 10,
    // marginTop: 10,
  },
});
