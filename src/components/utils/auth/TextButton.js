import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";

const TextButton = ({ accountQuestion, loginText, onPress }) => {
  return (
    <View style={styles.toLogin}>
      <Text style={styles.noAccount}>{accountQuestion}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.loginText}>{loginText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  toLogin: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 20,
    alignItems: "center",
  },
  noAccount: {
    fontSize: 18,
    color: "#fff",
    marginRight: 5,
  },
  loginText: {
    fontSize: 19,
    color: "#FFC10D",
  },
});

export default TextButton;
