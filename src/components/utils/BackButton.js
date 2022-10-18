import {
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
  View,
} from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const BackButton = ({ onPress }) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <Pressable style={styles.btnContainer} onPress={onPress}>
        <View style={styles.btnContainer}>
          <Ionicons name="chevron-back-outline" size={35} color="#fff" />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  btnContainer: {
    marginLeft: width * 0.03,
    marginTop: height * 0.03,
  },
  backBtn: {},
});
export default BackButton;
