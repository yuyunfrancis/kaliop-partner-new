import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import React from 'react';

import {COLORS} from '../constants';

const CustomHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="chevron-back"
            color={COLORS.lightWhite}
            size={35}
            // style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: COLORS.lightWhite,
            fontSize: 18,
            marginLeft: 40,
          }}>
          Land Size Measurement
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Land Size')}>
          <Entypo
            name="back-in-time"
            size={25}
            color={COLORS.lightWhite}
            style={{marginLeft: 60}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 78,
    width: '100%',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'space-evenly',
  },
});
