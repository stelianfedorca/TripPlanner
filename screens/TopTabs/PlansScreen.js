import {FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View, SafeAreaView} from 'react-native'
import React, { useRef } from 'react'
import { useState } from 'react'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectEmail, selectUid } from '../../redux/reducers/userReducer';
import {v4 as uuidv4} from 'uuid';
import { selectIsNewTripAdded, setIsNewTripAdded } from '../../redux/reducers/tripReducer';
import { useDispatch } from 'react-redux';
import { selectPlace, setPlaceId, setPlace } from '../../redux/reducers/placeReducer';
import { ActivityIndicator, Card, Colors, Subheading, Title } from 'react-native-paper';
import EmptyListScreen from '../EmptyListScreen';
import {PLACE_API_KEY} from '@env';
import { Chip } from 'react-native-paper';

    // HOW TO FETCH PLANS' IMAGES
    // 1. get image name from every doc
    // 2. fetch the image from storage using the image name

const PlansScreen = ({navigation}) => {
    const [tripPlans, setTripPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isQueryEmpty, setIsQueryEmpty] = useState(false);

    const isNewTripAdded = useSelector(selectIsNewTripAdded);
    const dispatch = useDispatch();
    const email = useSelector(selectEmail);
    const uid = useSelector(selectUid);
    const isInitialMount = useRef(true);

    
   // custom hook
   const useGetImage = (imageReference) => {
       const [image, setImage] = useState("");
        useEffect(() => {
            const getImageFromReference = async () => {
                var config = {
                    method: 'get',
                    url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${imageReference}&key=${PLACE_API_KEY}`,
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
                getImageFromReference();
        },[]);

        return image.url;
}

    const Item = ({item}) => {
        const {title, image, place, imageReference, startDate, endDate ,id} = item;
        const url = useGetImage(imageReference);

        const displayOverviewScreen = async () => {
            dispatch(setPlace(place));
            dispatch(setPlaceId(id));
            navigation.navigate('Overview');
        };
        return (
            
            <TouchableOpacity style={styles.item} onPress={displayOverviewScreen}>
                <Image source={{uri: url}}
                style={styles.image}
                 />
                <View style={styles.details}>
                    {/* <Title>{title}</Title> */}
                    <Text style={{fontSize:17, fontWeight:'bold', marginBottom:3}}>{title}</Text>
                    {
                        startDate ? (
                        <Chip icon="calendar" mode='outlined' style={{justifyContent:'space-between', flexDirection:'row', backgroundColor:'white'}} >
                            <Text style={{fontWeight:'700'}}>{startDate.split(' ')[1] + " " + startDate.split(' ')[2]}</Text>
                            <Text>{"     "}</Text>
                            <Text style={{fontWeight:'700'}}>{endDate.split(' ')[1] + " " + endDate.split(' ')[2]}</Text>
                        </Chip>
                            ):(
                        <>

                        </>
                        )
                    }
                    

                </View>
            </TouchableOpacity>
        );
    }


    const _renderItem = ({item}) => (
        <Item item={item}/>
    )
       

    const getPlans = async () => {
        const querySnapshot = await getDocs(collection(db,'users',uid,'trip_plans'));
        const tempArray = [];
        if(querySnapshot.docs.length === 0){
            setIsQueryEmpty(true);
        }
        querySnapshot.forEach((doc) => {
            const dataObject = {};
            Object.assign(dataObject, doc.data());
            dataObject.id = doc.id;
            tempArray.push(dataObject);
            
        });
        setTripPlans(tempArray);
    };


    useEffect(() => {
        if(isInitialMount.current){
            isInitialMount.current = false;
            getPlans();
        } else {
            if(isNewTripAdded){
                getPlans();
            }
        }
        
        return dispatch(setIsNewTripAdded(false));
    });

    useEffect(() => {
        if(tripPlans.length === 0) {
            return ;
        }
        setIsLoading(false);
    },[tripPlans]);

    useEffect(() => {
        if(isQueryEmpty === true){
            setIsLoading(false);
        }
    },[isQueryEmpty]);

    const separator = () => (
        <View style={styles.separator}/>
    )

  return (
    <SafeAreaView style={styles.container}>
    { isLoading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator animating={true} color={Colors.blue200} size={24}/>
        </View>
    ): (
      <FlatList
        data={tripPlans}
        renderItem={_renderItem}
        keyExtractor={(item,index) => item.id}
        ItemSeparatorComponent={separator}
        ListEmptyComponent={EmptyListScreen}
      />
    )}
    </SafeAreaView>
  )
}

export default PlansScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    item:{
        // padding:20,
        backgroundColor:'white',
        
        height:100,
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    separator:{
        // backgroundColor:'red',
        borderWidth:1,
        borderColor:'#D2D2D2',
    },
    image:{
        width:100,
        height:'90%',
        margin:3,
        borderRadius:5,
        justifyContent:'center',
        alignSelf:'center'
    },
    details:{
        justifyContent:'center',
        marginStart:15,
        textAlignVertical:'center',

    }
})