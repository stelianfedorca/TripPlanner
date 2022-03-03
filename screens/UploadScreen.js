import { StyleSheet, Text, View, Button, Image, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, getAuth } from 'firebase/auth';


const UploadScreen = ({navigation}) => {
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [imgfirebase, setImgfirebase] = useState('');
    const [imagename, setImagename] = useState('');
    // const [filename, setFilename] = useState('');

    const auth = getAuth();

    // const navigation = useNavigation();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log("Email: ", user.email);
              setEmail(user.email);
              // ...
            } else {
                console.log("no user");
              // User is signed out
            }
          });

        // console.log(auth.currentUser.email);
            // setEmail(auth.currentUser?.email);        
            // console.log(email);
    
            // const docRef = doc(db,"users",auth.currentUser?.email);
            // const docSnap = await getDoc(docRef);
    
            // if(docSnap.exists()){
            //     setName(docSnap.data().name);
            //     // console.log("postImage: ", docSnap.data().postImage);
            //     // console.log(name);
            // }else{
            //     console.log("No such a document");
            // }
        
    })

    const navigateTo = (screen) => {
        navigation.navigate(screen);
    }

    const updateUserWithPhoto = async (filename) => {
        const docRef = doc(db,'users',email)
        
        console.log("Filename: ",filename);

        const data = {
            postImage: filename,
        }

        await updateDoc(docRef,data);
    }

    async function uploadImageToFirebase(uri){
        const id = 101;

        // setFilename(`userphoto/${id}`);

        // console.log(filename);
        const filename = `userphoto/${id}`;

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

    // a reference that points to this 'userphoto/image_name' location 
    const fileRef = ref(getStorage(), filename);
    // upload the 'blob' (the image) in the location refered by 'fileRef'
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    // add the image name to current user
    await updateUserWithPhoto(filename);

    // download the url from storage
    return await getDownloadURL(fileRef);
    }

    const chooseImage = async () => {
        const requestResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(requestResult.granted === false){
            alert("Permision to access camera roll is required");
            return ;
        }

        // permission granted
        let pickerResult = await ImagePicker.launchImageLibraryAsync();

        if(pickerResult === true){
            return ;
        }

        // upload the image to firebase storage
        const uploadUrl = await uploadImageToFirebase(pickerResult.uri);

        // // add the image name to current user
        // await updateUserWithPhoto();

        setImage({url: uploadUrl});
        console.log(image.url);
    }

  
        //             const img = await fetch(image);
        //             const blob = await img.blob();
        
        //             console.log("Uploading image...");
        
        //             // upload data to storage
        //             const uploadTask = uploadBytesResumable(storageRef,blob);
        
        
        //                 // Listen for state changes, errors, and completion of the upload.
        //             uploadTask.on('state_changed',(snapshot) => {
        //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     console.log('Upload is ' + progress + '% done');
        //     switch (snapshot.state) {
        //        case 'paused':
        //            console.log('Upload is paused');
        //        break;
        //        case 'running':
        //           console.log('Upload is running');
        //        break;
        //     }
        //  },
        //  (error) => {
        //     // this.setState({ isLoading: false })
        //     // A full list of error codes is available at
        //     // https://firebase.google.com/docs/storage/web/handle-errors
        //     switch (error.code) {
        //        case 'storage/unauthorized':
        //           console.log("User doesn't have permission to access the object");
        //        break;
        //        case 'storage/canceled':
        //           console.log("User canceled the upload");
        //        break;
        //        case 'storage/unknown':
        //           console.log("Unknown error occurred, inspect error.serverResponse");
        //        break;
        //     }
        //  },
        //  () => {
        //     // Upload completed successfully, now we can get the download URL
        //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //        console.log('File available at ', downloadURL);
        //        //perform your task
        //     });
        //  });

    const getImageFromFirebase = () => {
        const storage = getStorage();
        const storageRef = ref(storage,imagename);

        getDownloadURL(storageRef)
            .then((url) => {
                // `url` is the download URL for 'userphoto/33' -> user's image

                // // This can be downloaded directly:
                // const xhr = new XMLHttpRequest();
                // xhr.responseType = "blob";
                // xhr.onload = (event) => {
                //     const blob = xhr.response;
                // };
                // xhr.open("GET", url);
                // xhr.send();

                setImgfirebase({url: url});
            })
            .catch((error) => console.log(error.message));
    }

  return (
    <View style={styles.container}>

        <TouchableOpacity 
        style={{marginBottom:15,backgroundColor:'purple', padding:10,}}
        onPress={chooseImage}
        >
            <Text style={{fontWeight:'700', color:'white'}}>Choose Image</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity 
        style={{marginBottom: 10, backgroundColor:'green', padding:10,}}
        onPress={uploadImageToFirebase}
        >
            <Text style={{fontWeight:'700', color:'white'}}>Upload Image</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={{marginBottom: 10, backgroundColor:'grey', padding:10,}}
        onPress={updateUserWithPhoto}
        >
            <Text style={{fontWeight:'700', color:'white'}}>Add image to user doc</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={{marginBottom: 10, backgroundColor:'blue', padding:10,}}
        onPress={getImageFromFirebase}
        >
            <Text style={{fontWeight:'700', color:'white'}}>Get Image</Text>
        </TouchableOpacity>
        */}

        <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
            <Image style={[styles.thumbnail]} source={{uri: image.url}}/>
            {/* <Image style={[styles.thumbnail, {backgroundColor:'blue'}]} source={{uri: imgfirebase.url}}/> */}
        </View> 
        
        <View style={{marginTop:20,justifyContent:'center',alignItems:'center', width:'60%'}}>
            <TouchableOpacity
            onPress={() => navigateTo("Login")}
            style={
                {width:'100%',padding:15,borderRadius:60,alignItems:'center',backgroundColor:'#2D90FA'}
                }
            >
                <Text style={{color:'white',fontWeight:'700',fontSize:16,}}>Skip</Text>
            </TouchableOpacity>
        </View>

    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    },
    thumbnail:{
        width:300,
        height:300,
        borderRadius:400,
        // resizeMode:'contain',
        // overflow:'hidden',
        // borderColor:'red',
        // borderWidth:2,
    },
});
