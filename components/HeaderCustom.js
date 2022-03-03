import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import {Header} from '@react-navigation/elements'
import BackButtonCustom from './BackButtonCustom';
import { ScreenStackHeaderLeftView } from 'react-native-screens';
import  Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
const HeaderCustom = (props) => {
    console.log(props);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Icon name={'home'} color={'black'} size={26}/>
        <Image source={require('../assets/paris2.jpg')} style={styles.thumbnail}/>
        <View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default HeaderCustom

const styles = StyleSheet.create({
    container:{
        // position:'absolute',
        // zIndex:100,
        // top:0,
        // left:0,
        // right:0,
        display:'flex',
        height:200,
        alignItems:'center',
        borderWidth:2,
        borderColor:'red',
    },
    thumbnail:{
        height:260,
        resizeMode:'contain',
        
    }
})