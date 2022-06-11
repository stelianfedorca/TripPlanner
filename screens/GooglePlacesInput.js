import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useState, useEffect} from 'react'
import axios from 'axios';
import { setPlace, selectPlace, setPlaceId} from '../redux/reducers/placeReducer';
import { selectEmail, selectUid} from '../redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import {doc, getDoc, updateDoc, collection, setDoc, addDoc} from 'firebase/firestore';
import {auth, db} from '../firebase';
import { selectIsNewTripAdded, setIsNewTripAdded, setStartDate, setEndDate} from '../redux/reducers/tripReducer';
import { selectPlaceSearched, setPlaceSearched } from '../redux/reducers/searchReducer';
import { AntDesign } from '@expo/vector-icons';
import {PLACE_API_KEY} from "@env";
import CalendarPicker from 'react-native-calendar-picker';

const GooglePlacesInput = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [photoReference, setPhotoReference] = useState('');
    const [isNewTrip, setIsNewTrip] = useState(false);
    const [startDate, selectStartDate] = useState("");
    const [endDate, selectEndDate] = useState("");
    const [openCalendar, setOpenCalendar] = useState(false);
    const minDate = new Date();
    const maxDate = new Date(2023, 6, 3);

    const dispatch = useDispatch();

    const place = useSelector(selectPlace); 
    const uid = useSelector(selectUid);


    const placeSearched = useSelector(selectPlaceSearched);
    

    const addTripToUser = async () => {
      const tripData = {
        place: `${place}`,
        title: `Trip to ${place}`,
        image: `${place}_image`,
        imageReference: `${photoReference}`,
        startDate: startDate.toString(),
        endDate: endDate.toString(),
      };

      // get the reference to subcollection
      // if it's not created yet, create it
      const subCollRef = collection(db,`users/${uid}/trip_plans`);

      // add the doc inside the subcollection
      const docRef = await addDoc(subCollRef, tripData);
      dispatch(setPlaceId(docRef.id));
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

  const generatePlan = async () => {
    console.log()
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

    const displayCalendar = () => {
      setOpenCalendar(true);
    }

    const onDateChange = (date, type) => {
      if(type === 'END_DATE'){
        console.log(date);
        selectEndDate(date);
        dispatch(setEndDate(date));
      } else {
        console.log(date);
        selectStartDate(date);
        selectEndDate("");
        dispatch(setStartDate(date));
        dispatch(setEndDate(""));
      }
    }

    useEffect(() => {
      if(startDate){
        dispatch(setStartDate(startDate));
      }
    },[startDate]);

    useEffect(() => {
      if(endDate){
        dispatch(setEndDate(endDate));
      }
    },[endDate])

    const saveDate = () => {
      setOpenCalendar(false);
    }

  

  return (
      <View style={styles.container}>
      {
        openCalendar ? (
            <View style={styles.calendar}>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={minDate}
                maxDate={maxDate}
                todayBackgroundColor="#f2e6ff"
                selectedDayColor="#7300e6"
                selectedDayTextColor="#FFFFFF"
                onDateChange={onDateChange}
              />
              <TouchableOpacity style={styles.saveDate} onPress={saveDate}>
                <Text style={{color:'white'}}>Save</Text>
              </TouchableOpacity>
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
                
              <View style={styles.submitContainer}>

                  <TouchableOpacity style={styles.searchContainer} onPress={displaySearchScreen}>
                      <Text style={{fontWeight:'bold'}}>Where to?  </Text>
                      <Text style={{color:'#464545', fontWeight:'500'}}>{placeSearched === (undefined || '') ? 'e.g., Paris, Valencia, California': placeSearched}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.calendarContainer} onPress={displayCalendar}>
                      <Text style={{color:'black', fontWeight:'bold', marginRight:15,}}>Dates</Text>
                      <Text style={{color:'#464545', fontWeight:'500', marginRight:15,}}>
                      {
                        startDate ? (`${startDate.toString().split(' ')[1]} ${startDate.toString().split(' ')[2]}`):(
                          <>
                          <AntDesign name="calendar" size={20} color="#5B5B5B"/> 
                          <Text>Start date</Text>
                          </>
                        ) 
                      }
                      </Text>

                      <Text style={{color:'#464545', fontWeight:'500'}}>
                      {
                        startDate ? (`${endDate.toString().split(' ')[1]} ${endDate.toString().split(' ')[2]}`):(
                          <>
                          <AntDesign name="calendar" size={20} color="#5B5B5B"/> 
                          <Text>End date</Text>
                          </>
                        ) 
                      }
                      </Text>
                  </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={generatePlan}>
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
    calendarContainer:{
      alignItems:'center',
      flexDirection:'row',
      padding:20,
      paddingLeft:10,
      width:'85%',
      borderRadius:10,
      borderWidth:0.5,
      borderColor:'grey',
      marginTop:15,
  },
    submitContainer:{
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
      },
      calendar:{
        flex:1, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:'white'
      },
      saveDate:{
        backgroundColor:'purple',
        borderRadius:15,
        padding:10,
        paddingHorizontal:30,
      }
      
})