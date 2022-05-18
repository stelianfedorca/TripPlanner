import { StyleSheet, Text, View, Button, Pressable, TouchableOpacity, FlatList, SafeAreaView, Image} from 'react-native';
import React, { useState } from 'react';
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
import HomeHeader from '../components/HomeHeader';
import {PLACE_API_KEY} from '@env';

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
    const [users, setUsers] = useState([]);
    const isSignedIn = useSelector(selectIsSignedIn);
    const isFirstSignedIn = useSelector(selectIsFirstSignIn);
    

    useEffect(() => {
      navigation.setOptions({
        headerShown:false
      });
    },[]);

//  function for fetching all the users from db
    useEffect(() => {
      const getUsers = async () => {
        const col = collection(db,'users');
        const querySnapshot = await getDocs(col);

        let tempArray = [];

        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " ==> ", doc.data());
            // tempArray.push(
            //     {
            //         id: uuidv4(),
            //         title: doc.data().name
            //     }
            // );
        });

        setUsers(tempArray);
    };
        getUsers();
    },[]);
    


    const Item = ({ item }) => {
        const {title, image, user} = item;
        return (
          <View style={styles.item}>
            <Image source={image} style={styles.image}/>
            <Text style={styles.username}>{user}</Text>
            <Text style={styles.title}>{ title }</Text>
          </View>
        ); 
    }
    

    const _renderItem = ({item}) => (
        <Item item={item}/> 
    );

    const ItemSeparator = () => (
      <View style={{margin:10,}}/>
    )
    

 
  return (
    <SafeAreaView style={styles.container}>
        <FlatList
            data={DATA}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={ItemSeparator}
        />

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        
        // backgroundColor:'#FFFFFF',
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
    backgroundColor: 'white',
    justifyContent:'flex-start',
    alignItems:'center',

    height:275,
    width:'100%',
    // borderWidth:1,
    // borderColor:'blue',
    alignSelf:'center',
    elevation:3,
  },
  title: {
    fontSize:16,
    fontWeight:'bold',
    alignSelf:'flex-start',
    padding:5,
    
  },
  username:{
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
});
