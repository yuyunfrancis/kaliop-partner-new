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

const SecondaryButton = ({text, onPress, ...props}) => {
  return (
    <PaperButton
      uppercase={false}
      style={styles.button}
      color={COLORS.primary}
      onPress={onPress}
      {...props}>
      {props.children ?? text}
    </PaperButton>
  );
};

export default SecondaryButton;
const styles = StyleSheet.create({
  button: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
  },
});
