import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const AuthButton = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.btnContainer} onPress={onPress}>
        <Text style={styles.btnTitle}>{title}</Text>
        <View style={styles.iconContainer}>
          <Ionicons name="chevron-forward-outline" size={35} color="#fff" />
        </View>
      </Pressable>
    </View>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#094735",
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    borderRadius: 30,
  },
  btnTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 2,
    alignSelf: "center",
  },
  iconContainer: {
    borderRadius:
      Math.round(
        Dimensions.get("window").width + Dimensions.get("window").height
      ) / 2,
    height: 43,
    width: 43,
    backgroundColor: "#1C9A4E",
    alignItems: "center",
    justifyContent: "center",
    left: 12,
  },
  icon: {
    alignSelf: "center",
  },
});

export default AuthButton;
