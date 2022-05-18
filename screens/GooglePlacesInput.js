import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useState, useEffect} from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import { setPlace, selectPlace} from '../redux/reducers/placeReducer';
import { selectEmail, selectUid} from '../redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import {doc, getDoc, updateDoc, collection, setDoc, addDoc} from 'firebase/firestore';
import {auth, db} from '../firebase';
import { selectIsNewTripAdded, setIsNewTripAdded } from '../redux/reducers/tripReducer';
import { selectPlaceSearched, setPlaceSearched } from '../redux/reducers/searchReducer';
import { AntDesign } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import {PLACE_API_KEY} from "@env";

const GooglePlacesInput = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [photoReference, setPhotoReference] = useState('');
    const [isNewTrip, setIsNewTrip] = useState(false);

    const dispatch = useDispatch();

    const place = useSelector(selectPlace); 
    const uid = useSelector(selectUid);
    const isNewTripAdded = useSelector(selectIsNewTripAdded);


    const placeSearched = useSelector(selectPlaceSearched);
    

    const addTripToUser = async () => {
      const tripData = {
        place: `${place}`,
        title: `Trip to ${place}`,
        image: `${place}_image`,
        imageReference: `${photoReference}`,
      };

      // get the reference to subcollection
      // if it's not created yet, create it
      const subCollRef = collection(db,`users/${uid}/trip_plans`);

      // add the doc inside the subcollection
      addDoc(subCollRef, tripData);
    };

    const callFindPlaceApiByCity = async () => {
      var config = {
          method: 'get',
          url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${place}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cphotos&key=${PLACE_API_KEY}`,
          headers: { }
        };
        
          axios(config)
          .then(function (response) {
          setPhotoReference(response.data.candidates[0].photos[0].photo_reference);
      })
        .catch(function (error) {
          console.log("The error is: ", error);
        });
  };

  const generatePlan2 = async () => {
    dispatch(setPlace(placeSearched));
}


    const generatePlan = async () => {
        dispatch(setPlace(placeSearched));
    }


    const goBack = () => {
      dispatch(setPlaceSearched(''));
      navigation.goBack();
    }

    useEffect(() => {
      if(isNewTrip === true) {
          dispatch(setPlaceSearched(''));
          navigation.replace('Overview');
          setIsNewTrip(false);
      }
    },[isNewTrip]);

    useEffect(() => {
      if(place === placeSearched){
        callFindPlaceApiByCity();
      } else {
        return ;
      }
    },[place]);

    useEffect(() => {
      if(photoReference === '') {
        return ;
      }else {
        addTripToUser();
        dispatch(setIsNewTripAdded(true));
        setIsNewTrip(true);
      }
    },[photoReference]);

    const displaySearchScreen = () => {
      navigation.navigate('Search');
    }

  

  return (
      <View style={styles.container}>
      {
        isLoading ? (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <ActivityIndicator size="large" color="#000" />
            </View>
        ): (
          
            <>
                <View style={styles.firstHalf}>
                  <View style={styles.header}>
                      <Text style={{fontWeight:'bold', fontSize:28,}}>Plan a new trip</Text>
                      <Text style={{fontSize:22, textAlign:'center', color:'#9C9A9A'}}>
                        Build an itinerary and map out your upcoming travel plans
                      </Text>
                  </View>
                  <TouchableOpacity style={styles.searchContainer} onPress={displaySearchScreen}>
                      <Text style={{fontWeight:'bold'}}>Where to?  </Text>
                      <Text style={{color:'#5B5B5B', fontWeight:'500'}}>{placeSearched === (undefined || '') ? 'e.g., Paris,Hawaii, Japan': placeSearched}</Text>
                  </TouchableOpacity>
                </View>
                  <TouchableOpacity style={styles.back} onPress={goBack}>
                    <AntDesign name="closecircle" size={32} color="grey" />
                  </TouchableOpacity>
                
              <View style={styles.submitButtonContainer}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={generatePlan2}
                    >
                    <Text style={styles.submitText}>Start planning</Text>
                </TouchableOpacity>
              </View>
            </>
          )    
      }
        
      </View>
   
  );
};

export default GooglePlacesInput

const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'white'
      // borderWidth:2,
      // borderColor:'red',
    },
    firstHalf:{
      flex:2,
      justifyContent:'center',
      alignItems:'center',
      justifyContent:'space-evenly',      
      
      // borderWidth:3,
      // borderColor:'blue',
    },
    header:{
      flex:1,
      // borderWidth:4,
      // borderColor:'green',
      justifyContent:'center',
      alignItems:'center',
    },
    searchContainer:{
        
        alignItems:'flex-start',
        flexDirection:'row',
        padding:20,
        paddingLeft:10,
        width:'85%',
        borderRadius:10,
        borderWidth:0.5,
        borderColor:'grey'

    },
    submitButtonContainer:{
      alignItems:'center',
      flex:2,
      // borderWidth:3,
      // borderColor:'purple',
    },
    submitButton:{
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,
        backgroundColor:'#F35B14',
        paddingHorizontal:15,
        paddingVertical:20,
        marginTop:25,
      },
      submitText:{
        color:'white',
        fontSize:16,
        fontWeight:'700',
      },
      back:{
        position:'absolute',
        left:30,
        top:50,
      }
})