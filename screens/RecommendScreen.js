import { StyleSheet, Text, View,TouchableOpacity, FlatList, Image, ActivityIndicator} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectPlace } from '../redux/reducers/placeReducer';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {v4 as uuidv4} from 'uuid';
import SkeletonContent from 'react-native-skeleton-content';


    const RecommendScreen = ({navigation}) => {
    const [attractions, setAttractions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBottomSheetLoading, setIsBottomSheetLoading] = useState(true);

    // bottom sheet state
    const [rating, setRating] = useState(null);
    const [totalRatings, setTotalRatings] = useState(null);
    const [photoReference, setPhotoReference] = useState('');
    const [image, setImage] = useState(''); 
    const [title, setTitle] = useState('');

    const place = useSelector(selectPlace);
    const apiKey = 'AIzaSyBK5lXWrezjxCJnfSmVfukDVzivZbcNFT4';


    // the returned object will persist for the full lifetime of component
    const bottomSheet = useRef();


    // const navigateTo = (screen,title) => {
    //     navigation.navigate(screen,{
    //         attractionSelected: title,
    //     });

    // };

    const getAttractionDetails = async (title) => {
        var axios = require('axios');
    
        var config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${title}&key=${apiKey}`,
        headers: { }
                
        };
    
        axios(config)
        .then(function (response) {
            setPhotoReference(response.data.results[0].photos[0].photo_reference);
            setRating(response.data.results[0].rating);
            setTotalRatings(response.data.results[0].user_ratings_total);
            setTitle(title);
        })
        .catch(function (error) {
        console.log(error);
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
          setImage({url: response.request.responseURL});
        })
        .catch(function (error) {
          console.log(error);
        });
        
    };

    useEffect(() => {
        if(photoReference === '') return;

        getPhoto();
    },[photoReference]);

    useEffect(() => {
        if(image.url === undefined) return;

        setIsBottomSheetLoading(false);
    },[image]);

    const showAttractionDetails = (title) => {
        bottomSheet.current.show();

        getAttractionDetails(title);
    }

    


    const Item = ({title, photoReference}) => {
            const [image, setImage] = useState('');
            // const [photoReference, setPhotoReference] = useState('');
            // const [isLoading, setIsLoading] = useState(true);
       
            const getPhoto = async () => {
          
                var config = {
                  method: 'get',
                  url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${apiKey}`,
                  headers: { }
                };
          
                var axios = require('axios');
          
                axios(config)
                .then(function (response) {
                  setImage({url: response.request.responseURL});
                })
                .catch(function (error) {
                  console.log(error);
                });
                
            };

            useEffect(() => {
                console.log("item");
                getPhoto();
            },[]);
    
           
            
    
            return (
                <TouchableOpacity style={styles.item} onPress={() => showAttractionDetails(title)}>
                    <Image source={{uri: image.url}} style={styles.imageItem}/>
                    <Text style={styles.itemTitle}>{title}</Text>
                    <MaterialIcons name="arrow-forward-ios" size={20} color="black" style={{alignSelf:'flex-end',flexShrink:2}}/>
                </TouchableOpacity>
            );
        };
    
    const renderItem = ({item}) => {
        console.log("renderitem");
            return (
                <Item title={item.title} photoReference={item.photoReference}/>
                );
            };

        // get attractions based on the city
    const getDataFromPlace = async () => {
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=attractions%20in%20${place}&key=${apiKey}`,
            headers: { }
          };
          
          axios(config)
          .then(function (response) {
              const attractions = [];
                try{
                    for(var i =0 ; i<response.data.results.length; i++){
                          attractions.push(
                            {
                                id: uuidv4(),
                                title: response.data.results[i].name,
                                photoReference: response.data.results[i].photos[0].photo_reference,
                            }  
                          );
                  }
                }
                catch(error){
                    // console.log("In the try-catch-error: ", error);
                }
                finally{
                    setAttractions(attractions);
                }

        })
        .catch(function (error) {
            console.log("ERrrror: ", error);
        });
        
    };
   
        useEffect(() => {
            if(attractions.length === 0) {
                console.log("attractions array is empty: ", attractions);
                return ;
            }
            setIsLoading(false);
        },[attractions]);

        useEffect(() => {
            console.log("hei");
            getDataFromPlace();
        },[]);


        return (
    <View style={styles.container}>
    {
        isLoading ? (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ):(
            <>
            <FlatList
                    data={attractions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                />

        <BottomSheet hasDraggableIcon={true} ref={bottomSheet} height={400} >
            <SkeletonContent
            style={{justifyContent:'center', flex:1,alignItems:'center'}}
            isLoading={isBottomSheetLoading}>
                    <Text style={styles.bottomSheetTitle}>{title}</Text>
                    <Image source={{uri: image.url}} style={styles.bottomSheetImage}/>
                    <Text style={styles.bottomSheetRating}>Rating: {rating}</Text>
                    <Text style={styles.bottomSheetTotalRating}>Total Ratings: {totalRatings}</Text>
            </SkeletonContent>
        </BottomSheet>

            </>
        )
    }
        
    </View>
  )
}

export default RecommendScreen

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:2,
        alignItems:'center',
    },
    item: {
        padding:5,
        marginVertical:6,
        marginHorizontal:10,
        borderRadius:10,

        alignItems:'center',
        
        
        // styling
        backgroundColor:'#FAFAFA',
        
        // dimensions
        width:170,
        height:190,


        // shadows
        elevation:5,
    },
    imageItem:{
        width:160,
        height:130,

        borderRadius:10,
    },
    itemTitle:{
        alignSelf:'flex-start',
        marginTop:6,
        fontWeight:'700',
    },
    bottomSheetImage:{
        width:100,
        height:100,
        resizeMode:'contain',

        alignSelf:'flex-end',

    },
    bottomSheetTitle:{
        fontSize:18,
        fontWeight:'bold',
        alignSelf:'flex-start',
        width:100,
        height:50,
    },
    bottomSheetRating:{
        fontSize:18,
        fontWeight:'bold',
        alignSelf:'center',
        width:100,
        height:50,
    },
    bottomSheetTotalRating:{
        fontSize:18,
        fontWeight:'bold',
        alignSelf:'center',
        width:100,
        height:50,
    }
})