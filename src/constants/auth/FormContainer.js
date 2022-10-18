import {
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";

const FormContainer = ({ children }) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/logo.png")}
        />
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#1C9A4E",
  },
  logo: {
    width: 168,
    height: 55,
    marginBottom: 30,
    marginTop: height * 0.12,
    alignSelf: "center",
  },
});
export default FormContainer;
