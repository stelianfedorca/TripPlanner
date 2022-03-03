import { View, Text, StyleSheet, Image, TouchableOpacity, Button} from 'react-native';
import React, { useEffect, useState } from 'react';
import {auth, db} from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { getStream } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { selectName, selectEmail } from '../redux/reducers/userReducer';
import { selectPlace } from '../redux/reducers/placeReducer';
import { useDispatch } from 'react-redux';
import { setPlace } from '../redux/reducers/placeReducer';

export default function AccountScreen({navigation}) {

  const name = useSelector(selectName);
  const email = useSelector(selectEmail);
  const p = useSelector(selectPlace);

  console.log("Place: ",p);
  console.log(email);

  const dispatch = useDispatch();
  // const navigation = useNavigation();

  // useEffect(async () => {
  //   console.log("useffect called from account screen..");
  //   // get the reference of a single document (user's email)
  //   const docRef = doc(db,'users',auth.currentUser?.email);

  //   // get the document associated with the reference
  //   const docSnapshot = await getDoc(docRef);

  //   if(docSnapshot.exists()){
  //     setFullName(docSnapshot.data().name);
  //     // console.log("Image url: ", docSnapshot.data().photo);
  //   }else{
  //     console.log("No such document!");
  //   }

  //   // console.log("Image url: ", docSnapshot.data().photo);

  // },[]);

  const handleSignOut = () => {
    auth.signOut()
    .then(() => {
      navigation.replace("Login");
    })  
    .catch(error => alert(error.message));

  };

  const showUserDetails = () => {
    console.log("Full name: " + name);
    console.log("Email: " + email);
  }

  const blabla = () => {
    dispatch(setPlace('Paris!!'));
  }

  const getImage = async () => {
    const docRef = doc(db,'users',auth.currentUser?.email);

    // get the document associated with the reference
    const docSnapshot = await getDoc(docRef);

    setImage(docSnapshot.data().photo);
    console.log("img: ", image);
  }
  
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text>Email: {email}</Text>
      <Text>Full Name: {name}</Text>

      {/* <Image 
      style={[styles.thumbnail, {marginTop:30}]}
      source={{uri: image}}/> */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
         style={styles.buttonSignOut}
         onPress={handleSignOut}
         >
          <Text style={styles.buttonSignOutText}>Sign out</Text>
        </TouchableOpacity> 
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
         style={styles.buttonSignOut}
         onPress={showUserDetails}
         >
          <Text style={styles.buttonSignOutText}>Show Details</Text>
        </TouchableOpacity> 
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
         style={styles.buttonSignOut}
         onPress={blabla}
         >
          <Text style={styles.buttonSignOutText}>badasddsas</Text>
        </TouchableOpacity> 
      </View>

      {/* <Button title="get image" onPress={getImage}/> */}

    </View>
  );
 
}

const styles = StyleSheet.create({
  thumbnail:{
    width: 150,
    height: 150,
    resizeMode:'contain',
  },
  buttonContainer:{
    width:'80%',
    justifyContent:'center',
    alignItems:'center',
    marginTop:30,
  },
buttonSignOut:{
  width:'100%',
  backgroundColor:'orange',
  borderRadius:15,
  alignItems:'center',
  padding:10,

  // shadow/elevation
  // Android
  elevation:5,

  // IOS
  shadowOpacity:0.3,

},
buttonSignOutText:{
  fontSize:16,
  fontWeight:'700',
  color:'white',
},
});
