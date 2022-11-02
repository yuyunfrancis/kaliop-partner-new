import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {COLORS} from '../../constants';

const ChatHeader = ({
  username,
  typing,
  profile,
  bio,
  isBlocked,
  isMuted,
  onlineStatus,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bckBtn}
        onPress={() => navigation.goBack()}>
        <Icon name="angle-left" size={30} color={COLORS.white} />
      </TouchableOpacity>
      <View style={styles.profileOptions}>
        <TouchableOpacity style={styles.profile}>
          {/*<Image source={`${config.app.api_url}/laboratories/images/${profile}`} style={styles.image} />*/}
          <View style={styles.usernameAndOnlineStatus}>
            <Text style={styles.username}>{username}</Text>
            {typing && <Text style={styles.onlineStatus}>Typing...</Text>}
          </View>
        </TouchableOpacity>
        {/*<View style={styles.options}>*/}
        {/*  <TouchableOpacity style={{ paddingHorizontal: 5 }}>*/}
        {/*    <Icon name="phone" size={20} color={COLORS.white} />*/}
        {/*  </TouchableOpacity>*/}
        {/*  <TouchableOpacity style={{ paddingHorizontal: 20 }}>*/}
        {/*    <Icon name="ellipsis-v" size={20} color={COLORS.white} />*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}
      </View>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
  },
  bckBtn: {
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  profileOptions: {
    flex: 1,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    flex: 4,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 32.5,
  },
  usernameAndOnlineStatus: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  onlineStatus: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 5,
  },
  options: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
