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

                  <View style={styles.header}>
                      <Text style={styles.firstTitle}>Plan a new trip</Text>
                      <Text style={styles.secondTitle}>
                        Build an itinerary and map out your upcoming travel plans
                      </Text>
                  </View>
                  
                  <TouchableOpacity style={styles.back} onPress={goBack}>
                    <AntDesign name="closecircle" size={36} color="#D6D6D6" />
                  </TouchableOpacity>
                
              <View style={styles.submitButtonContainer}>
                  <TouchableOpacity style={styles.searchContainer} onPress={displaySearchScreen}>
                      <Text style={{fontWeight:'bold'}}>Where to?  </Text>
                      <Text style={{color:'#5B5B5B', fontWeight:'500'}}>{placeSearched === (undefined || '') ? 'e.g., Paris, Valencia, California': placeSearched}</Text>
                  </TouchableOpacity>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={generatePlan2}>
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
      backgroundColor:'white',
      justifyContent:'center',
    },
    firstHalf:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      justifyContent:'space-evenly',      
    },
    header:{
      flex:1,
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
        left:25,
        top:75,
      },
      firstTitle:{
        position:'absolute',
        bottom:150,
        fontSize:28,
        fontWeight:'bold' 
      },
      secondTitle:{
        position:'absolute',
        bottom:75,
        fontSize:20,
        textAlign:'center',
        color:'#484545'
      }
      
})