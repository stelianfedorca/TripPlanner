import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectEmail, selectImage, selectFullname, setImage, userSignOut, selectImageUrl, selectUid, setImageUrl } from '../../redux/reducers/userReducer'

import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { resetAction } from '../../redux/store';
import { auth, db } from '../../firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { setIsSignedIn } from '../../redux/reducers/authReducer';

const AccountInfo = ({photoURL}) => {
    const uid = useSelector(selectUid);
    const name = useSelector(selectFullname);
    const email = useSelector(selectEmail);
    const [pickImageResult, setPickImageResult] = useState('');
    const [fileReference, setFileReference] = useState('');
    const [downloadedImage, setDownloadedImage] = useState('');

    const dispatch = useDispatch();


    const uploadImageToFirebaseStorage = async () => {
        const filename = `userphoto/${uid}`;

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
            xhr.open("GET", pickImageResult.uri, true);
            xhr.send(null);
        });

        // a reference that points to this 'userphoto/image_name' location 
        const fileRef = ref(getStorage(), filename);
        // upload the 'blob' (the image) in the location refered by 'fileRef'
        const result = await uploadBytes(fileRef, blob);
        
        setFileReference(fileRef);
        // We're done with the blob, close and release it
        blob.close();
    };

    const chooseImage = async () => {
        const requestResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if(requestResult.granted === false){
            return ;
        }

        // permission granted
       let response =  await ImagePicker.launchImageLibraryAsync();

       // if the user cancelled the action
       if(response === true){
           return;
       }

       // if the user NOT cancelled the action
       setPickImageResult(response);
    };

    useEffect(() => {
        if(downloadedImage === '') return ;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user){
                await updateProfile(user,{
                    photoURL: downloadedImage
                });

                // update the current user's doc
                const docRef = doc(db,'users',user.uid);
                const data = {
                    image: downloadedImage
                };

                await updateDoc(docRef,data);

                // update the current user's redux
                dispatch(setImageUrl(downloadedImage));
                
            } else {
                console.log("The user is not logged in");
            }
        });

        
        return () => unsubscribe();
    },[downloadedImage]);

    useEffect(() => {
        if(fileReference === '') return ;

        // download the url from storage
        getDownloadURL(fileReference)
            .then((response) => {
                setDownloadedImage(response);
            })
    },[fileReference]);

    useEffect(() => {
        if(pickImageResult.uri === undefined) return;

        uploadImageToFirebaseStorage();
    },[pickImageResult])

    // when the user choose an image, upload that image to firebase Storage  

    const handleSignOut = () => {
        auth.signOut()
        .then(() => {
            dispatch(resetAction());
            dispatch(setIsSignedIn(false));
        })  
        .catch(error => alert(error.message));
      };

   

  return (
    <View style={styles.container}>
        <View style={styles.extension}></View>

            <View style={{width:130}}>
                {
                    photoURL ? (
                        <Image source={{uri: pickImageResult.uri? pickImageResult.uri : photoURL}} style={{width:130,height:130,borderRadius:130/2}} />
                    ): (
                        <Image source={require('../../assets/icon.png')} style={{width:130,height:130,borderRadius:130/2}} />
                    )
                }


                <View style={styles.logOut}>
                    <TouchableOpacity onPress={handleSignOut}>
                        <AntDesign name="logout" size={24} color="black"/>
                    </TouchableOpacity>
                </View>

                <View style={{position: 'absolute', right:-2, bottom:1,}}>
                    <TouchableOpacity onPress={chooseImage} style={styles.imagePicker}>
                        <MaterialCommunityIcons name="camera" size={36} color="#4B4B4B" />
                    </TouchableOpacity>
                </View>
            
            </View>

            <View style={{justifyContent:'center',alignItems:'center',margin:10,}}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>
    </View>
  )
}

export default AccountInfo

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#E5D1D1',
        justifyContent:'center',
        alignItems:'center',
    },
    name:{
        fontSize:16.5,
        fontWeight:'700',
    },
    email:{
        fontWeight:'500',
        color:'#4F4D4D',
    },
    topCircle:{
        width:500,
        height:200,
        backgroundColor:'#2E7FE3',
        borderRadius: 20/2,
        opacity:0.3,

        position:'absolute',
        top:-120,
        right:-100,
        
        borderWidth:2,
        borderColor:'green',
    },

    logOut:{
        position:'absolute',
        top:25,
        right:-100,

    },
    extension:{
        backgroundColor:'white', width:'100%',
         height:130,
         flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', 
        bottom: 0,

        borderTopRightRadius:20,
        borderTopLeftRadius:20,
    },
    imagePicker:{
        backgroundColor:'white',
        borderRadius:20,
        
    }
})