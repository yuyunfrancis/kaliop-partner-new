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
import Icon from 'react-native-vector-icons/FontAwesome';

import {COLORS, icons} from '../../constants';

import ChatInput from './ChatInput';
import MessageList from './MessageList';
import {config} from '../../constants/config';
import UserContext from '../../contexts/UserContext';

const MessageScreen = props => {
  const {appointment} = props.route.params;
  const navigation = useNavigation();
  const {user} = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const socket = useRef(new WebSocket(`${config.app.chat_api_url}`)).current;
  const [loading, setLoading] = useState(true);
  const [call, setCall] = useState(false);
  const [typing, setTyping] = useState(false);

  let rtcProps = {
    appId: 'd99539e459d744f8aa83aa1c8357bf4c',
    channel: 'test',
  };

  const data = {
    username:
      user._id === appointment.user._id
        ? appointment?.laboratory?.name || appointment.expert.name
        : appointment.user.name,
    phone:
      user._id === appointment.user._id
        ? appointment.laboratory.phone || appointment.expert.phone
        : user.phone,
    profile: icons.profile1,
    bio: 'I am a software engineer',
    isBlocked: false,
    isMuted: false,
    onlineStatus: 'online',
  };

  useEffect(() => {
    const newMessages = [];
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          user: appointment?.user?._id,
          expert: user._id,
          request: 'CREATE',
          me: user._id,
        }),
      );
      console.log('Socket connected');
    };

    socket.onclose = e => {
      socket.send(
        JSON.stringify({
          request: 'LOGOUT',
          me: user._id,
        }),
      );
    };

    socket.onerror = err => {
      console.log('Socket error', err.message);
    };

    socket.onmessage = async e => {
      const data = JSON.parse(e.data);
      console.log('e.data.message', data.message);

      if (data.typing === true) {
        return setTyping(true);
      }

      setTyping(false);
      await newMessages.push(data);
      await setMessages([...newMessages]);
      setLoading(false);
    };

    return () => {
      console.log('Component unmounted.');

      socket.send(
        JSON.stringify({
          request: 'LOGOUT',
          me: user._id,
        }),
      );
    };
  }, []);

  const receiver = () => {
    if (user._id === appointment.user._id) {
      return appointment?.laboratory.user._id || appointment?.expert.user._id;
    } else {
      return appointment.user._id;
    }
  };

  const handleCall = () => {
    setCall(true);
  };

  const handleSubmitMessage = message => {
    setMessages([
      ...messages,
      {
        message: message,
        from: user._id,
        to: receiver(),
      },
    ]);
    setTyping(false);
    return socket.send(
      JSON.stringify({
        message: message,
        from: user._id,
        to: receiver(),
        request: 'SEND',
      }),
    );
  };

  const sendTypingStatus = () => {
    socket.send(
      JSON.stringify({
        from: user._id,
        to: receiver(),
        request: 'TYPING',
      }),
    );
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
              <TouchableOpacity
                style={{paddingHorizontal: 5}}
                onPress={() =>
                  navigation.navigate('CallScreen', {appointment})
                }>
                <Icon name="video-camera" size={20} color={COLORS.white} />
              </TouchableOpacity>
              {/*  <TouchableOpacity style={{ paddingHorizontal: 20 }}>*/}
              {/*    <Icon name="ellipsis-v" size={20} color={COLORS.white} />*/}
              {/*  </TouchableOpacity>*/}
            </View>
          </View>
        </View>
      ) : (
        <View></View>
      )}
      {!call ? (
        <MessageList authUserId={user._id} messages={messages} />
      ) : (
        <View></View>
      )}
      {!call ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <ChatInput
            sendTypingStatus={sendTypingStatus}
            handleSubmitMessage={handleSubmitMessage}
          />
        </KeyboardAvoidingView>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default MessageScreen;

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
