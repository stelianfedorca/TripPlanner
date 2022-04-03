import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectEmail, selectFullname, selectUid } from '../redux/reducers/userReducer'

const ReduxTest = () => {
    const uid = useSelector(selectUid);
    const email = useSelector(selectEmail);
    const fullname = useSelector(selectFullname);

  return (
    <View style={styles.container}>
      <Text>Uid: {uid}</Text>
      <Text>Email: {email}</Text>
      <Text>Fullname: {fullname}</Text>
    </View>
  )
}

export default ReduxTest

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#EAD1BA'
    }
})