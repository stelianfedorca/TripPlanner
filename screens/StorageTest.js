import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes'
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from 'firebase/storage';


const StorageTest = () => {
    const [imageSource, setImageSource] = useState('');
    const url = 'https://lh3.googleusercontent.com/places/AAcXr8p-NIQmO90JruFCTW7CoBlxHNm3g3H7n1u6gV2iF471tCpA2C9YAnpJMh4sKXQ2IwgxGca_os9MyhIiravjDVuZ6nAxBrUo9Po=s1600-w800'
   
    const uploadFile = async () => {
        // root reference to the storage
        const storage = getStorage();
        const filename = `trip_images/test_image`;

        const fileReference = ref(storage,filename);
        // Data URL string
        uploadString(fileReference, JSON.stringify(url)) 
            .then((snapshot) => {
            })

       
      
    };

    const getFile = async () => {
        const pathReference = ref(getStorage(),`trip_images/test_image`);
        getDownloadURL(pathReference)
            .then((URL) => {
            })
    }

    async function uploadImageToFirebase2(){
        const filename = `trip_images/test_image.jpg`;

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
        xhr.open("GET", url, true);
        xhr.send(null);
    });

    // a reference that points to this 'userphoto/image_name' location 
    const fileRef = ref(getStorage(), filename);
    // upload the 'blob' (the image) in the location refered by 'fileRef'
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    };

    const uploadToStorage = async () => {
        // root reference to the storage
        const storage = getStorage();
        const filename = `trip_images/test_image`;

        const fileReference = ref(storage,filename);
        // Data URL string
        uploadString(fileReference, url)
            .then((res) => {
                console.log("Done/");
            })
    };

    // useEffect(() => {
    //     if(imageSource.uri === undefined) return;


    // },[imageSource]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={uploadFile}>
          <Text>Click here </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={getFile}>
          <Text>Get</Text>
      </TouchableOpacity>
      <View>
          <Image source={{uri: url}} style={styles.thumbnail}/>
      </View>
    </View>
  )
}

export default StorageTest

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    },
    button:{
        justifyContent:'center',
        alignItems:'center',

    },
    thumbnail:{
        width:222,
        height:222,
        resizeMode:'contain',
    }
})