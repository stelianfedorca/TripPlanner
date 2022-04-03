import { View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodoListScreen from './TodoListScreen';
import HomeScreen from './HomeScreen';
import  Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import ImageScreen from './ImageScreen';
import AccountScreen from './AccountScreen'


    const Tab = createBottomTabNavigator();

    function EmptyScreen() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            </View>
        )
    }

    const onAction = () => {
        console.log("Clicked...");
    }

    const MyBottomTabBar = () => {
        const [selectedImage, setSelectedImage] = useState(null);

        let openImagePickerAsync = async () => {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if(permissionResult.granted === false){
                alert("Permision to access camera roll is required");
                return ;
            }

            // if permission is granted
            let pickerResult = await ImagePicker.launchImageLibraryAsync();
            
            if(pickerResult.cancelled === true){
                return ;
            }

            // if the user did not cancelled
            setSelectedImage({localUri: pickerResult.uri});
            console.log(selectedImage.localUri);
        };

    return (
    <Tab.Navigator
    initialRouteName='Home'
    screenOptions={{
        tabBarShowLabel:false,
        headerShown:false,
    }}>
        {/* Home Tab */}
        <Tab.Screen 
        name="Home"
        component={HomeScreen}
        options={
            {tabBarIcon: ({focused}) => (
                <Icon name={'home'} color={focused ? '#0782F9' : 'grey'} size={26}/>
            )}
            }    
        />

        <Tab.Screen
            name="ActionButton"
            component={EmptyScreen}
            options={{
                tabBarIcon: ({focused}) => (

            <TouchableOpacity
            onPress={() => console.log("!!>>>")}
            >
              <View style={{
                width: 60,
                height: 60,
                backgroundColor: '#0782F9',
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS == "android" ? 50 : 30
              }}>
                <Image 
                source={require('../assets/plus_icon.png')} 
                style={{
                  width: 30,
                  height: 30,
                  tintColor: 'white',
                }}/>

              </View>
            </TouchableOpacity>
                )
                
            }}
        />

        
            {/* Account Tab */}
        <Tab.Screen
            // children={() => <ImageScreen userData={selectedImage}/>}
            name="Account"
            component={AccountScreen}
            options={
                {tabBarIcon: ({focused}) => (
                    <Icon name={'user-circle-o'} color={focused ? '#0782F9' : 'grey'} size={26}/>
                )}
                }
        />

    </Tab.Navigator>
    );
    };

export default MyBottomTabBar;

    const styles = StyleSheet.create({
       
    })
