import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const EmptyListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>EmptyListScreen</Text>
    </View>
  )
}

export default EmptyListScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})