import { StyleSheet, Text, View, SafeAreaView} from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import GuidesScreen from '../TopTabs/GuidesScreen';
import PlansScreen from '../TopTabs/PlansScreen';

const Tab = createMaterialTopTabNavigator();

const TopBar = () => {
  return (
      <SafeAreaView style={styles.container} >
        <Tab.Navigator 
        initialRouteName='Plans'
        screenOptions={{
            tabBarActiveTintColor: '#2E7FE3',
            tabBarInactiveTintColor: 'grey',
        }}

        
         >
            <Tab.Screen options={{headerShown:false,}} name='Plans' component={PlansScreen}/>
            <Tab.Screen options={{headerShown:false}} name='Guides' component={GuidesScreen}/>
        </Tab.Navigator>
      </SafeAreaView>
  )
}

export default TopBar

const styles = StyleSheet.create({
  container:{
    flex:2,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
  }
})