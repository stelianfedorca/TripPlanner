import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, SafeAreaView} from 'react-native';
import {
  NavigationContainer, TabActions, 
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
      } from '@react-navigation/native';
import { LogBox } from 'react-native';
import store from './redux/store';
import { Provider, useSelector } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import StackScreen from './screens/StackScreen';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme, 
  Provider as PaperProvider
      } from 'react-native-paper'

      
LogBox.ignoreLogs(['Setting a timer for a long period of time'])
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core and will be removed in a future release'])
LogBox.ignoreLogs(['[Unhandled promise rejection: FirebaseError: ']);
LogBox.ignoreLogs(['[Possible Unhandled Promise Rejection ']);
LogBox.ignoreAllLogs(true);

const theme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: 'blue',
    accent: 'black',
  },
};

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: 'blue',
    accent: 'black',
    backgroundColor:'red',
    
  },
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    
  },
};
  
  export default function App() {
    let persistor = persistStore(store);

  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={CombinedDefaultTheme}>
            <NavigationContainer tab theme={CombinedDefaultTheme}>
                <StackScreen/>
            </NavigationContainer>
          </PaperProvider>
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
