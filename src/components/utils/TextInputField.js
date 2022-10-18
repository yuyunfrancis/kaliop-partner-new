import {TextInput, Dimensions, StyleSheet} from 'react-native';
import React from 'react';

const TextInputFields = ({value, placeholder, keyboardType, ...rest}) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      placeholder={placeholder}
      placeholderTextColor="#CBCACA"
      keyboardType={keyboardType}
      {...rest}
    />
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  input: {
    width: width - 65,
    height: 50,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});
export default TextInputFields;
