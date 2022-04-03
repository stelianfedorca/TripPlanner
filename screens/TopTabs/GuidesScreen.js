import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const GuidesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>GuidesScreen</Text>
    </View>
  )
}

export default GuidesScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    }
})