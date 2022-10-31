import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {io} from 'socket.io-client';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountDown from 'react-native-countdown-component';

import {COLORS, icons} from '../../constants';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';

// const socket = io(`${config.app.chat_api_url}`);

const ChatScreen = props => {
  const {appointment} = props.route.params;
  const {user} = useContext(UserContext);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const socket = useRef(io(`${config.app.chat_api_url}`)).current;
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [call, setCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [sessionCall, setSessionCall] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  let t1 = new Date(appointment?.range?.end);
  let t2 = new Date(appointment?.range?.start);
  let dif = (t1.getTime() - t2.getTime()) / 1000;
  const [seconds, setSeconds] = useState(dif);
  let scrollView = useRef();

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

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
    const newMessages = [];
    socket.on('connect', () => {
      console.log('Connected');
      setIsConnected(true);
      socket.emit('joinRoom', {username: user.phone, room: appointment._id});
    });

    socket.on('disconnect', () => {
      console.log('Disonnected');
      setIsConnected(false);
      navigation.goBack();
    });

    socket.on('roomUsers', ({room, users}) => {
      // outputRoomName(room);
      // outputUsers(users);
      setToast(true);
      setToastMessage('User has joined');
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

  // const handleCall = () => {

  //     const mediaParams = {
  //         audio: true,
  //         video: true
  //     };

  //     sessionCall
  //         .getUserMedia(mediaParams)
  //         .then((localStream) => {
  //             setLocalStream(localStream);
  //         })
  //         .catch((error) => { });

  //     const extension = {};
  //     sessionCall.call(extension, (error) => { });
  // }

  const handleSubmitMessage = message => {
    setTyping(false);
    return socket.emit('chatMessage', message);
  };

  return (
    <View style={{flex: 1}}>
      {/* <ChatHeader
                typing={typing}
                username={data.username}
                profile={data.profile}
                onlineStatus={data.onlineStatus}
            /> */}
      {!call ? (
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
                <Text style={styles.username}>{data.username}</Text>
                {typing && <Text style={styles.onlineStatus}>Typing...</Text>}
              </View>
            </TouchableOpacity>
            <View style={styles.options}>
              {/* <TouchableOpacity style={{ paddingHorizontal: 5 }}
                                    onPress={() => navigation.navigate("CallScreen", { appointment })}>
                                    <Icon name="video-camera" size={20} color={COLORS.white} />
                                </TouchableOpacity> */}
              {/*  <TouchableOpacity style={{ paddingHorizontal: 20 }}>*/}
              {/*    <Icon name="ellipsis-v" size={20} color={COLORS.white} />*/}
              {/*  </TouchableOpacity>*/}
            </View>
          </View>
        </View>
      ) : (
        <View></View>
      )}
      <CountDown
        until={seconds}
        //duration of countdown in seconds
        timetoShow={['H', 'M', 'S']}
        timeLabels={{h: '', m: '', s: ''}}
        //formate to show
        onFinish={() => handleEnd()}
        //on Finish call
        onPress={() => console.log('hello')}
        //on Press call
        size={10}
        style={{paddingHorizontal: 8, margin: 15}}
      />
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
