import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import AccountScreen from './AccountScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

    function CustomScreen() {
        return null;
    }

    const addImage = () => {
        
    }

    const CustomButton = ({children, onPress}) => (
        <TouchableOpacity
          style={{
              top: -20,
              justifyContent:'center',
              alignItems:'center',
          }}
          onPress={onPress}
        >
          <View
            style={{
                width: 60,
                height: 60,
                borderRadius:30,
                backgroundColor: "#0782F9",
                justifyContent:'center',
                alignItems:'center',
                ...styles.shadow,
            }}
          >
          <Icon name={"plus"} color={"white"} size={20} />
          </View>
        </TouchableOpacity>
      );




const BottomTabScreen = () => {
  return (
    <Tab.Navigator >
     <Tab.Screen 
     name='Home' 
     component={HomeScreen}
     options={{tabBarIcon: () => (
         <Icon name={"home"} color={'black'} size={20}/>
     ),
     headerShown:false
     }} 
     />

    <Tab.Screen
        name="Middle Name"
        component={CustomScreen}
        options={{
            tabBarIcon: ({}) => (
                // <Icon name={"plus"} color={'black'} size={20}/>
              <></>  
            ),
            tabBarButton: (props) => <CustomButton {...props}/>,
            headerShown:false,
        }}
        
    />

    <Tab.Screen 
     name='Account'
      component={AccountScreen}
      options={{tabBarIcon: () => (
        <Icon name={"user"} color={'black'} size={20}/>
      ),
      headerShown:false,
      }}

    />
    </Tab.Navigator>
  );
};

export default BottomTabScreen;

const styles = StyleSheet.create({
    shadow:{
        shadowColor:'#000',
        shadowOffset:{
            width:2,
            height:7,
        },
        shadowOpacity:0.2,
        shadowRadius:4,
        elevation:0.3,
    }
});
