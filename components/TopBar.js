import { StyleSheet, Text, View, SafeAreaView} from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import GuidesScreen from '../screens/TopTabs/GuidesScreen';
import PlansScreen from '../screens/TopTabs/PlansScreen';

const Tab = createMaterialTopTabNavigator();

const TopBar = () => {
  return (
      <SafeAreaView style={{flex:2,}} >
        <Tab.Navigator 
        initialRouteName='Plans'
        screenOptions={{
            tabBarActiveTintColor: '#2E7FE3',
            tabBarInactiveTintColor: 'grey',
        }}
         >
            <Tab.Screen options={{headerShown:false}} name='Plans' component={PlansScreen}/>
            <Tab.Screen options={{headerShown:false}} name='Guides' component={GuidesScreen}/>
        </Tab.Navigator>
      </SafeAreaView>
  )
}

export default TopBar

const styles = StyleSheet.create({})