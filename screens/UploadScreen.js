import { StyleSheet, Text, View, Button, Image, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { selectUid, setImageUrl } from '../redux/reducers/userReducer';
import { setIsFirstSignIn } from '../redux/reducers/authReducer';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, IconButton } from 'react-native-paper';
const UploadScreen = ({navigation}) => {
    const [image, setImage] = useState('');
    // const [email, setEmail] = useState('');
    // const [name, setName] = useState('');
    // const [imgfirebase, setImgfirebase] = useState('');
    // const [imagename, setImagename] = useState('');

    // different approach
    const [pickImageResult, setPickImageResult] = useState('');
    const [downloadedImage, setDownloadedImage] = useState('');
    const [file, setFile] = useState('');
    const [fileReference, setFileReference] = useState('');

    const uid = useSelector(selectUid);

    const dispatch = useDispatch();


    const navigateTo = (screen) => {
        navigation.navigate(screen);
    }

    const updateUserWithPhoto = async (filename) => {
        const docRef = doc(db,'users',email)
        

        const data = {
            postImage: filename,
        }

        await updateDoc(docRef,data);
    };

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
    };

 

    const updateUserWithPhoto2 = async () => {
        const docRef = doc(db,'users',email)
        
        console.log("Filename: ",file);

        const data = {
            image: file,
        }

        await updateDoc(docRef,data);
    };

    async function uploadImageToFirebase2(){
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

        // We're done with the blob, close and release it
        blob.close();

        // setFile(filename);
        setFileReference(fileRef);
        
    };

    const chooseImage = async () => {
        const requestResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(requestResult.granted === false){
            alert("Permision to access camera roll is required");
            return ;
        }

        // permission granted
        let response = await ImagePicker.launchImageLibraryAsync();

        if(response === true){
            return ;
        }

        setPickImageResult(response);

        // // add the image name to current user
        // await updateUserWithPhoto();
    };

    
    // different approach
    useEffect(() => {
        if(pickImageResult.uri === undefined) return ;

        // if the user has picked an image
        uploadImageToFirebase2();

        
    },[pickImageResult]);

    useEffect(() => {
        if(fileReference === '') return ;

        // download the url from storage
        getDownloadURL(fileReference)
            .then((response) => {
                // set the image to display
                setImage({url: response});
                setDownloadedImage(response);
            })
    },[fileReference]);

     // 1. Adaug imaginea url in documentul asociat cu utilizatorul curent
     // 2. adaug imaginea url in campul din redux 

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
                return;
            }
        });

        
        return () => unsubscribe();
    },[downloadedImage]);

    const finishAccountSetUp = () => {
        dispatch(setIsFirstSignIn(false));
    }


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
    };

  return (
    <View style={styles.container}>
        <View style={{justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontWeight:'bold', fontSize:26}}>Finish setting up the account</Text>
            <Text style={{fontWeight:'bold',fontSize:22, color:'grey'}}>Choose a photo</Text>
        </View>

        <View style={{flexDirection:'row'}}>
        {
            image.url ? (
                <>
                <Image style={[styles.thumbnail]} source={{uri: image.url}}/>
                <IconButton
                        icon="camera"
                        color={Colors.black}
                        size={40}
                        onPress={chooseImage}
                        style={styles.chooseImage}
                    />
                </>
            ): (
                <>
                <TouchableOpacity onPress={chooseImage}>
                    <Ionicons name="md-add-circle-sharp" size={100} color="grey" />
                </TouchableOpacity>
                </>
            )
        } 
        </View> 
        
        <View style={{marginTop:20,justifyContent:'center',alignItems:'center', width:'60%'}}>
            <TouchableOpacity
            onPress={finishAccountSetUp}
            style={
                {width:'100%',padding:15,borderRadius:60,alignItems:'center',backgroundColor:'#2D90FA'}
                }
            >
                <Text style={{color:'white',fontWeight:'700',fontSize:16,}}>Finish</Text>
            </TouchableOpacity>
        </View>

    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-evenly',
        alignItems:'center',
        backgroundColor:'white',
      
    },
    thumbnail:{
        width:200,
        height:200,
        borderRadius:250,
        
       
    },
    chooseImgBtn:{
        marginBottom:15,
        backgroundColor:'purple', 
        padding:10,
        borderRadius:10,
    },
    chooseImage:{
        position:'absolute',
        bottom:1,
        right:4,
        backgroundColor:'white',
    }
});
