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

const HomeScreen = ({navigation}) => {
    const [users, setUsers] = useState([]);

    // show the email for every user
    const getUsers = async () => {
        const col = collection(db,'users');
        const querySnapshot = await getDocs(col);

        let tempArray = [];

        querySnapshot.forEach((doc) => {
            tempArray.push(
                {
                    id: uuidv4(),
                    title: doc.data().name
                }
            );
        });

        setUsers(tempArray);
    };

    useEffect(() => {
        getUsers();
    },[]);
    

    const DATA = [
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          title: 'London',
          image: '../assets/london-app.jpg'
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          title: 'Vienna',
          image: '../assets/vienna-app.jpg'
        },
        {
          id: '58694a0f-3da1-471f-bd96-145571e29d72',
          title: 'Madrid',
          image: '../assets/madrid-app.jpg'
        },
      ];

    const Item = ({ item }) => {
        const {title, image} = item;
        return (
          <View style={styles.item}>
            <Image source={require("../assets/madrid-app.jpg")} style={{width:200, height:200, resizeMode:'contain'}}/>
              <Text style={styles.title}>{ title }</Text>
          </View>
        ); 
    }
    

    const _renderItem = ({item}) => (
        <Item item={item}/> 
    );

 
  return (
    <SafeAreaView style={styles.container}>
        <FlatList
            data={DATA}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id}
        />

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
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
    backgroundColor: '#f9c2ff',
    padding: 40,
    marginVertical: 8,
    marginHorizontal:16,
    // height:150,
  },
  title: {
    fontSize: 32,
  },
});
