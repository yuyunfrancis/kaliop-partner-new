import {TextInput, Dimensions, StyleSheet} from 'react-native';
import React from 'react';

const AddTextField = ({
  value,
  placeholder,
  keyboardType,
  editable,
  ...rest
}) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      placeholder={placeholder}
      // placeholderTextColor="#C1C1C1"
      keyboardType={keyboardType}
      editable={editable}
      {...rest}
    />
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    borderColor: '#C1C1C1',
    borderWidth: 1,
  },
});
export default AddTextField;
