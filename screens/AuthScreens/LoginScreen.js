import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TextInput,Button, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import {useHeaderHeight} from '@react-navigation/elements';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {auth, db} from '../../firebase';
import { useDispatch } from 'react-redux';
import { setEmail, setName, setUid } from '../../redux/reducers/userReducer';
import { collection, doc, getDoc } from 'firebase/firestore';
import { setIsFirstSignIn, setIsSignedIn } from '../../redux/reducers/authReducer';

const LoginScreen = ({navigation}) => {
    // react hooks
    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();


    const navigateToRegisterScreen = () => {
        navigation.replace("Register");
    };

    const handleSignIn = async () => {
        signInWithEmailAndPassword(auth,emailInput,password)
            .then((user) => {
                dispatch(setIsFirstSignIn(false));
            })
        .catch(error => alert(error.message));

    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,user => {
            if(user){
                const uid = user.uid;
                const email = user.email;
                const name = user.displayName;

                dispatch(setUid(uid));
                dispatch(setEmail(email));
                dispatch(setName(name));
                
                dispatch(setIsSignedIn(true));

            } else {
                return;
            }   

            return () => unsubscribe(); // unsubscribing from the listener when the component is unmounting.
        });

    },[]);


    const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
    keyboardVerticalOffset={headerHeight}
    style={styles.container}
    behavior={Platform.IOS === 'ios' ? "padding" : null}
    >
    {/* Top circle for UI design */}
    <View style={styles.circleTopRight}></View>
    <Text style={styles.textSignIn}>Sign In</Text>

      <View style={styles.inputContainer}>
        <TextInput
        placeholder='Email'
        value={emailInput}
        onChangeText={text => setEmailInput(text)}
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
        onPress={handleSignIn}
        style={styles.button}
        >
        <Text style={styles.buttonLogin}>Sign in</Text>
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
        overflow:'hidden',
    },
    secondContainer:{
        margin:20,
    },
    input:{
        backgroundColor:'#F5F4F4',
        paddingHorizontal:15,
        paddingVertical:15,
        borderRadius:10,
        marginTop:5,

        elevation:1,
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
    textSignIn:{
        fontSize:48,
        fontWeight:'bold',
        alignSelf:'stretch',
        alignContent:'flex-start',
        justifyContent:'flex-start',
        marginStart:40,
        opacity:0.7,
        color:'#000',
        marginBottom:5,
    }
    
});
