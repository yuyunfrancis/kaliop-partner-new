import React from 'react';
import {Image, Text, View} from 'react-native';
import {icons} from '../constants';

export default function AppLogo(props) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image
        source={icons.logo}
        style={{
          height: 30,
          width: 30,
        }}
      />
      <Text
        style={{fontSize: 20, fontWeight: '600', color: '#fff', marginLeft: 4}}>
        Kalio
      </Text>
    </View>
  );
}
