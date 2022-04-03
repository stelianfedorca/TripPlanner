import { FlatList, StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { render } from 'react-dom';
import { TouchableOpacity } from 'react-native';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import { selectPlace } from '../../redux/reducers/placeReducer';
import { useSelector } from 'react-redux';
import 'react-native-get-random-values'
import { v4 as uuidv4} from 'uuid';
import InfoScreen from '../../components/InfoScreen';
import RBSheet from "react-native-raw-bottom-sheet";
import HeaderCustom from '../../screens/HeaderCustom';
import RecommendScreen from '../RecommendScreen';
import TopBarOverview from '../../components/TopBarOverview';


const OverviewScreen = ({navigation}) => {
    const [loading, setLoading] = useState(true);

    const [attractions, setAttractions] = useState([]);
    const [imageSource, setImageSource] = useState('');
    
    const [photoReference, setPhotoReference] = useState('');
    
    
    const apiKey = 'AIzaSyBK5lXWrezjxCJnfSmVfukDVzivZbcNFT4';
    
    
    // using the hook to access the redux store's state. ('place' in our case)
    const place = useSelector(selectPlace);

    // console.log(place);

    // the returned object will persist for the full lifetime of component
    const refRBSheet  = useRef();
    const Item = ({title}) => (
            <TouchableOpacity style={styles.item} onPress={() => {
                // setAttractionSelected(title); 
                navigation.navigate('Info',{
                    attractionSelected: title,
                });
                }}>
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
        );
    
    const renderItem = ({item}) => {
        return (
            <Item title={item}/>
        )
    }
    
    // get attractions based on the city
    const getDataFromPlace = async () => {
        // console.log(data);
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=attractions%20in%20${place}&key=${apiKey}`,
            headers: { }
          };
          
          axios(config)
          .then(function (response) {
              const attractions = [];

              for(var i =0 ; i<response.data.results.length; i++){
                  attractions.push(response.data.results[i].name);
              }
              
              setAttractions(attractions);
          })
          .catch(function (error) {
            console.log(error);
          });
    };

    // get photo_reference from Find Places API
    const callFindPlaceApiByCity = async () => {
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${place}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cphotos&key=${apiKey}`,
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
          url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${apiKey}`,
          headers: { }
        };
  
        var axios = require('axios');
  
        axios(config)
        .then(function (response) {
          // setLoadingAfterTimeOut();
          setImageSource({url: response.request.responseURL});
        })
        .catch(function (error) {
          console.log(error);
        });
        
    };

    useEffect(() => {
        //  getDataFromPlace();
         callFindPlaceApiByCity();
    },[place]);

    // useEffect(() => {
    //     if(attractions.length === 0) return;

    //     setLoading(false);
    // },[attractions]);

    useEffect(() => {
        if(photoReference === '') return;
        getPhoto();
    },[photoReference]);

    useEffect(() => {
        if(imageSource.url === undefined) return;
        setLoading(false);
    },[imageSource]);

   
  return (
    <View style={styles.container}>
    {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size="large" color="#000" />
          </View>
    ):( 
        <View style={{flex:1}}>
            <HeaderCustom image={imageSource.url} />
            <TopBarOverview/>
        </View>

    )}

    </View>
  )
}


export default OverviewScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        // justifyContent:'center', 
        // alignItems:'center', 
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