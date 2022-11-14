import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  PermissionsAndroid,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';
import Icon from 'react-native-vector-icons/FontAwesome';

import UserContext from '../../contexts/UserContext';
import { config } from '../../constants/config';
import { COLORS, icons } from '../../constants';
import MessageList from './MessageList';
import ChatInput from './ChatInput';


const ChatScreen = props => {
  const { appointment } = props.route.params;
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const socket = useRef(io(`${config.app.chat_api_url}`)).current;
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [call, setCall] = useState(false);
  let t1 = new Date(appointment?.range?.end);
  let t2 = new Date();
  let dif = (t1.getTime() - t2.getTime()) / 1000;
  const [seconds, setSeconds] = useState(dif);
  let scrollView = useRef();

  const data = {
    username:
      user._id === appointment?.user._id
        ? appointment?.laboratory?.name || appointment?.expert?.name
        : appointment?.user?.name,
    phone:
      user._id === appointment?.user._id
        ? appointment?.laboratory?.phone || appointment?.expert?.phone
        : user.phone,
    profile: icons.profile1,
    bio: 'I am a software engineer',
    isBlocked: false,
    isMuted: false,
    onlineStatus: 'online',
  };

  const handleEnd = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if(seconds > 0){
      setTimeout(() => setSeconds(seconds - 1), 1000);
    }else{
      navigation.goBack();
    }
  }, [seconds]);

  useEffect(() => {
    const newMessages = [];
    socket.on('connect', () => {
      console.log('Connected');
      setIsConnected(true);
      socket.emit('joinRoom', { username: user.phone, room: appointment._id });
    });

    socket.on('disconnect', () => {
      console.log('Disonnected');
      setIsConnected(false);
      navigation.goBack();
    });

    socket.on('roomUsers', ({ room, users }) => {
      // outputRoomName(room);
      // outputUsers(users);
    });

    socket.on('message', async message => {
      setLoading(false);

      setTyping(false);
      newMessages.push(message);
      setMessages([...newMessages]);
      // scrollView.scrollTo(0);
    });

    return () => {
      console.log('Component unmounted.');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [user]);

  const handleSubmitMessage = message => {
    setTyping(false);
    return socket.emit('chatMessage', message);
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Kalio Partner CAMERA Permission",
          message: "Kalio Partner App needs access to your camera",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        navigation.navigate("CallScreen", { appointment });
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleCall = ()=>{
      requestLocationPermission();
  }

  return (
    <View style={{ flex: 1 }}>
      {!call ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.bckBtn}
            onPress={() => navigation.goBack()}>
            <Icon name="angle-left" size={30} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.profileOptions}>
            <TouchableOpacity style={styles.profile}>
              <View style={styles.usernameAndOnlineStatus}>
                <Text style={styles.username}>{data.username}</Text>
                {typing && <Text style={styles.onlineStatus}>Typing...</Text>}
              </View>
            </TouchableOpacity>
            <View style={styles.options}>
              <TouchableOpacity style={{ paddingHorizontal: 5 }}
                onPress={() => handleCall()}>
                <Icon name="video-camera" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View></View>
      )}
      {!call ? (
        <MessageList
          scrollView={scrollView}
          authUserId={user}
          messages={messages}
        />
      ) : (
        <View></View>
      )}
      {!call ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ChatInput handleSubmitMessage={handleSubmitMessage} />
        </KeyboardAvoidingView>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default ChatScreen;

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
