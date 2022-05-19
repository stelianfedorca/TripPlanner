import { StyleSheet, Text, View,Image, TouchableOpacity} from 'react-native'
import React, {useEffect, useState,useRef} from 'react';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectUid } from '../../redux/reducers/userReducer';
import { selectPlaceId } from '../../redux/reducers/placeReducer';
import {PLACE_API_KEY} from '@env'

const InfoScreen = ({route,navigation}) => {
  const {attractionSelected, photoUrl} = route.params;
  const uid = useSelector(selectUid);
  const tripId = useSelector(selectPlaceId);

  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState('');
  const [rating, setRating] = useState('');

  const [placeId, setPlaceId] = useState('');
  const [photoReference, setPhotoReference] = useState('');

  const setLoadingAfterTimeOut = async () => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }

  // get info from place api using an tourist attraction
  const callFindPlaceApiByAttractionSelected = () => {

    axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${attractionSelected}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cphotos&key=${PLACE_API_KEY}`
    ).then(function(response){
          setRating(response.data.candidates[0].rating);
          setPhotoReference(response.data.candidates[0].photos[0].photo_reference);
          setPlaceId(response.data.candidates[0].place_id);
          
          // console.log("The rating is: " + rating);
          // console.log("The photo reference is: " + photoReference);
          // console.log("The place id is: " + placeId);
          
    })
    .catch(function (error) {
      console.log(error);
  });
};


  const addToTrip = async () => {
    const attractionData = {
      attraction: attractionSelected,
      image: photoUrl,
    };

    // get the reference to subcollection
    // if it's not created yet, create it
    const subCollRef = collection(db,`users/${uid}/trip_plans/${tripId}/itinerary/`);

    // add the doc inside the subcollection
    addDoc(subCollRef, attractionData);
  }



  return (
        <View style={styles.container}>
            <Image source={{uri: photoUrl}} style={styles.thumbnail}/>
            <TouchableOpacity style={styles.addToTrip} onPress={addToTrip}>
              <Text style={styles.addToTripText}>Add to trip</Text>
            </TouchableOpacity>
        </View>

  )
}

export default InfoScreen

const styles = StyleSheet.create({
  container: {
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'white',
  },
  thumbnail:{
    width:200,
    height:200,
    resizeMode:'contain',
  },
  text:{
    fontSize:20,
    fontWeight:'500',
  },
  addToTrip:{
    backgroundColor:'#DF6810',
    padding:20,
    borderRadius:15,
  },
  addToTripText:{
    color:'white',
    fontWeight:'bold',
  }

})