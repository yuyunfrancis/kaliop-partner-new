import React from 'react';
import {View} from 'react-native';
import Loader from './Loader';
import {COLORS} from '../constants';

export default function LoadingView(props) {
  const color = props.color !== undefined ? props.color : COLORS.primary;

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Loader color={color} />
    </View>
  );
}
