import { StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native'
import React, {useEffect, useState,useRef} from 'react';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const InfoScreen = ({route,navigation}) => {
  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState('');
  const [rating, setRating] = useState('');

  const [placeId, setPlaceId] = useState('');
  const [photoReference, setPhotoReference] = useState('');

  const {attractionSelected} = route.params;

  // const attractionSelected = '';

  // const {bottomSheet, attractionSelected} = {bottomSheetProps, attractionSelectedProps};

  const apiKey = 'AIzaSyBK5lXWrezjxCJnfSmVfukDVzivZbcNFT4';

  // const navigation = useNavigation();

  const setLoadingAfterTimeOut = async () => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }

  const callFindPlaceApiByCity = () => {

    axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${attractionSelected}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cphotos&key=${apiKey}`
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
    // var config = {
    //     method: 'get',
    //     url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${attractionSelected}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cphotos&key=${apiKey}`,
    //     headers: { }
    //   };
      
    //     axios(config)
    //     .then(function (response) {
    //       console.log(response.data);
    //       setRating(response.data.candidates[0].rating);
    //       setPhotoReference(response.data.candidates[0].photos[0].photo_reference);
    //       setPlaceId(response.data.candidates[0].place_id);
          
    //       console.log("The rating is: " + rating);
    //       console.log("The photo reference is: " + photoReference);
    //       console.log("The place id is: " + placeId);
          
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //   });
    };
    
    const getPhoto = () => {
      
      var config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`,
        headers: { }
      };

      var axios = require('axios');

      axios(config)
      .then(function (response) {
        setLoadingAfterTimeOut();
        setImageSource({url: response.request.responseURL});
      })
      .catch(function (error) {
        console.log(error);
      });
      
  };

  useEffect(() => {
    if(attractionSelected === '') return ;
    callFindPlaceApiByCity();
  },[attractionSelected]);

  
  useEffect(() => {
    if(photoReference === '') return ;

    getPhoto();
    
  },[photoReference]);


  return (
        <View style={styles.container}>
        {loading ? (
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size="large" color="#000" />
          </View>
        ): (
          <>
            <Image source={{uri: imageSource.url}} style={styles.thumbnail}/>
            <Text style={styles.text} >Title: {attractionSelected}</Text>
            <Text style={styles.text} >Rating: {rating}</Text>
            <Text>Hello world</Text>
          </>
        )}
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
  }

})