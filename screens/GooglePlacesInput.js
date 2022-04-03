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
const GooglePlacesInput = ({navigation}) => {
    const dispatch = useDispatch();

    const place = useSelector(selectPlace); 
    const uid = useSelector(selectUid);
    const isNewTripAdded = useSelector(selectIsNewTripAdded);

    const [isLoading, setIsLoading] = useState(false);
    const [isSearchScreen, setIsSearchScreen] = useState(false);

    const placeSearched = useSelector(selectPlaceSearched);
    console.log("PlaceSearched: ", placeSearched);

    const addTripToUser = async () => {
      // setIsLoading(true);

      const tripData = {
        place: `${place}`,
        title: `Trip to ${place}`,
        image: `${place}_image`,
      };

      // get the reference to subcollection
      // if it's not created yet, create it
      const subCollRef = collection(db,`users/${uid}/trip_plans`);

      // add the doc inside the subcollection
      await addDoc(subCollRef, tripData);

      dispatch(setIsNewTripAdded(true));
    }

    const generatePlan = async () => {
      // add the Trip Plan to user subcollection
        await addTripToUser();
    }

    // In this function I set the place into store using Redux
    const setData = (data) => {
        const place = data.terms[0].value;
        dispatch(setPlace(place));
        setIsSearchScreen(false);
    };

    const goBack = () => {
      dispatch(setPlaceSearched(''));
      navigation.goBack();
    }

    useEffect(() => {
      if(isNewTripAdded === true) {
          navigation.replace('Overview');
      }
    },[isNewTripAdded]);

    const displaySearchScreen = () => {
      navigation.navigate('Search');
      // setIsSearchScreen(true);
    }

  

  return (
      <View style={styles.container}>
      {
        isLoading ? (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <ActivityIndicator size="large" color="#000" />
            </View>
        ): (
          isSearchScreen ? (
            <>
              
            </>
            

          ): (
            <>
                <View style={styles.firstHalf}>
                  <View style={styles.header}>
                      <Text style={{fontWeight:'bold', fontSize:28,}}>Plan a new trip</Text>
                      <Text style={{fontSize:22, textAlign:'center'}}>
                        Build an itinerary and map out your upcoming travel plans
                      </Text>
                  </View>
                  <TouchableOpacity style={styles.searchContainer} onPress={displaySearchScreen}>
                      <Text style={{fontWeight:'bold'}}>Where to?  </Text>
                      <Text style={{color:'#999797', fontWeight:'100'}}>{placeSearched === (undefined || '') ? 'e.g., Paris,Hawaii, Japan': placeSearched}</Text>
                  </TouchableOpacity>
                </View>
                  <TouchableOpacity style={styles.back} onPress={goBack}>
                    <AntDesign name="closecircle" size={32} color="grey" />
                  </TouchableOpacity>
                
              <View style={styles.submitButtonContainer}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={generatePlan}
                    >
                    <Text style={styles.submitText}>Start planning</Text>
                </TouchableOpacity>
              </View>
            </>
          )


        )
      }
        
      </View>
   
  );
};

export default GooglePlacesInput

const styles = StyleSheet.create({
    container:{
      flex:1,
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