import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
// import COLORS from "../../conts/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Input = ({
  value,
  placeholder,
  keyboardType,
  iconName,
  onPress,
  ...rest
}) => {
  //   const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={{marginBottom: 20}}>
      {/* <Text style={styles.label}>{}</Text> */}
      <View style={[styles.inputContainer]}>
        <TextInput
          style={{color: 'green', flex: 1}}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#CBCACA"
          keyboardType={keyboardType}
          {...rest}
        />
        <TouchableOpacity onPress={onPress}>
          <Icon
            name={iconName}
            style={{color: 'green', fontSize: 22, marginRight: 10}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: 'grey',
  },
  inputContainer: {
    width: width - 65,
    height: 50,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    paddingLeft: 20,
    // paddingRight: ,
    borderRadius: 12,
    // marginBottom: 30,
    borderColor: '#ABCFB9',
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Input;
