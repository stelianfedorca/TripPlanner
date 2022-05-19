import { FlatList, StyleSheet, Text, View, Image, ActivityIndicator, SafeAreaView, Animated} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { render } from 'react-dom';
import { TouchableOpacity } from 'react-native';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import { selectPlace } from '../../redux/reducers/placeReducer';
import { useSelector } from 'react-redux';
import 'react-native-get-random-values'
import InfoScreen from './PlaceDetailsScreen';
import RBSheet from "react-native-raw-bottom-sheet";
import HeaderOverview from './HeaderOverview';
import RecommendScreen from './RecommendScreen'
import TopBarOverview from '../TopTabs/TopBarOverview';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, uploadString } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {PLACE_API_KEY} from '@env';

const OverviewScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [imageSource, setImageSource] = useState('');
    
    const [photoReference, setPhotoReference] = useState('');
    
    // using the hook to access the redux store's state. ('place' in our case)
    const place = useSelector(selectPlace);

    const navigateToInfo = () => {
        navigation.navigate('Info',{
            attractionSelected: title,
        });
    }

    // the returned object will persist for the full lifetime of component
    const refRBSheet  = useRef();
    const Item = ({title}) => (
            <TouchableOpacity style={styles.item} onPress={navigateToInfo}>
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
        );
    

    // get photo_reference from Find Places API
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

    const getPhoto = async () => {
      
        var config = {
          method: 'get',
          url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${PLACE_API_KEY}`,
          headers: { }
        };
  
        var axios = require('axios');
  
        axios(config)
        .then(function (response) {
          setImageSource({url: response.request.responseURL});
        })
        .catch(function (error) {
          console.log(error);
        });
        
    };

  

    const addPhotoReferenceToFirestore = async () => {
        const docReference = doc(db,)
        updateDoc(docReference,data);
    }


    useEffect(() => {
         callFindPlaceApiByCity();
    },[place]);

    useEffect(() => {
        if(photoReference === '') return;
        getPhoto();
        addPhotoReferenceToFirestore();
    },[photoReference]);

    useEffect(() => {
        if(imageSource.url === undefined) return;

        setLoading(false);
    },[imageSource]);

    

   
  return (
    <SafeAreaView style={styles.container}>
    {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size="large" color="#000" />
          </View>
    ):( 
        <Animated.View style={{flex:1}}>
            <HeaderOverview image={imageSource.url} />
            <TopBarOverview/>
        </Animated.View>

    )}

    </SafeAreaView>
  )
}


export default OverviewScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'white',
    },

    item:{
        padding:20,
        marginVertical:6,
        marginHorizontal:14,
        backgroundColor:'#E8C9BB',
        borderRadius:15,
    },
    title:{
        fontSize:36,
    },
    thumbnail:{
        width:300,
        height:300,
        resizeMode:'contain',
    },
    cityImage: {
        width:'100%',
        height:200,
        // resizeMode:'contain',
        // resizeMode:'cover',
        // resizeMode:'stretch',
        resizeMode:'center',
    },
})