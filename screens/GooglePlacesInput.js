import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import { setPlace, selectPlace} from '../redux/reducers/placeReducer';
import { selectEmail } from '../redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import {doc, getDoc, updateDoc, collection, setDoc, addDoc} from 'firebase/firestore';
import {auth, db} from '../firebase';

const GooglePlacesInput = ({navigation}) => {
    const [places, setPlaces] = useState([]);
    // const [placeSearched, setPlaceSearched] = useState(null);

    const dispatch = useDispatch();
    const place = useSelector(selectPlace); 
    const email = useSelector(selectEmail);

    const addTripToUser = async () => {
      const tripData = {
        place: `${place}`,
        title: `Trip to ${place}`,
        image: `${place}_image`,
      };

      // get the reference to subcollection
      // if it's not created yet, create it
      const subCollRef = collection(db,`users/${email}/trip_plans`);

      // add the doc inside the subcollection
      await addDoc(subCollRef, tripData);
    }

    const generatePlan = () => {
      // add the trip_plan to user subcollection
        addTripToUser();
        navigation.replace('Overview');
    }

    // In this function I set the place into store using Redux
    const setData = (data) => {
        const place = data.terms[0].value;
        dispatch(setPlace(place));
    }

  return (
      <View style={{flex:1, paddingTop:35, marginTop:30}}>
        <GooglePlacesAutocomplete
                placeholder='search'
                onPress={setData}
                query={{
                    key:'AIzaSyBK5lXWrezjxCJnfSmVfukDVzivZbcNFT4',
                    language:'en',
                }}
                

        />

        <TouchableOpacity
            style={styles.submitButton}
            onPress={generatePlan}
            >
            <Text style={styles.submitText}>Start planning</Text>
            </TouchableOpacity>
        
      </View>
   
  );
};

export default GooglePlacesInput

const styles = StyleSheet.create({
    submitButton:{
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
        backgroundColor:'#D65316',
        paddingHorizontal:15,
        paddingVertical:15,
        marginTop:25,
      },
      submitText:{
        color:'white',
        fontSize:16,
        fontWeight:'700',
      },
})