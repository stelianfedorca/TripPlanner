import { StyleSheet, Text, View, Image} from 'react-native'
import React, { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useSelector } from 'react-redux'
import { selectImageUrl } from '../redux/reducers/userReducer'

const PhotoURLTest = () => {

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if(user){
                console.log(user.photoURL);
            } else {

            }
        });

        return () => unsubscribe();
    },[]);

  return (
    <View style={styles.container}>
      <Image source={{uri: imageURL}} style={styles.thumbnail}/>
    </View>
  )
}

export default PhotoURLTest

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    thumbnail: {
        width:200,
        height:200,
        resizeMode:'contain'
    }
})