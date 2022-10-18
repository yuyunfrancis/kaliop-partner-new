import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

import {COLORS} from '../../constants';
const DeleteBtn = ({text, onPress, btnStyle}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.deleteBtn, btnStyle]}>
        <Text style={styles.deleteBtnText}>Delete</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DeleteBtn;

const styles = StyleSheet.create({
  deleteBtn: {
    // width: 78,
    backgroundColor: 'transparent',
    paddingTop: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.red,

    // marginRight: 20,
  },
  deleteBtnText: {
    fontSize: 15,
    color: COLORS.red,
  },
});
