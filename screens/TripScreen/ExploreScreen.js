import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, Image} from 'react-native'
import React, { useEffect } from 'react'
import { collection, getDocs, query, where, collectionGroup} from "firebase/firestore";
import { useSelector } from 'react-redux';
import { selectPlace } from '../../redux/reducers/placeReducer';
import { db } from '../../firebase';
import {PLACE_API_KEY} from "@env";

  const DATA = [
    {
      id:1,
      user: "user_name1",
      title: "Roma trip",
      image: require('../../assets/roma2.jpg'),
    },
    {
      id:2,
      user: "user_name8",
      title: "Roma vacation",
      image: require('../../assets/roma.jpg'),
    }
  ];

const ExploreScreen = () => {
  const placeName = useSelector(selectPlace);
  
  // get all users trips
  useEffect(() => {
    getUsersPlans();
  },[]);

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
     const {title, user, image} = item;
    
     return (
         <TouchableOpacity style={styles.item} >
            <Image source={image} style={styles.thumbnail}/>
            <View style={{flexDirection:'column', justifyContent:'center', padding:10}}>
              <Text 
                  style={styles.itemTitle}>
                  {title}
              </Text>
              <Text 
                  style={styles.itemUser}>
                  {user}
              </Text>
            </View>
         </TouchableOpacity>
     );
 }


 const _renderItem = ({item}) => (
     <Item item={item}/>
 );

 const separator = () => (
  <View style={styles.separator}/>
);
  // 1. Sa gasesc o modalitate sa iau id-ul de la fiecare utilizator parcurs
  // 2. Sa omit userul curent din query-ul de mai jos

 const getUsersPlans = async () => {
  const plansRef = collectionGroup(db,'trip_plans');

  // creating the query
  const q = query(plansRef, where("place", "==", placeName));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " ==> ", doc.data());
  })
 };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={_renderItem}
        keyExtractor={(item,index) => item.id}
        ItemSeparatorComponent={separator}
        // ListEmptyComponent={EmptyListScreen}
      />
    </SafeAreaView>
  )
}

export default ExploreScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  item:{
    padding:20,
    backgroundColor:'white',
    // alignItems:'center',
    height:130,
    flexDirection:'row',
    // justifyContent:'space-around',
    // justifyContent:'center',
    
},
separator:{
    // backgroundColor:'red',
    borderWidth:1,
    borderColor:'#D2D2D2',
},
thumbnail:{
  width:100, 
  height:100,
  borderRadius:8,
  justifyContent:'center',
  alignSelf:'center'
},
itemTitle:{
  fontSize:17,
  // marginStart:15,
  textAlignVertical:'center',
  fontWeight:'bold',
},
itemUser:{
  fontSize:16,
}
})