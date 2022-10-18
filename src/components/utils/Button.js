import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import {Button as PaperButton} from 'react-native-paper';

import {COLORS} from '../../constants';

const Button = ({text, onPress, ...props}) => {
  return (
    <PaperButton
      uppercase={false}
      style={styles.button}
      color={'#fff'}
      onPress={onPress}
      {...props}>
      {text || props.children}
    </PaperButton>
  );
};

export default Button;
const styles = StyleSheet.create({
  button: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
  },
});
