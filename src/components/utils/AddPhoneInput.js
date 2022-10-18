import { View, StyleSheet, Dimensions } from "react-native";
import PhoneInput from "react-native-phone-number-input";

const AddPhoneInput = ({ phoneNumber, phoneInput, onChange, customStyle }) => {
  return (
    <PhoneInput
      ref={phoneInput}
      defaultValue={phoneNumber}
      defaultCode="CM"
      layout="first"
      placeholder="enter phone number"
      containerStyle={[styles.phoneContainer]}
      textContainerStyle={styles.textInput}
      onChangeFormattedText={onChange}
    />
  );
};

export default AddPhoneInput;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  phoneContainer: {
    width: width - 65,
    height: 53,
    borderRadius: 12,
    borderColor: "#ABCFB9",
    borderWidth: 1,
  },
  textInput: {
    paddingVertical: 0,
    width: width - 65,
    height: 50,
    backgroundColor: "#FFFFFF",
    fontSize: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
});
