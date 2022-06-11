import { StyleSheet, Text, View,Image, TouchableOpacity, FlatList} from 'react-native'
import React, {useEffect, useState,useRef} from 'react';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Chip, Colors} from 'react-native-paper';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectUid } from '../../redux/reducers/userReducer';
import { selectPlaceId } from '../../redux/reducers/placeReducer';
import {PLACE_API_KEY} from '@env'
import { Ionicons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating';
import Carousel from 'react-native-snap-carousel';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';

const PlaceDetailsScreen = ({route,navigation}) => {
  const {attractionSelected, photoUrl, placeId} = route.params;
  const uid = useSelector(selectUid);
  const tripId = useSelector(selectPlaceId);

  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState('');
  const [totalRatings, setTotalRatings] = useState('');
  const [types, setTypes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const isCarousel = React.useRef(null);

  useEffect(() => {
    navigation.setOptions({title: attractionSelected});
  },[]);

  useEffect(() => {
      // callPlaceDetailsApi();
  },[]);

  // get info from place api using an tourist attraction
  const callFindPlaceApiByAttractionSelected = () => {

    axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${attractionSelected}&inputtype=textquery&fields=place_id%2Cformatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cphotos&key=${PLACE_API_KEY}`
    ).then(function(response){
          // console.log(response);
          
          
    })
    .catch(function (error) {
      console.log(error);
  });
};

  const callPlaceDetailsApi = () => {
    axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${PLACE_API_KEY}`
    ).then(function(response){
        setRating(response.data.result.rating);
        setTotalRatings(response.data.result.user_ratings_total);
        setTypes(response.data.result.types);
        setReviews(response.data.result.reviews);
        setLoading(false); 
    })
    .catch(function (error) {
      console.log(error);
  });
  }


  const addToTrip = async () => {
    const attractionData = {
      attraction: attractionSelected,
      image: photoUrl,
    };

    // get the reference to subcollection
    // if it's not created yet, create it
    const subCollRef = collection(db,`users/${uid}/trip_plans/${tripId}/itinerary`);

    // add the doc inside the subcollection
    addDoc(subCollRef, attractionData);
  };

  const goBack = () => {
    navigation.goBack();
  }

  const Item = ({item}) => {

    return (
      <View style={styles.item}>
        <Text style={{marginBottom:5, maxHeight:100, overflow:'hidden', fontStyle:'italic'}}>{item.text}</Text>
        <View style={{flexDirection:'row'}}>
          <Image source={{uri: item.profile_photo_url}} style={styles.avatar}/>
          <Text style={{fontWeight:'bold', alignSelf:'flex-end', marginLeft:5}}>{item.author_name}</Text>
          <StarRating
            disabled={true}
            maxStars={5}
            rating={item.rating ? item.rating : 3}
            fullStarColor={'orange'}
            starSize={16}
            containerStyle={{marginLeft:10, alignSelf:'flex-end'}}
          />
        </View>
      </View>
      
      // <Card style={styles.item}>
      //  {/* <Card.Cover source={{ uri: image }} /> */}
      //   <Card.Title title={item.author_name}/>
      //   <Card.Content>
      //     <Paragraph style={{overflow:'visible'}}>{item.text}</Paragraph>
      //   </Card.Content>
      // </Card>
    ); 
  }

  const _renderItem = ({item}) => (
    <Item item={item} /> 
);



  return (
        <View style={styles.container}>

          <View style={styles.header}>
            <Image source={{uri: photoUrl}} style={styles.thumbnail}/>
            <View style={styles.overlay}/>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Ionicons name="ios-chevron-back-circle" size={50} color="white" style={{opacity:0.75}}/>
          </TouchableOpacity>

          <Text style={styles.title}>{attractionSelected}</Text>
          
          {
            loading ? (
              <ActivityIndicator animating={true} color={Colors.blue200} size={24} style={{alignSelf:'center', marginTop:30,}}/>
            ):(
              <>
          <View style={{ marginLeft:10}}>
                <View style={styles.rating}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={rating ? rating : 5}
                    fullStarColor={'orange'}
                    starSize={20}
                  />

                  <Text style={styles.ratingText}>{rating}</Text>
                  <Text style={styles.totalRatings}>({totalRatings})</Text>
                  <Image source={require('../../assets/googleicon.png')} style={{width:22,height:22,marginLeft:5,}}/>

                </View>
                <View style={styles.category}>
                  {
                    types.map((type) => (
                      <Chip style={{marginBottom:5,marginRight:3,elevation:1}} textStyle={{fontSize:12,fontWeight:'bold'}}>{type}</Chip>
                    ))
                  }

                </View>

                <Text style={styles.reviews}>Reviews</Text>

                <View style={{flexDirection:'row'}}>
                  <Carousel
                    layout={"default"}
                    ref={isCarousel}
                    data={reviews ? reviews : null}
                    sliderWidth={350}
                    itemWidth={300}
                    renderItem={_renderItem}
                  />
                </View>

               

                  <TouchableOpacity style={styles.addToTrip} onPress={addToTrip}>
                    <Text style={styles.addToTripText}>Add to itinerary</Text>
                  </TouchableOpacity>
          </View>

              </>

            )
          }

        </View>

  )
}

export default PlaceDetailsScreen

const styles = StyleSheet.create({
  container: {
      flex:1,
      alignItems:'flex-start',
      backgroundColor:'white',
  },
  header:{
    marginBottom:5,
    width:'100%',
    
    // shadowRadius:10,
  },
  thumbnail:{
    width:'100%',
    height:300,
    resizeMode:'stretch',
  },
  backButton:{
    position:'absolute',
    left:20,
    top:50,
  },
  overlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  text:{
    fontSize:20,
    fontWeight:'500',
  },
  addToTrip:{
    backgroundColor:'#DF6810',
    padding:15,
    borderRadius:15,
    alignSelf:'center',
    marginTop:30,

    elevation:3,
  },
  addToTripText:{
    color:'white',
    fontWeight:'bold',
  },
  title:{
    fontWeight:'bold',
    fontSize:22,
    paddingTop:10,
    marginLeft:10,
  },
  rating:{
    paddingTop:5,
    flexDirection:'row',
  },
  ratingText:{
    fontWeight:'bold',
    fontSize:16,
    marginLeft:5,
    color: 'orange',
  },
  totalRatings:{
    marginLeft:5,
    fontSize:16,
  },
  category:{
    flexDirection:'row',
    flexWrap:'wrap',
    paddingTop:5,
  },
  reviews:{
    fontWeight:'bold',
    fontSize:20,
    letterSpacing:1,

    marginTop:10,
    marginBottom:10,
  },
  item:{
    backgroundColor: 'white',
    width:300,
    height:150,
    marginBottom:10,
    borderRadius:10,
    padding:10,

    elevation: 5,
    justifyContent:'space-between'
  },
  avatar:{
    borderRadius:15,
    width:24,
    height:24,
    overflow:'hidden',
    alignSelf:'flex-end'
  }

})