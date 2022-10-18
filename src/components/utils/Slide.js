import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('window');
const COLORS = {primary: '#1C9A4E', white: '#F7F9F6', btnColor: '#FFC10D'};

const Slide = ({title, subtitle, image}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <Image
        source={image}
        style={{height: '75%', width, resizeMode: 'contain'}}
      />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

export default Slide;

const styles = StyleSheet.create({
  subtitle: {
    color: COLORS.primary,
    fontSize: 13,
    marginTop: 10,
    // maxWidth: "70%",
    lineHeight: 23,
  },
  title: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
