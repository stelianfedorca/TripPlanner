import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import  Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlace } from '../../redux/reducers/placeReducer';
import { setIsNewTripAdded } from '../../redux/reducers/tripReducer';
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
                <Ionicons name="ios-chevron-back-circle" size={50} color="white" />
            </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cityName}>
        <Text style={styles.cityNameText}>{place}</Text>
      </View>

    </View>
  )
}

export default HeaderCustom

const styles = StyleSheet.create({
    container:{
    },
    imageContainer:{
        height:230,
        overflow:'hidden',
       
    },
    thumbnail:{
      width:'100%',
      height:'100%',
      resizeMode:'contain',
      resizeMode:'stretch',
    },
    backButton:{
      position:'absolute',
      left:20,
      top:50,
    },
    overlay:{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    floatingTripName:{
      position:'absolute',
      // backgroundColor:'#F3F3F3',
      // opacity:0.85,
      // width:260,
      height:70,

      bottom:30,
      left:10,
      alignSelf:'center',

      // borderRadius:10,
      // elevation:10,
      justifyContent:'center',
      alignItems:'center',
    },

    cityName:{
      position:'absolute',
      bottom: 20,
      left:25,

    },
    cityNameText:{
      fontSize:25,
      fontWeight:'bold',
      color:'#FFFFFF',
      letterSpacing:1,
    }
})