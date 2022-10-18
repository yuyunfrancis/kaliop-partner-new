import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

import {COLORS} from '../../constants';

const EditBtn = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.editBtn}>
        <Text style={styles.editBtnText}>Edit</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EditBtn;

const styles = StyleSheet.create({
  editBtn: {
    backgroundColor: COLORS.userCardColor,
    paddingTop: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 8,
    borderRadius: 12,
    // marginRight: 20,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  editBtnText: {
    fontSize: 15,
    color: COLORS.primary,
  },
});
