import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import GuidesScreen from '../screens/TopTabs/GuidesScreen';
import PlansScreen from '../screens/TopTabs/PlansScreen';
import RecommendScreen from '../screens/RecommendScreen';
import ItineraryScreen from '../screens/TripScreen/ItineraryScreen';
import ExploreScreen from '../screens/TripScreen/ExploreScreen';

const Tab = createMaterialTopTabNavigator();

const TopBarOverview = () => {
  return (
      <View style={styles.container}>
        <Tab.Navigator 
        initialRouteName='Recommended'
        screenOptions={{
            tabBarLabelStyle:{fontWeight:'bold',fontSize:12,},
            tabBarActiveTintColor: '#2E7FE3',
            tabBarInactiveTintColor: 'grey',
            // tabBarIndicatorStyle:{
            //     backgroundColor:
            // }
        }}
         >
            <Tab.Screen options={{headerShown:false}} name='Recommended' component={RecommendScreen}/>
            <Tab.Screen options={{headerShown:false}} name='Itinerary' component={ItineraryScreen}/>
            <Tab.Screen options={{headerShown:false}} name='Explore' component={ExploreScreen}/>
        </Tab.Navigator>
      </View>
  )
}

export default TopBarOverview

const styles = StyleSheet.create({
  container:{
    flex:2,
    // borderWidth:1,
    // borderColor:'red',
  }
})