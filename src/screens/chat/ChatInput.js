import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState} from 'react';
import { COLORS } from '../../constants';

const ChatInput = props => {
  const [message, setMessage] = useState('');
  const {handleSubmitMessage} = props;

  const sendMessage = () => {
    handleSubmitMessage(message);
    setMessage('');
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContent}>
        <View style={styles.inputMicrophone}>
          {/*<TouchableOpacity style={styles.emoticonBtn}>*/}
          {/*  <Icon name="emoticon-outline" size={24} color="#9f9f9f" />*/}
          {/*</TouchableOpacity>*/}
          <TextInput
            multiline
            placeholder="Message..."
            style={styles.input}
            value={message}
            onChangeText={text => {
              setMessage(text);
            }}
          />
          {/*<TouchableOpacity style={styles.rightIconBtn}>*/}
          {/*  <Icon name="paperclip" size={24} color="#9f9f9f" />*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity style={styles.rightIconBtn}>*/}
          {/*  <Icon name="camera" size={24} color="#9f9f9f" />*/}
          {/*</TouchableOpacity>*/}
        </View>
        {message !== '' &&
          message !== ' ' &&
          message.replace(/\s/g, ' ') !== ' ' && (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => sendMessage()}>
              <Icon name={'send'} size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },

  innerContent: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputMicrophone: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    flex: 3,
    marginRight: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    fontSize: 16,
    color: '#000',
    flex: 3,
    maxHeight: 200,
    alignSelf: 'center',
  },
  rightIconBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 10,
    // borderLeftWidth: 1,
    // borderLeftColor: "#fff",
  },
  emoticonBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
