import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './LoginScreen';
import MapScreen from './MapScreen';
import ProfileScreen from './ProfileScreen';

const DrawerNav = () => {
    const Drawer = createDrawerNavigator();
  return (
   <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={MapScreen} />
    <Drawer.Screen name="Settings" component={ProfileScreen} />
    <Drawer.Screen name="Logout" component={LoginScreen} />
    
  </Drawer.Navigator>
  )
}

export default DrawerNav

const styles = StyleSheet.create({})