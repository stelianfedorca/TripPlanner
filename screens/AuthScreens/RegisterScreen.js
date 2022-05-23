import { StyleSheet, Text, View, TextInput, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Button} from 'react-native';
import React, { useEffect, useState } from 'react';
import {useHeaderHeight} from '@react-navigation/elements';
import { 
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    }
     from 'firebase/auth';
import {auth, db} from '../../firebase';
import { setDoc, doc, getDoc, updateDoc} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
    uploadString
} 
from 'firebase/storage';
import { setName, setEmail, selectFullname, selectEmail, setUid } from '../../redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setIsFirstSignIn, setIsSignedIn } from '../../redux/reducers/authReducer';

const RegisterScreen = ({navigation}) => {
    const [nameInput, setNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');
    const [userPhoto, setUserPhoto] = useState('');
    const [image, setImage] = useState(null);

    const [isRegistered, setIsRegistered] = useState(false);

    const dispatch = useDispatch();

    const n = useSelector(selectFullname);
    const e = useSelector(selectEmail);

    // root storage reference
    const storage = getStorage();
    
    const navigateTo = (screen) => {
        navigation.replace(screen);
    }
   
    // the header's height
    const headerHeight = useHeaderHeight();


    const uploadUserPhoto = (file) => {
        console.log("uploading the photo to firebase..");
        // const id = uuid();

        // returns a reference to this particular storage 
        // if it doesn't exists, it creates one 
        const storageRef = ref(storage,`photos/user_photo`);

        const metadata = {
            contentType: "image/jpeg",
        }

        // upload the image in storage
        const uploadTask = uploadBytesResumable(storageRef,file,metadata);

        const docRef = doc(db,'users',auth.currentUser.email);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done.`);
            },
            (error) => {
                console.log(error.message);
            },
            //complete
            () => {
                // handle successful uploads on complete
                // Get the image's url from storage
                getDownloadURL(uploadTask.snapshot.ref)
                .then((URL) => {
                    const data = {
                       name:nameInput,
                       photo: URL, 
                    }
                    updateDoc(docRef,data);
                    navigateTo("Account");
                })
            }
        )
  
        // Add the document to the DB

    }

    // Function for storing the image name inside current user field 'postImage'
    const updateUserWithImage = async (filename) => {
        const docRef = doc(db,'users',emailInput)
        
        console.log("Filename: ",filename);

        const data = {
            image: filename,
        }

        await updateDoc(docRef,data);
    }


    async function uploadImageToFirebase(uri){
        const id = 100;

        // setFilename(`userphoto/${id}`);
        const fileName = `userphoto/${id}`;

    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // on load
        xhr.onload = function () {
        resolve(xhr.response);
    };
        // on error
        xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
    };
        // on complete
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    });

    // a reference that points to this 'userphoto/{id}' location 
    const fileRef = ref(storage, fileName);
    // upload the 'blob' (the image) in the location refered by 'fileRef'
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    
    await updateUserWithImage(fileName);

    // download the url from storage
    return await getDownloadURL(fileRef);
    }
   

    const handleSignUp = async () => {
        try{
            const { user } = await createUserWithEmailAndPassword(auth, emailInput, password)
            // Create the user document in firestore
            const uid = user.uid;
            const email = user.email;            
            const docRef = doc(db,'users', uid);
                    
                    
            await updateProfile(user,{
                displayName: nameInput
            });
                    
            const data = {
                email: email,
                name: nameInput,
                image: image,
            }
            dispatch(setUid(uid));
            dispatch(setName(nameInput));
            dispatch(setEmail(emailInput));
                    
            setDoc(docRef,data);

        }catch(err){
            console.log(err);
        }
        
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(user) => {
            if(user){
                dispatch(setIsSignedIn(true));
                // dispatch(setIsFirstSignIn(true));
            } else {
                return;
            }   

            return () => unsubscribe(); // unsubscribing from the listener when the component is unmounting.
        });
    },[]);
    
    // useEffect(() => {
    //     if(isRegistered){
    //         console.log("isRegistered: ----> ", isRegistered);
    //         dispatch(setIsFirstSignIn(true));
    //         dispatch(setIsSignedIn(true));
    //     }
    // },[isRegistered]);

    const navigateToLoginScreen = () => {
        navigation.replace('Login');
    }

  return (
    <KeyboardAvoidingView
    // keyboardVerticalOffset={headerHeight}
    style={styles.container}
    behavior={Platform.IOS === 'ios' ? "padding" : null}
    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >

    {/* Circle for design */}
    <View style={styles.circleTopRight}></View>

    <Text style={styles.textSignUp}>Sign Up</Text>

    {/* User input */}
    <View style={styles.inputContainer}>

    <TextInput
    placeholder='Full Name'
    value={nameInput}
    onChangeText={text => setNameInput(text)}
    style={styles.input}
    />

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

    <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={styles.buttonSignUp}
        onPress={handleSignUp}
        >
        <Text style={styles.textBtnSignUp}>Sign up</Text>
        </TouchableOpacity>
    </View>

    <View style={styles.containerAlreadyAccount}>
            <Text style={[styles.textNoAcc, {color: '#878484'}]}>Already have an account?</Text>
            
            <TouchableOpacity
            style={{ marginStart:5,}}
            onPress={navigateToLoginScreen}
            >
            <Text 
            style={[styles.textNoAcc,{fontWeight:'bold', color: '#323030',}]}>Sign in</Text>
            </TouchableOpacity>
        </View>


    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        overflow:'hidden',
    },
    input:{ 
       backgroundColor:'#F5F4F4',
       borderRadius:15,
       marginTop:6,
       paddingHorizontal:15,
       paddingVertical:15,

       elevation:1,
    },
    thumbnail:{
        width: 200,
        height: 200,
        resizeMode: "contain",
    },
    circleTopRight:{
        width:400,
        height:400,
        borderRadius: 400/2,
        backgroundColor:'#2D90FA',
        opacity:0.4,

        position:'absolute',
        top:-40,
        right:-220,
    },
    inputContainer:{
        width:'80%',
        marginTop:5,
    },
    textSignUp:{
        fontSize:48,
        fontWeight:'bold',
        alignSelf:'stretch',
        alignContent:'flex-start',
        justifyContent:'flex-start',
        marginStart:40,
        opacity:0.7,
        color:'#000',
        marginBottom:5,
    },
    buttonContainer:{
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        marginTop:40,
    },
    buttonSignUp:{
        backgroundColor:'#2D90FA',
        width:'100%',
        padding:15,
        borderRadius:15,
        alignItems:'center',

        // elevation/shadow
        elevation:5, // for Android
        shadowColor:'#000', // black
        shadowOffset:{
            width:0,
            height:2,
        },
        shadowOpacity:0.3, // for IOS
        shadowRadius:2.80,
        
    },
    textBtnSignUp:{
        fontSize:16,
        fontWeight:'700',
        color:'white',
    },

    containerAlreadyAccount:{
        flexDirection: 'row',
        width:'60%',
        justifyContent:'center',
        alignItems:'baseline',
        marginTop:30,
    }

});
