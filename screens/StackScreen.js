import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectIsFirstSignIn, selectIsSignedIn } from '../redux/reducers/authReducer';
import LoginScreen from './AuthScreens/LoginScreen';
import RegisterScreen from './AuthScreens/RegisterScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import AccountScreen from './Account/AccountScreen';
import HomeScreen from './HomeScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import UploadScreen from './UploadScreen';
import GooglePlacesInput from './GooglePlacesInput';
import SearchScreen from './SearchScreen';
import OverviewScreen from './TripScreen/OverviewScreen';
import PlaceDetailsScreen from './TripScreen/PlaceDetailsScreen';
import { selectImageUrl } from '../redux/reducers/userReducer';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import MapScreen from './MapScreen';
const StackScreen = () => {
    const Stack = createNativeStackNavigator();
    const isSignedIn = useSelector(selectIsSignedIn);
    const isFirstSignIn = useSelector(selectIsFirstSignIn);
   
    const EmptyScreen = ({navigation}) => {
        useEffect(() => { 
          navigation.navigate('Google');
          })
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
              </View>
          )
    };
    function BottomTabs() {
        const Tab = createMaterialBottomTabNavigator();
          
        return (
        <Tab.Navigator
            labeled={false}
            initialRouteName='Home'
            barStyle={{ backgroundColor: 'white', height:60}}
            activeColor='black'
            inactiveColor='#B8B6B6'
            screenOptions={{
                tabBarShowLabel:false,
                // headerShown:false,
            }}
            
            >
            <Tab.Screen 
            options={{
              tabBarIcon: ({color}) => (
                <Icon name={'home'} color={color} size={26}/>
            ),
            headerShown:false,
            animation:'slide_from_right'
            }}
            name='Home' component={HomeScreen}

            />
    
            <Tab.Screen
            options={{
              tabBarIcon: ({color}) => (
                <Icon name={'plus'} color={color} size={26}/>
              ),
              headerShown:false,
            }}
            name='Add'
            component={EmptyScreen}
            listeners={({navigation, route}) => (
            {
                tabPress: (e) => {
                e.preventDefault();
    
                navigation.navigate('Google');
                }
            }
            )}
            />

            {/* <Tab.Screen
              name='Map'
              component={MapScreen}
              options={{
                tabBarIcon: ({color}) => (
                  <FontAwesome5 name="map-marked-alt" size={26} color={color} />
                )
              }}
            /> */}
    
            <Tab.Screen 
            options={{
                tabBarIcon: ({color}) => (
                  <Icon name={'user-circle-o'} color={color} size={26}/>
            ),
            headerShown:false,
            animationTypeForReplace: isSignedIn ? 'pop' : 'push',
            
            }} 
            name='Account' component={AccountScreen}/>
        </Tab.Navigator>
          )
    };

   

  return (
    <Stack.Navigator>
          {
            isSignedIn ? (
              <>
              {
                  isFirstSignIn ? (
                    <Stack.Screen options={{headerShown:false}} name="Upload" component={UploadScreen}/>
                  ):(
                    
                    <Stack.Screen 
                    options={{
                        headerShown:false
                        }} 
                    name="Home2"
                    component={BottomTabs} />

                  )
              }
                <Stack.Screen options={{headerShown: false, animation:'fade_from_bottom'}} name="Google" component={GooglePlacesInput}/>
                <Stack.Screen options={{headerShown: false, animation:'fade'}} name="Search" component={SearchScreen}/>
                <Stack.Screen options={{headerShown:false, animation:'slide_from_right'}} name="Overview" component={OverviewScreen}/>
                <Stack.Screen 
                name="Info" 
                component={PlaceDetailsScreen}
                options={{
                  animation:'slide_from_right',
                  headerShown:false,
                }} 
                />
              </>
            ):(
              <>
                <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
                <Stack.Screen options={{headerShown: false}} name="Register" component={RegisterScreen}/>
              </>
            )
          }
          </Stack.Navigator>
  )
}

export default StackScreen

const styles = StyleSheet.create({})