import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import GooglePlacesInput from './GooglePlacesInput';
import { StackActions } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch } from 'react-redux';
import { setPlaceSearched } from '../redux/reducers/searchReducer';

const SearchScreen = ({navigation}) => {

  const dispatch = useDispatch();

  const goBack = () => {
    // const popAction = StackActions.pop(1);
    // navigation.dispatch(popAction);
    // navigation.replace('Google');
  }

   // In this function I set the place into store using Redux
   const setData = (data) => {
    // store the searched place
    const place = data.terms[0].value;
    dispatch(setPlaceSearched(place));

    // go back to Main Screen to start planning
    navigation.goBack();
};


  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
                        placeholder='Where to ?'
                        onPress={setData}
                        query={{
                            key:'AIzaSyBK5lXWrezjxCJnfSmVfukDVzivZbcNFT4',
                            language:'en',
                        }}
                        styles={{
                          container: {
                          flex:2,
                          justifyContent:'flex-start',
                          alignItems:'center',
                          marginTop:50,
                          
                        }, 
                        textInput: {
                          backgroundColor: '#E8E8E8',
                          height: 44,
                          borderRadius: 10,
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          marginHorizontal:15,
                          fontSize: 15,
                          flex: 1,
                        },
                        
                        }}
                />  
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'flex-start',
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
