import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <Text>HomeHeader</Text>
    </View>
  )
}

export default HomeHeader

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'green',
        width:'100%',
        height:100,
    }
})