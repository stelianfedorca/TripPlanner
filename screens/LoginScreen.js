import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TextInput,Button, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import {useHeaderHeight} from '@react-navigation/elements';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {auth} from '../firebase';
import { useDispatch } from 'react-redux';

const LoginScreen = ({navigation}) => {
    // react hooks
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    // const navigation = useNavigation();

    // // called when the component is mounted
    // useEffect(() => {
    //     onAuthStateChanged(auth,user => {
    //         // if(user){
    //         //     navigation.replace("Upload");
    //         // }
                
    //     })
    // },[]);

    const navigateToRegisterScreen = () => {
        navigation.replace("Register");
    }


   // const auth = getAuth();

    // implementation for handling the sign-up
    // const handleSignUp = () => {
    //     createUserWithEmailAndPassword(auth,email,password)
    //     .then(userCredentials => {
    //         const user = userCredentials.user;
    //         console.log("Registered in with: ", user.email);
    //     })
    //     .catch(error => alert(error.message))
    // }

    const handleLoginIn = () => {
        signInWithEmailAndPassword(auth,email,password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log("Logged in with: ", user.email);
        })
        .catch(error => alert(error.message))
    }


    const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
    keyboardVerticalOffset={headerHeight}
    style={styles.container}
    behavior={Platform.IOS === 'ios' ? "padding" : "height"}
    >
    {/* Top circle for UI design */}
    <View style={styles.circleTopRight}></View>


      <View style={styles.inputContainer}>


      <TextInput
      placeholder='Email'
      value={email}
      onChangeText={text => setEmail(text)}
      style={styles.input}
      />
      
      <TextInput
      placeholder='Password'
      value={password}
      onChangeText={text => setPassword(text)}
      style={styles.input}
      secureTextEntry
      />
      </View>

      {/**View-ul ce contine butonul de login*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
        onPress={handleLoginIn}
        style={styles.button}
        >
        <Text style={styles.buttonLogin}>Login</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
        onPress={handleSignUp}
        style={[styles.button,styles.buttonOutline]}
        >
        <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity> */}

      </View>

      {/* User has no account, sign up */}
        <View style={styles.containerNoAcc}>
            <Text style={[styles.textNoAcc, {color: '#B7B3B2'}]}>Don't have an account?</Text>
            
            <TouchableOpacity
            style={{ marginStart:5,}}
            onPress={navigateToRegisterScreen}
            >
            <Text 
            style={[styles.textNoAcc,{fontWeight:'bold', color: '#DF602A',}]}>Sign up</Text>
            </TouchableOpacity>
        </View>

        {/* Bottom circles for UI design */}
      <View style={styles.circleRight}></View>
      <View style={styles.circleLeft}></View>

      </KeyboardAvoidingView>


  );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
        backgroundColor:'white',
    },
    secondContainer:{
        margin:20,
    },
    input:{
        backgroundColor:'#F5F4F4',
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:10,
        marginTop:5,
    },
    inputContainer:{
        width:'80%' // acest view sa fie 80% din lungimea parintelui View
    },
    buttonContainer:{
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:40,
    },
    button:{
        backgroundColor: '#0782F9',
        width:'100%',
        padding:15,
        borderRadius:10,
        alignItems:'center',

        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:2,
        },
        shadowOpacity:0.25,
        shadowRadius:2.80,
        elevation:5,
    },
    buttonOutline:{
        backgroundColor:'white',
        marginTop:5,
        borderColor:'#0782F9',
        borderWidth:2,  
    },
    buttonLogin:{
        color:'white',
        fontWeight:'700',
        fontSize:16,

    },
    buttonOutlineText:{
        color:'#0782F9',
        fontWeight:'700',
        fontSize:16,
    },

    circleRight:{
        width:300,
        height:300,
        borderRadius: 300/2,
        borderWidth:3,
        borderColor:'#FF9800',
        backgroundColor: '#FF9800',

        position:'absolute',
        bottom:-180,
        right:-120,
        opacity:0.3,
    },

    circleLeft:{
        width:270,
        height:270,
        borderRadius: 270/2,
        borderWidth:3,
        borderColor:'#DF5611',
        backgroundColor: '#DF5611',

        position:'absolute',
        bottom:-200,
        left:-150,
        opacity:0.4,
    },
    circleTopRight:{
        width:200,
        height:200,
        backgroundColor:'#C04444',
        borderRadius: 200/2,
        opacity:0.3,


        position:'absolute',
        top:30,
        right:-150,
    },
    containerNoAcc:{
        flexDirection: 'row',
        width:'60%',
        justifyContent:'center',
        alignItems:'baseline',
        marginTop:30,
    },
    textNoAcc:{
        fontSize:14.5,
    },
    
});
