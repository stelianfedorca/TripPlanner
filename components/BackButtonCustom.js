import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import  Icon from 'react-native-vector-icons/FontAwesome';
const BackButtonCustom = (props) => {
    const navigation = useNavigation();
  return (
  <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name={'home'} color={'black'} size={26}/>
          {/* <Image source={require('../assets/plus_icon.png')} style={styles.icon}/> */}
        </TouchableOpacity>
  </View>
  )
}

export default BackButtonCustom

const styles = StyleSheet.create({
    icon:{
        width:30,
        height:30,

    }
})

//   <TouchableOpacity
//      style={styles.headerBtnContainer}
//      onPress={() => props.navigation.goBack()}
//   >
//     <Ionicons name="close-sharp" size={24} color="white" />
//   </TouchableOpacity>