import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Title = ({ mainText, numText, subText }) => {
  return (
    <View style={styles.text}>
      <View style={styles.mainText}>
        <Text style={styles.nameText}>{mainText}</Text>
        <Text style={styles.numText}>{numText}</Text>
      </View>
      <Text style={styles.subText}>{subText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 25,
  },

  mainText: {
    alignItems: "center",
    marginBottom: 10,
  },
  nameText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: 'bold',
  },
  numText: {
    color: "#FFFFFF",
    fontSize: 26,
  },
  subText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 18,
    marginHorizontal: 40,
    textAlign: "center",
  },
});
export default Title;
