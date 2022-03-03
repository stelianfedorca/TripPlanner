import { StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native'
import React, {useRef} from 'react'
import {selectPlace } from '../redux/reducers/placeReducer';
import { useSelector } from 'react-redux';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

 // This component is for testing purposes
 // - use an hardcoded place_id 
 // - use a bottom sheet component for displaying the info.
 // - using the place_id, get the details coresponding with that place (review, description, image)
 // - display the details on the screen 

 

 // Another testing
 // get title of city selected - done
 // call FindPlace api to get the 'place_id', review, photo_reference - done
 // call Place Photos api using the 'photo_reference' to get the image
 // display the details on bottom sheet

 
 const TempScreen = () => {
    const [photo, setPhoto] = useState('');
    const [rating, setRating] = useState('');


    const [placeId, setPlaceId] = useState('');
    const [photoReference, setPhotoReference] = useState('');
    
    const title = 'Jungfraujoch'; // item title 
    const api_key = 'AIzaSyBK5lXWrezjxCJnfSmVfukDVzivZbcNFT4';
    

    // // const place_id = "ChIJrRMgU7ZhLxMRxAOFkC7I8Sg"; // place_id for Colosseum
    // const photo_reference = 
    // 'Aap_uECVUvwWFwBDa_-rrWZ7fN7nOTGFKeNx8pLV1822p0HsqdgLxV9i-yAZH84yZx5bu7VbLoOhd76MHT-nwqQFuA7R5StH5suKFWsG4GlVYYSy6COWfHn8Wm_B1RB8Mvzi3bjUZLnJIZlU2xsqb4jK6cLMyhfB9142DW1M3dnbfuzQ7qkT'; // for Campidoglio
    // const place = useSelector(selectPlace);

    // const place_id_colosseum = 'ChIJrRMgU7ZhLxMRxAOFkC7I8Sg';

    

    // the returned object will persist for the full lifetime of component
    const bottomSheet = useRef();

    const showBottomSheet = () => {
        bottomSheet.current.show();
    }

    // to get 'place_id'
    const callPlaceSearchApi = () => {
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${title}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=${api_key}`,
            headers: { }
          };
          
          axios(config)
          .then(function (response) {
                console.log(response.data.candidates[0].place_id);  
                setColosseum(response.data.candidates[0].place_id);
            //   const placeId = response.data.candidates[0].place_id;
              //   setPlaceId(placeId);
        })
          .catch(function (error) {
            console.log(error);
          });
    };

    const callPlaceDetailsApi = () => {
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id_colosseum}&fields=photo_reference&key=AIzaSyBK5lXWrezjxCJnfSmVfukDVzivZbcNFT4`,
            headers: { }
          };

          var axios = require('axios');

          axios(config)
          .then(function (response) {
          console.log(response);
          })
          .catch(function (error) {
          console.log(error);
          });
    }
    
    const getPhoto = () => {

        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${api_key}`,
            headers: { }
          };

          var axios = require('axios');

          axios(config)
          .then(function (response) {
            setPhoto({url: response.request.responseURL});
          })
          .catch(function (error) {
          console.log(error);
          });
   
    }
    const callFindPlaceApiByCity = () => {
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${title}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cphotos&key=${api_key}`,
            headers: { }
          };
          
            axios(config)
            .then(function (response) {
            setRating(response.data.candidates[0].rating);
            setPhotoReference(response.data.candidates[0].photos[0].photo_reference);
            setPlaceId(response.data.candidates[0].place_id);

            console.log("The rating is: " + rating);
            console.log("The photo reference is: " + photoReference);
            console.log("The place id is: " + placeId);

        })
          .catch(function (error) {
            console.log(error);
          });
    }

    // const setProps = (response) => {
    //     setRating(response.data.candidates[0].rating);
    //     setPhotoReference(response.data.candidates[0].photos[0].photo_reference);
    //     setPlaceId(response.data.candidates[0].place_id);
    // }

    const showInfoAboutPlace = async () => {
        callFindPlaceApiByCity();
    }


    const getPlaceDetails = () => {
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name%2Crating%2Cformatted_phone_number&key=AIzaSyBK5lXWrezjxCJnfSmVfukDVzivZbcNFT4`,
            headers: { }
          };

          var axios = require('axios');

          axios(config)
          .then(function (response) {
          console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
          console.log(error);
          });

    }

    const showBottomScreen = async () => {
        await callPlaceSearchApi();
        await callPlaceDetailsApi();
    }

    useEffect(() => {
        if(photoReference === ''){
            return;
        }
        getPhoto();
    },[photoReference])

    return (
    <View style={styles.container}>
      <View>

            <TouchableOpacity style={{padding:15,paddingHorizontal:15,borderRadius:15,backgroundColor:'purple',}} onPress={showInfoAboutPlace}>
                    <Text style={{fontSize:22, fontWeight:'700', color:'white'}}>Get info about Eiffel Tower</Text>
                </TouchableOpacity> 
                
          {/* <TouchableOpacity style={{padding:15,paddingHorizontal:15,borderRadius:15,backgroundColor:'green',}} onPress={getPhoto}>
              <Text style={{fontSize:22, fontWeight:'700', color:'white'}}>call place photos</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={{padding:15,paddingHorizontal:15,borderRadius:15,backgroundColor:'red',}} onPress={callPlaceSearchApi}>
              <Text style={{fontSize:22, fontWeight:'700', color:'white'}}>search Colosseum</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={{padding:15,paddingHorizontal:15,borderRadius:15,backgroundColor:'blue',}} onPress={() => bottomSheet.current.show()}>
              <Text style={{fontSize:22, fontWeight:'700', color:'white'}}>show bottomsheet</Text>
          </TouchableOpacity> */}

          <BottomSheet hasDraggableIcon={true} ref={bottomSheet} height={450}>
                <View style={styles.container}>
                    <Image source={{uri: photo.url}} style={styles.thumbnail}/>
                </View>
          </BottomSheet>
      </View>

      <View style={styles.infoContainer} >
          <Text style={styles.infoText} >Rating: {rating}</Text>
          <Text style={styles.infoText} >Title: {title}</Text>
          <Image source={{uri: photo.url}} style={styles.thumbnail}/>
      </View>
    </View>
  )
}

export default TempScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
    },
    thumbnail:{
        width: 150,
        height: 150,
        resizeMode:'contain',
      },
      infoContainer:{
          backgroundColor:'#E8C9BB',
          justifyContent:'center',
          alignItems:'center',
          width:'100%',
          height:'50%',
      },
      infoText:{
          fontSize:22,
          fontWeight:'500',
      }
})