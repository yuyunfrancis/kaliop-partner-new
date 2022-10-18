import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

const OnboardingButton = ({btnText, onPress}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnContainer} onPress={onPress}>
        <Text style={styles.btnText}>{btnText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  btnContainer: {
    backgroundColor: '#FFC10D',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    borderRadius: 30,
  },
  btnText: {
    fontSize: 18,
    color: '#1C9A4E',
    marginRight: 2,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
});
