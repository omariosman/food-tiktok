import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  LoginScreen,
  SignupScreen,
  ResetPasswordScreen,
} from '../screens';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ResetPassword: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};