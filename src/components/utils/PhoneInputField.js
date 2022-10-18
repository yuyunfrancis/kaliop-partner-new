import {View, StyleSheet, Dimensions} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

const PhoneInputField = ({phoneNumber, phoneInput, onChange}) => {
  return (
    <View style={styles.container}>
      <PhoneInput
        ref={phoneInput}
        defaultValue={phoneNumber}
        defaultCode="CM"
        layout="first"
        placeholder="Phone number"
        withShadow
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.textInput}
        onChangeFormattedText={onChange}
      />
    </View>
  );
};

export default PhoneInputField;

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  phoneContainer: {
    width: width - 65,
    height: 50,
    marginBottom: 45,
    borderRadius: 12,
  },
  textInput: {
    paddingVertical: 0,
    width: width - 65,
    height: 50,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
  },
});
