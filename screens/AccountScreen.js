import { View, Text, StyleSheet, Image, TouchableOpacity, Button} from 'react-native';
import React, { useEffect, useState } from 'react';
import {auth, db} from '../firebase';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { doc, getDoc, getDocs, collection} from 'firebase/firestore';
import { getDownloadURL, getStream } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { selectFullname, selectEmail } from '../redux/reducers/userReducer';
import { selectPlace } from '../redux/reducers/placeReducer';
import { useDispatch } from 'react-redux';
import { setPlace } from '../redux/reducers/placeReducer';

import { getStorage, ref } from 'firebase/storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PlansScreen from './TopTabs/PlansScreen';
import GuidesScreen from './TopTabs/GuidesScreen';
import TopBar from '../components/TopBar';
import AccountInfo from '../components/AccountInfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';


export default function AccountScreen({navigation}) {
  const name = useSelector(selectFullname);
  const email = useSelector(selectEmail);

  const [image, setImage] = useState('');
  const [imageFromStorage, setImageFromStorage] = useState('');

  const p = useSelector(selectPlace);

  // firebase storage instance
  const storage = getStorage();

  const dispatch = useDispatch();


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

  const getImage = async () => {
    const docRef = doc(db,'users',email);

    // get the document associated with the reference
    const docSnapshot = await getDoc(docRef);

    setImage(docSnapshot.data().image); // image name that will be used to get the image url from storage
  }; 

  const getUserPlans = async () => {
    const querySnapshot = await getDocs(collection(db,'users',email,'trip_plans'));

    querySnapshot.docs.map((doc) => {
      console.log(doc.data().title);
    })
  }

 
  // fetch image from storage and store it in a variable
  useEffect(() => {
    if(image === '') return ;

    // storage reference for the specified path
    const pathReference = ref(storage,`${image}`);

    getDownloadURL(pathReference)
      .then((url) => {
          setImageFromStorage({url: url});        
      });

  },[image]);
  
  // View or SafeAreView
  return (
    <>
      <AccountInfo/>
      <TopBar/>
    </>
    // // <View style={{flex:1,backgroundColor:'white'}}>
    // {/* </View> */}
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
