import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useRef} from 'react';
import Message from './Message';

const MessageList = props => {
  const {messages, authUserId, scrollView} = props;

  const user = useRef(authUserId).current;

  return (
    <ScrollView ref={scrollView}>
      {messages.map((message, index) => (
        <Message
          key={index}
          time={message.time}
          isLeft={message.username !== user.phone}
          message={message.text}
        />
      ))}
    </ScrollView>
  );
};

export default MessageList;

const styles = StyleSheet.create({});
