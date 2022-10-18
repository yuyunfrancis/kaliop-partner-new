import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

import {COLORS} from '../../constants';

const ButtonRounded = ({onPress, text, btnStyle}) => {
  return (
    <TouchableOpacity>
      <View style={[styles.btnContainer, btnStyle]}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
            color: COLORS.lightWhite,
          }}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonRounded;

const styles = StyleSheet.create({
  btnContainer: {
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 30,
    // width: 140,
    backgroundColor: COLORS.primary,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    marginBottom: 4,
  },
});
