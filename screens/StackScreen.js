import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectIsFirstSignIn, selectIsSignedIn } from '../redux/reducers/authReducer';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import AccountScreen from './AccountScreen';
import HomeScreen from './HomeScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import UploadScreen from './UploadScreen';
import GooglePlacesInput from './GooglePlacesInput';
import SearchScreen from './SearchScreen';
import OverviewScreen from './TripScreen/OverviewScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const StackScreen = () => {
    const Stack = createNativeStackNavigator();
    const isSignedIn = useSelector(selectIsSignedIn);
    const isFirstSignIn = useSelector(selectIsFirstSignIn);
    const navigation = useNavigation();


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
            barStyle={{ backgroundColor: 'white' }}
            activeColor='#2E7FE3'
            inactiveColor='#C8C8C8'
            screenOptions={{
                tabBarShowLabel:false,
                headerShown:false,
            }}
            >
            <Tab.Screen 
            options={{tabBarIcon: ({color}) => (
                <Icon name={'home'} color={color} size={26}/>
            )}}
            name='Home' component={HomeScreen}/>
    
            <Tab.Screen
            options={{tabBarIcon: ({color}) => (
                <Icon name={'plus'} color={color} size={26}/>
            )}}
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
    
            <Tab.Screen 
            options={{
                tabBarIcon: ({color}) => (
                <Icon name={'user-circle-o'} color={color} size={26}/>
            ),
            animationTypeForReplace: isSignedIn ? 'push' : 'push',
            
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
                <Stack.Screen options={{headerShown:false}} name="Overview" component={OverviewScreen}/>
                {/* 
                <Stack.Screen options={{headerShown:false}} name="PlaceHolder" component={BottomSheetPlaceholder}/>
                <Stack.Screen options={{headerShown:false}} name="Account" component={AccountScreen} />
                <Stack.Screen options={{headerShown: false}} name="AddSubcoll" component={AddSubcollectionScreen}/>

                <Stack.Screen name="Info" component={InfoScreen}/>
                 */}
                
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