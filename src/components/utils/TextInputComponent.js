import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import React from 'react';

const TextInputComponent = ({
  text,
  onChange,
  onPress,
  label,
  mode,
  outlineColor,
  placeholder,
  activeOutlineColor,
}) => {
  return (
    <TextInput
      style={{
        width: width - 65,
        backgroundColor: '#fff',
      }}
      label={label}
      mode={mode}
      outlineColor={outlineColor}
      placeholder={placeholder}
      activeOutlineColor={activeOutlineColor}
      value={text}
      onChangeText={onChange}
      right={
        <TextInput.Icon
          name="calendar"
          color={COLORS.primary}
          onPress={onPress}
          style={{justifyContent: 'center'}}
        />
      }
    />
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({});
