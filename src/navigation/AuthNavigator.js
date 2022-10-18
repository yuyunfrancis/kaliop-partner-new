import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login, Onboarding, Verification} from '../screens';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'Onboarding'}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
