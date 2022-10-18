import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const UserAvatar = ({size, image, style, cardStyle}) => {
  return (
    <Avatar.Image style={cardStyle} source={image} size={size} styles={style} />
  );
};

export default UserAvatar;

const styles = StyleSheet.create({});
