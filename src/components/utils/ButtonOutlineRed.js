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

const ButtonOutlineRed = ({text, onPress, ...props}) => {
  return (
    <PaperButton
      uppercase={false}
      style={styles.button}
      color={COLORS.red}
      onPress={onPress}
      {...props}>
      {text || props.children}
    </PaperButton>
  );
};

export default ButtonOutlineRed;
const styles = StyleSheet.create({
  button: {
    borderColor: COLORS.red,
    borderWidth: 1,
  },
});
