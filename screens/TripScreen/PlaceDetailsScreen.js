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
import { Ionicons } from '@expo/vector-icons';

const PlaceDetailsScreen = ({route,navigation}) => {
  const {attractionSelected, photoUrl} = route.params;
  const uid = useSelector(selectUid);
  const tripId = useSelector(selectPlaceId);

  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState('');
  const [rating, setRating] = useState('');

  const [placeId, setPlaceId] = useState('');
  const [photoReference, setPhotoReference] = useState('');

  useEffect(() => {
    navigation.setOptions({title: attractionSelected});
  },[]);

  useEffect(() => {
    callFindPlaceApiByAttractionSelected();
  },[]);

  useEffect(() => {
    if(rating) {
      console.log("The rating is: " + rating);
    }
  },[rating]);
 
  // get info from place api using an tourist attraction
  const callFindPlaceApiByAttractionSelected = () => {

    axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${attractionSelected}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cphotos&key=${PLACE_API_KEY}`
    ).then(function(response){
          console.log(response);
          
          
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
    const subCollRef = collection(db,`users/${uid}/trip_plans/${tripId}/itinerary`);

    // add the doc inside the subcollection
    addDoc(subCollRef, attractionData);
  };

  const goBack = () => {
    navigation.goBack();
  }



  return (
        <View style={styles.container}>

          <View style={styles.header}>
            <Image source={{uri: photoUrl}} style={styles.thumbnail}/>
            <View style={styles.overlay}/>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Ionicons name="ios-chevron-back-circle" size={50} color="white" style={{opacity:0.75}}/>
          </TouchableOpacity>

          <Text style={styles.title}>{attractionSelected}</Text>

            <TouchableOpacity style={styles.addToTrip} onPress={addToTrip}>
              <Text style={styles.addToTripText}>Add to itinerary</Text>
            </TouchableOpacity>
        </View>

  )
}

export default PlaceDetailsScreen

const styles = StyleSheet.create({
  container: {
      flex:1,
      justifyContent:'flex-start',
      alignItems:'center',
      backgroundColor:'white',
  },
  header:{
    marginBottom:5,
    width:'100%',
    
    // shadowRadius:10,
  },
  thumbnail:{
    width:'100%',
    height:300,
    resizeMode:'stretch',
  },
  backButton:{
    position:'absolute',
    left:20,
    top:50,
  },
  overlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  text:{
    fontSize:20,
    fontWeight:'500',
  },
  addToTrip:{
    backgroundColor:'#DF6810',
    padding:15,
    borderRadius:15,
  },
  addToTripText:{
    color:'white',
    fontWeight:'bold',
  },
  title:{
    fontWeight:'bold',
    fontSize:20,
    paddingTop:10,
    paddingLeft:10,
    alignSelf:'flex-start',
  }

})