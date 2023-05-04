import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import StatusBar from '../../components/StatusBar';
import {COLORS} from '../../constants';
import UserContext from '../../contexts/UserContext';
import useDataFetching from '../../hooks/useDataFetching';
import {config} from '../../constants/config';

const Profile = () => {
  const {user, logoutUser} = useContext(UserContext);

  const navigation = useNavigation();

  console.log('user', user);
  const [loading, error, userType, fetchData] = useDataFetching(
    `${config.app.api_url}/gallery`,
  );
  
  const [loaduser, erroruser, info, fetchUser] = useDataFetching(
    `${config.app.api_url}/findUser/${user._id}`,
  );

  useEffect(() => {
    const updateData = navigation.addListener('focus', () => {
      fetchData();
      fetchUser();
    });
    return updateData;
  }, [navigation]);

  const handleLogout = () => {
    logoutUser();
  };

  const data = [
    {
      id: 4,
      icon: (
        <FontAwesome5 name="user" size={24} color={COLORS.backgroundDark} />
      ),
      title: 'Pseudo (Public name)',
      text: info?.pseudo || '',
    },
    {
      id: 1,
      icon: (
        <Icon name="email-outline" size={24} color={COLORS.backgroundDark} />
      ),
      title: 'Email',
      text: info?.email || '',
    },
    {
      id: 2,
      icon: (
        <Ionicons
          name="ios-phone-portrait-outline"
          size={24}
          color={COLORS.backgroundDark}
        />
      ),
      title: 'Phone Number',
      text: info?.phone || '',
    },
    {
      id: 3,
      icon: (
        <Ionicons
          name="ios-location-outline"
          size={24}
          color={COLORS.backgroundDark}
        />
      ),
      title: 'Add Location',
      text: 'ex. Douala, Cameroon',
    },
  ];

  const renderItem = ({item}) => {
    return (
      <>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginRight: 10}}>{item.icon}</View>

          <View style={{paddingBottom: 5}}>
            <Text style={{color: '#BABBC5', fontSize: 12}}>{item.title}</Text>
            <Text style={{color: '#040404', fontSize: 14}}>{item.text}</Text>
          </View>
        </View>
        <View
          style={{
            marginLeft: 20,
            marginRight: 20,
            width: '100%',
            height: 1,
            backgroundColor: COLORS.grey,
            opacity: 0.2,
            marginBottom: 10,
            marginTop: 10,
          }}
        />
      </>
    );
  };

  return (
    <>
      <StatusBar
        title={'Profile'}
        showProfile
        user={info}
        // showProfileDetails
      />
      {/* <Button
          labelStyle={{ fontSize: 16 }}
          mode="contained"
          uppercase={false}
          onPress={() => handleLogout()}
          style={{
            paddingTop: 3,
            paddingBottom: 3,
            paddingRight: 2,
          alignSelf: "flex-end",
          }}
      >
        Logout
      </Button> */}
      <ScrollView style={{flex: 1}}>
        <View style={{marginVertical: 20, marginHorizontal: 15}}>
          <Button
            labelStyle={{fontSize: 16}}
            icon="square-edit-outline"
            mode="contained"
            uppercase={false}
            onPress={() => navigation.navigate('EditProfile', {info})}
            style={{
              paddingTop: 3,
              paddingBottom: 3,
              paddingRight: 2,
              alignSelf: 'flex-end',
            }}>
            Edit
          </Button>
          <FlatList
            showVerticalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 20,
            }}
            data={data}
            scrollEnabled={true}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Profile;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  cardImage: {
    backgroundColor: '#E6EDE4',
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: (width * 0.25) / 2,
    width: width * 0.25,
    height: width * 0.25,
  },
  image: {
    width: 69,
    height: 69,
  },
  cardInfo: {
    marginLeft: 40,
    marginBottom: 20,
  },
  listSettings: {
    marginTop: 40,
    marginBottom: 20,
    backgroundColor: 'transparent',
    width: '100%',
    marginLeft: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
