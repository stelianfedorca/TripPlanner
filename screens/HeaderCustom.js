import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import {Header} from '@react-navigation/elements'
import { ScreenStackHeaderLeftView } from 'react-native-screens';
import  Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlace } from '../redux/reducers/placeReducer';
import { setIsNewTripAdded } from '../redux/reducers/tripReducer';
const HeaderCustom = ({image}) => {
  const navigation = useNavigation();

  const place = useSelector(selectPlace);
  const dispatch = useDispatch();

  const navigateToHomeScreen = () => {
    dispatch(setIsNewTripAdded(false));
    navigation.goBack();
  }

  return (
    <View style={styles.container}>

      <View style={styles.imageContainer}>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Image source={{uri: image}} style={styles.thumbnail}/>
          <View style={styles.overlay}/>
        </View>
        <View style={styles.backButton}>
            <TouchableOpacity onPress={navigateToHomeScreen}>
                <Icon name={'home'} color={'white'} size={26}/>
            </TouchableOpacity>
        </View>
      </View>
      <View style={styles.floatingSection}>
        <Text style={{fontSize:23,fontWeight:'bold',}}>Trip to {place}</Text>
      </View>

    </View>
  )
}

export default HeaderCustom

const styles = StyleSheet.create({
    container:{
      // borderWidth:2,
      // borderColor:'blue',
      height:270,
    },
    imageContainer:{
        height:200,
        overflow:'hidden',
        // borderWidth:2,
        // borderColor:'red',
    },
    thumbnail:{

      width:'100%',
        height:'100%',
        resizeMode:'contain',
        resizeMode:'stretch',
        // // alignSelf:'flex-start',
    },
    backButton:{
      position:'absolute',
      left:20,
      top:50,
    },
    overlay:{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.25)',
    },
    floatingSection:{
      position:'absolute',
      backgroundColor:'white',
      width:260,
      height:70,

      bottom:30,
      // left:10,
      alignSelf:'center',

      borderRadius:10,
      elevation:10,
      justifyContent:'center',
      alignItems:'center',
    },
})