import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import TodoListScreen from './screens/TodoListScreen';

import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabScreen from './screens/BottomTabScreen';
import MyBottomTabBar from './screens/MyBottomTabBar';
import { LogBox } from 'react-native';
import RegisterScreen from './screens/RegisterScreen';
import AccountScreen from './screens/AccountScreen';
import UploadScreen from './screens/UploadScreen';
import SearchScreen from './screens/SearchScreen';
import GooglePlacesInput from './screens/GooglePlacesInput';
import OverviewScreen from './screens/TripScreen/OverviewScreen';
import store from './redux/store';
import { Provider } from 'react-redux';
import TempScreen from './screens/TempScreen';
import InfoScreen from './components/InfoScreen';
import { BlurView } from 'expo-blur';

import AddSubcollectionScreen from './screens/AddSubcollectionScreen';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheetPlaceholder from './components/BottomSheetPlaceholder';
import PhotoURLTest from './screens/PhotoURLTest';
import { config } from '@fortawesome/fontawesome-svg-core';
import OverlayScreen from './screens/OverlayScreen';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core and will be removed in a future release'])

  let persistor = persistStore(store);

  const Tab = createMaterialBottomTabNavigator();

  const EmptyScreen = ({navigation}) => {
    useEffect(() => { 
        navigation.navigate('Google');
    })
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        </View>
    )
}
  function BottomTabs() {
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
        options={{tabBarIcon: ({color}) => (
            <Icon name={'user-circle-o'} color={color} size={26}/>
          )}} 
        name='Account' component={AccountScreen}/>
      </Tab.Navigator>
    )
  };



export default function App() {

  const config = {
    animation: 'spring',
    config: {
      duration:500,
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer tab>
          <Stack.Navigator>
          <Stack.Screen options={{headerShown:false}} name="Home2" component={BottomTabs} />
          <Stack.Screen options={{headerShown: false}} name="Google" component={GooglePlacesInput}/>
          <Stack.Screen options={{headerShown: false}} name="Register" component={RegisterScreen} />
          <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
          <Stack.Screen options={{headerShown:false}} name="Overview" component={OverviewScreen}/>
          <Stack.Screen options={{headerShown:false}} name="PlaceHolder" component={BottomSheetPlaceholder}/>
          <Stack.Screen options={{headerShown:false}} name="Account" component={AccountScreen} />
          <Stack.Screen options={{headerShown: false}} name="AddSubcoll" component={AddSubcollectionScreen}/>
          {/* <Stack.Screen options={{headerShown: false}} name="Temp" component={TempScreen}/> */}
          <Stack.Screen options={{headerShown:false}} name="MyBottom" component={MyBottomTabBar} />

          <Stack.Screen 
            name="Info" 
            component={InfoScreen}
            options={{
             

              
              // headerShown:false,
              // headerBackTitleVisible:false,
              // headerLeft: (props) => (
              //   <BackButtonCustom {...props}/>
              // ),
                // headerTransparent:true,
              // headerBackground: () => (
              //   <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
              // ),
              // title:'',
              }}
          />
          <Stack.Screen 
          options={{
            // transitionSpec:{
            //   open: config,
            //   close: config,
            // },
            headerShown: false
            
            }
            
            } 
          
          name="Search" 
          component={SearchScreen}
          
          />
          
          <Stack.Screen options={{headerShown: false}} name="PhotoURLTest" component={PhotoURLTest}/>
          <Stack.Screen options={{headerShown: false}} name="Upload" component={UploadScreen}/>
          <Stack.Screen options={{headerShown:false}} name="TodoList" component={TodoListScreen} />  
            <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
            {/* <Stack.Screen name="BottomTabBar" component={BottomTabScreen}/> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>

      </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// bun 
// headerLeft: () => (
//   <TouchableOpacity
//      style={styles.headerBtnContainer}
//      onPress={() => props.navigation.goBack()}
//   >
//     <Ionicons name="close-sharp" size={24} color="white" />
//   </TouchableOpacity>
// ),