import {FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View, SafeAreaView} from 'react-native'
import React, { useRef } from 'react'
import { useState } from 'react'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectEmail, selectUid } from '../../redux/reducers/userReducer';
import {v4 as uuidv4} from 'uuid';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { selectIsNewTripAdded, setIsNewTripAdded } from '../../redux/reducers/tripReducer';
import { useDispatch } from 'react-redux';
import { selectPlace, setPlaceId, setPlace } from '../../redux/reducers/placeReducer';
import { ActivityIndicator, Colors } from 'react-native-paper';
import EmptyListScreen from '../EmptyListScreen';

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

    const apiKey = 'AIzaSyBK5lXWrezjxCJnfSmVfukDVzivZbcNFT4';
    
    
    // using the hook to access the redux store's state. ('place' in our case)
    // const place = useSelector(selectPlace);
    const useTripImages = (imageName) => {
       const [imageUrl, setImageUrl] = useState('');
       const storage = getStorage();

       useEffect(() => {
           const fetchImage = async () => {
               const pathReference = ref(storage,`trip_images/${imageName}`);
               const uri = await getDownloadURL(pathReference);
               setImageUrl({uri: uri});
           }

           fetchImage();
       },[imageName]);

       return imageUrl.uri;
   }

   // custom hook
   const useGetImage = (imageReference) => {
       const [image, setImage] = useState("");
        useEffect(() => {
            const getImageFromReference = async () => {
                var config = {
                    method: 'get',
                    url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${imageReference}&key=${apiKey}`,
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
        const {title, image, place, imageReference, docId} = item;

        const url = useGetImage(imageReference);

        const goToOverviewScreen = async () => {
            dispatch(setPlace(place));
            dispatch(setPlaceId(docId));
            navigation.navigate('Overview');
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
                    tempArray.push(
                           {
                           id: uuidv4(),
                           title: doc.data().title,
                           image: doc.data().image,
                           place: doc.data().place,
                           imageReference: doc.data().imageReference,
                           docId: doc.id
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
        padding:20,
        backgroundColor:'white',
        
        height:130,
        flexDirection:'row',
        // justifyContent:'space-around',
        // justifyContent:'center',
        
    },
    separator:{
        // backgroundColor:'red',
        borderWidth:1,
        borderColor:'#D2D2D2',
    }
})