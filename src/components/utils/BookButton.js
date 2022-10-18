import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS} from '../../constants';

const BookButton = ({onPress, text}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.btnContainer}>
        <Text style={styles.btnText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default BookButton;

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: COLORS.primary,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,

    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    color: COLORS.lightWhite,
  },
});
