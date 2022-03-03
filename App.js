import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import TodoListScreen from './screens/TodoListScreen';

import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
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
import { Button } from 'react-native-web';
import BackButtonCustom from './components/BackButtonCustom';
import HeaderCustom from './components/HeaderCustom';
import AddSubcollectionScreen from './screens/AddSubcollectionScreen';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core and will be removed in a future release'])

  let persistor = persistStore(store);
export default function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer tab>
          <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name="Google" component={GooglePlacesInput}/>
          <Stack.Screen options={{headerShown: false}} name="AddSubcoll" component={AddSubcollectionScreen}/>
        <Stack.Screen options={{headerShown:false}} name="Account" component={AccountScreen} />
          <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
          {/* <Stack.Screen options={{headerShown: false}} name="Temp" component={TempScreen}/> */}
          <Stack.Screen options={{headerShown: false}} name="Overview" component={OverviewScreen}/>
          <Stack.Screen options={{headerShown: false}} name="Register" component={RegisterScreen} />

          <Stack.Screen 
            name="Info" 
            component={InfoScreen}
            // options={{
            //   headerLeft: (props) => (
            //     <BackButtonCustom {...props}/>
            //   ),
            //     headerTransparent:true,
            //   headerBackground: () => (
            //     <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
            //   ),
            //   title:'',
            //   }}
          />

          <Stack.Screen options={{headerShown: false}} name="Search" component={SearchScreen}/>
          <Stack.Screen options={{headerShown: false}} name="Upload" component={UploadScreen}/>
          <Stack.Screen options={{headerShown:false}} name="TodoList" component={TodoListScreen} />  
            <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
            {/* <Stack.Screen name="BottomTabBar" component={BottomTabScreen}/> */}
            <Stack.Screen options={{headerShown:false}}  name="MyBottomTabBar" component={MyBottomTabBar} />
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