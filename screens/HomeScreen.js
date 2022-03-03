import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { NavigationContainer, useNavigation } from '@react-navigation/native';


const HomeScreen = ({navigation}) => {
    const [outputText, setOutputText] = useState('');

    // const navigation = useNavigation();

    const handleSignOut = () => {
        auth
        .signOut()
        .then(() => {
            navigation.replace("Login");
        })
        .catch(error => {
            alert(error.message);
        })
    }

  return (
    <View style={styles.container}>
    <Text>Home Screen</Text>
    <TouchableOpacity
    style={styles.button}
    onPress={handleSignOut}
    >
    <Text style={styles.buttonText}>Sign Out</Text>
    </TouchableOpacity>

    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        // backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
    },
    button:{
        borderRadius:10,
        padding:6,
        height:40,
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#0782F9',
        marginTop:20,
    },
    buttonText:{
        color:'white',
        fontSize:16,
        fontWeight:"700",
    }
});
