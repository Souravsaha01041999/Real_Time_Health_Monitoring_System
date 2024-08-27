import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import HomeScree from './HomeScree';
import GraphScreen from './GraphScreen';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <NavigationContainer initialRouteName="Login">
        <Stack.Navigator>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Home' options={{
            headerBackVisible: false
          }} component={HomeScree} />
          <Stack.Screen name='Graph' component={GraphScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}