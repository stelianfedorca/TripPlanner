import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity, 
  FlatList, SafeAreaView, Image, ActivityIndicator} from 'react-native';
import React, { useRef, useState } from 'react';
import { auth, db } from '../firebase';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { selectIsNewTripAdded, setIsNewTripAdded } from '../redux/reducers/tripReducer';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectImage, setImage } from '../redux/reducers/userReducer';
import { collection, getDocs} from "firebase/firestore";
import {v4 as uuidv4} from 'uuid';
import { selectIsFirstSignIn, selectIsSignedIn } from '../redux/reducers/authReducer';
import {PLACE_API_KEY} from '@env';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { setPlace } from '../redux/reducers/placeReducer';
import Carousel from 'react-native-snap-carousel';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'London',
      image: require('../assets/london-app.jpg'),
      user: 'user name 2',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Vienna',
      image: require('../assets/vienna-app.jpg'),
      user: 'user name 3',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Madrid',
      image: require('../assets/madrid-app.jpg'),
      user: 'user name 4',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d73',
      title: 'Budapest',
      image: require('../assets/budapesta.jpg'),
      user: 'user name 5',
    },
  ];
const HomeScreen = ({navigation}) => {
    const [guides, setGuides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const isInitialMount = useRef(true);
    const isCarousel = React.useRef(null);

    const fetchGuides = async () => {
      const guides = [];
      const querySnapshot = await getDocs(collection(db, "guides"));
      querySnapshot.forEach((doc) => {
        const dataObject = {};
        Object.assign(dataObject, doc.data());
        dataObject.id = doc.id;
        guides.push(dataObject);
      });

      setGuides(guides);
    }

   useEffect(() => {
     if(isInitialMount.current){
        isInitialMount.current = false;
        fetchGuides();
     } else {
       return;
     }
   },[]);

   useEffect(() => {
    if(guides.length > 0) setIsLoading(false);
    else return;
   },[guides]);

   const displayOverviewScreen = async (place) => {
    var axios = require('axios');
    
    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=point+of+interest+in+${place}&key=${PLACE_API_KEY}`,
      headers: { }
    };
    
    axios(config)
    .then(function (response) {
        const attractions = [];
          try{
              for(var i =0 ; i<response.data.results.length; i++){
                console.log(response.data.results[i].name)
            }
          }
          catch(error){
              console.log("In the try-catch-error: ", error);
          }

  })
  .catch(function (error) {
      console.log("ERrrror: ", error);
  });
   }

  
// custom hook
const useGetImage = (imageName) => {
  const [image, setImage] = useState("");
  const storage = getStorage();

   useEffect(() => {
    getDownloadURL(ref(storage, `guides/${imageName}`))
      .then((url) => {
        setImage({url: url});
      })
      .catch((error) => {
        // Handle any errors
      });
           
   },[]);

   return image.url;
}


    const Item = ({ item, onClick}) => {

        const image = useGetImage(item.image_url);

        return (
          <Card style={styles.item} onPress={() => onClick("Madrid")}>
           <Card.Cover source={{ uri: image }} />
            <Card.Title title={item.title} subtitle={item.place} />
            {/* <Card.Content>
              <Paragraph >{item.description}</Paragraph>
            </Card.Content> */}
          </Card>
        ); 
      }
      
      // <TouchableOpacity style={styles.item}>
      //   <Image source={{uri: image}} style={styles.image}/>
      //   <Text style={styles.title}>{item.title}</Text>
      //   <Text style={styles.place}>{item.place}</Text>
      //   <Text style={styles.description}>{item.description}</Text>
      // </TouchableOpacity>

    const _renderItem = ({item}) => (
        <Item item={item} onClick={displayOverviewScreen}/> 
    );

    const ItemSeparator = () => (
      <View style={{margin:5}}/>
    )
    

 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontWeight:'700', 
        fontSize:32,position:'absolute', 
        bottom:4,left:12, letterSpacing:2,}}>Explore</Text>
      </View>
    {
      isLoading ? (
        <View style={{justifyContent:'center', alignItems:'center', flex:1,}}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      ):(
        <>
          <Text style={styles.guides}>Guides</Text>
          <View style={{flex:1, flexDirection:'row', justifyContent:'center',marginTop:10}}>
            <Carousel
              layout={"default"}
              ref={isCarousel}
              data={guides}
              sliderWidth={270}
              itemWidth={250}
              renderItem={_renderItem}
            />
          </View>

        </>

      )
    }
    </SafeAreaView>
  );
};
        // <FlatList
        //     data={guides}
        //     renderItem={_renderItem}
        //     keyExtractor={(item) => item.id.toString()}
        //     ItemSeparatorComponent={ItemSeparator}
        // />

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    header:{
      backgroundColor:'white',
      height:100,
      justifyContent:'flex-end',
      alignItems:'flex-start',
      padding:20,
      marginBottom:5,
    },
    button:{
        borderRadius:10,
        padding:6,
        height:40,
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#0782F9',
        marginTop:20,
    },
    buttonText:{
        color:'white',
        fontSize:16,
        fontWeight:"700",
    },
    item: {
    borderRadius:10,
    width:'100%',
   
    elevation:3,
    overflow:'hidden',
  },
  description: {
    fontSize:14,
    alignSelf:'flex-start',
    padding:5,
  },
  place: {
    fontSize:14,
    alignSelf:'flex-start',
    padding:5,
    fontWeight:'bold'
  },
  title:{
    fontSize:18,
    alignSelf:'flex-start',
    padding:5,
  },
  image:{
    width:'100%',
    height:200,
    resizeMode:'cover',
    // borderRadius:15,
  },
  guides:{
    fontWeight:'bold',
    fontSize:20,
    paddingHorizontal:15,
    letterSpacing:1,
  }
});
