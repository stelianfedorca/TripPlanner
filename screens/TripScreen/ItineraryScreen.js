import { StyleSheet, Text, View, Animated, SafeAreaView, FlatList, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectEndDate, selectStartDate } from '../../redux/reducers/tripReducer';
import { useFocusEffect } from '@react-navigation/native';
import { selectPlaceId } from '../../redux/reducers/placeReducer';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { selectUid } from '../../redux/reducers/userReducer';

const ItineraryScreen = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const placeId = useSelector(selectPlaceId);
  const userId = useSelector(selectUid);

  const date = [
    {
      id: 1,
      day: "Fri, May 20th",
    },
    {
      id: 2,
      day: "Sat, May 21st",
    },
    {
      id:3,
      day: "Sun, May 22th"
    },
    {
      id:4,
      day: "Mon, May 23th",
    },
    {
      id:5,
      day: "Tue, May 24th"
    }
  
  ];

  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const Item = ({item}) => {
    const {day} = item; 
    return (
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemInfo}>{day}</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" style={{marginLeft:10}}/>
      </TouchableOpacity>
    )
  }

  const renderItem = ({item}) => (
    <Item item={item}/>
  );
  
  const separator = () => (
    <View style={styles.separator}/>
  )
    

  // fetch all the trips 
  useEffect(() => {
    
    const fetchItineraryData = async () => {

    }

  },[]);

  // useEffect(() => {
  //   if(startDate !== "" && endDate !== ""){
  //     const startDateValue = startDate.toString().split(' ')[1]; // jun
  //     const startMonth = (monthNames.indexOf(startDateValue)+1);
  //     const startDay = startDate.toString().split(' ')[2]; // 10
  //     console.log("start Day: ", startDay);
  //     const startingDate = new Date(2022,startMonth-1,startDay+1);
  //     console.log("Starting date: ", startingDate);
      
  //     var date1 = new Date(2011, 6, 30);
  //     var date2 = new Date(2011, 7, 3);
  
  //     var oneDay = 1000*60*60*24; //Get 1 day in milliseconds
  
  //     var numberOfDays = Math.ceil( (date2.getTime() - date1.getTime() ) / oneDay);

  //   } else return;

  // },[startDate,endDate]);

  useFocusEffect(
    React.useCallback(() => {
      
      const fetchTripPlan = async () => {
        const docRef = doc(db,"users",userId,"trip_plans",placeId);
        const docSnap = await getDoc(docRef);
  
        if(docSnap.exists()){
          setStartDate(docSnap.data().startDate);
          setEndDate(docSnap.data().endDate);
        }else{
          console.log("Nothing");
        }
      }

      fetchTripPlan();
    },[placeId])
  );

  return (
    <SafeAreaView style={styles.container}> 
      <FlatList
        data={date}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={separator}
      />
    </SafeAreaView>
  )
}

export default ItineraryScreen

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#E5E5E5',
    flex:1,
  },
  item:{  
    backgroundColor:'white',
    padding:20,
    height:90,
    flexDirection:'row'

    // elevation:2,
  },
  itemInfo:{
    fontSize:20,
    fontWeight:'bold',
  }, 
  separator:{
    margin:5,
  }
})