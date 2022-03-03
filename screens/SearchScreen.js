import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import GooglePlacesInput from './GooglePlacesInput';

const SearchScreen = () => {
  const [place, setPlace] = useState('');

  const getPlacesData = () => {
    try{
        const response = axios.get();
    }catch(error){
      console.log(error.message);
    };
  };

  const startPlanning = () => {
    // go to another screen
    console.log('start planning...');
  }


  return (
    <View style={styles.container}>
    <GooglePlacesInput/>
    
      {/* <View style={styles.inputContainer}>
        <TextInput
        style={styles.inputPlace}
        placeholder="Where to?"
        onChangeText={text => setPlace(text)}
        />

          <TouchableOpacity
          style={styles.inputCalendar}
          >
          </TouchableOpacity>
      </View>

    <TouchableOpacity
    style={styles.submitButton}
    onPress={startPlanning}
    >
      <Text style={styles.submitText}>Start planning</Text>
    </TouchableOpacity> */}

    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
  },
  inputContainer:{
    width:'80%'
  },
  inputPlace:{
    // backgroundColor:'#F5F4F4',
    borderRadius:10,
    paddingHorizontal:15,
    paddingVertical:15,
    borderWidth:1,
    borderColor:'#E1E1E1',
  },
  inputCalendar:{

  },
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
});
