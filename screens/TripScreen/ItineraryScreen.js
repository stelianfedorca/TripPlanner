import { StyleSheet, Text, View, Animated, SafeAreaView, FlatList, TouchableOpacity} from 'react-native'
import React, { useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
const ItineraryScreen = () => {

  const date = [
    {
      id: 1,
      day: "Thu, May 5th",
    },
    {
      id: 2,
      day: "Fri, May 6th",
    },
    {
      id:3,
      day: "Sat, May 7th"
    },
    {
      id:4,
      day: "Sun, May 8th",
    },
    {
      id:5,
      day: "Mon, May 9th"
    }
  
  ];
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