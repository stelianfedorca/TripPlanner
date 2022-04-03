import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import { useState } from 'react'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../redux/reducers/userReducer';
import {v4 as uuidv4} from 'uuid';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { selectIsNewTripAdded, setIsNewTripAdded } from '../../redux/reducers/tripReducer';
import { useDispatch } from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import { selectPlace, setPlace } from '../../redux/reducers/placeReducer';

   
   

    

    // HOW TO FETCH PLANS' IMAGES
    // 1. get image name from every doc
    // 2. fetch the image from storage using the image name

    const PlansScreen = ({navigation}) => {
    const [tripPlans, setTripPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isNewTripAdded = useSelector(selectIsNewTripAdded);
    const dispatch = useDispatch();
    const isInitialMount = useRef(true);




     // custom hook
     const useTripImages = (imageName) => {
        const [imageUrl, setImageUrl] = useState('');
        const storage = getStorage();

        useEffect(() => {
            const fetchImage = async () => {
                const pathReference = ref(storage,`trips_images/${imageName}.jpg`);
                const uri = await getDownloadURL(pathReference);
                setImageUrl({uri: uri});
            }

            fetchImage();
        },[imageName]);

        return imageUrl.uri;
    }
    
    
    
    const Item = ({item}) => {
        const {title, image, place} = item;

        const url = useTripImages(image);
       // const currentPlace = useSelector(selectPlace);

        const goToOverviewScreen = () => {
            dispatch(setPlace(place));
            navigation.replace('Overview');
        };
        
        return (
            <TouchableOpacity style={styles.item} onPress={goToOverviewScreen}>
                <Image source={{uri: url}}
                style={{width:100, height:100, borderRadius:8,justifyContent:'center',
                alignSelf:'center'}}
                 />
                {/* <Image 
                source={require('../../assets/paris2.jpg')}
                style={{width:100, height:100, borderRadius:8,justifyContent:'center',
                alignSelf:'center'}}
                /> */}
                <Text 
                style={{fontSize:17, marginStart:15,textAlignVertical:'center'}}>
                {title}
                </Text>
            </TouchableOpacity>
        );
    }

    // const isFocused = useIsFocused();


    // custom hook to get the trip plans associated with the current user
    // NOT USED
    const useTripPlans = async (isNewTripAdded) => {
        useEffect(() => {
            if(isNewTripAdded){
                getPlans();
            }

            console.log("getPlans() is called...");
        },[isNewTripAdded]);
    }


    const email = useSelector(selectEmail);

    const _renderItem = ({item}) => (
        <Item item={item}/>
    );

    const getPlans = async () => {
        const querySnapshot = await getDocs(collection(db,'users',email,'trip_plans'));
    
        const tempArray = [];
        querySnapshot.forEach((doc) => {
                // const pathReference = ref(storage,`trips_images/${img}.jpg`);
                    tempArray.push(
                           {
                           id: uuidv4(),
                           title: doc.data().title,
                           image: doc.data().image,
                           place: doc.data().place,
                       }
            );
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

    // useEffect(() => {
    //     if(isFocused) {
    //         console.log("getPlans() is called...");
    //         getPlans();
    //     }else{
    //         return ;
    //     }
    // },[isFocused]);

    // useEffect(() => {
    //     // if(isNewTripAdded === false) return ;

    //     console.log("getPlans() 2 is called...");
    //     getPlans();

    //     // clean up function
    //     return () => {
    //         // cancel the subscription 
    //         dispatch(setIsNewTripAdded(false));
    //     }
    // },[isNewTripAdded]);

    useEffect(() => {
        if(tripPlans.length === 0) {
            return ;
        }
        setIsLoading(false);
    },[tripPlans]);

  return (
    <View style={styles.container}>
    { isLoading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size="large" color="#000" />
          </View>
    ): (
      <FlatList
        data={tripPlans}
        renderItem={_renderItem}
        keyExtractor={(item,index) => item.id}
      />
    )}
    </View>
  )
}

export default PlansScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    item:{
        padding:20,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#D2D2D2',
        height:130,
        flexDirection:'row',
        // justifyContent:'space-around',
        // justifyContent:'center',
        
    }
})