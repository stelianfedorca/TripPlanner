import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonContent from 'react-native-skeleton-content';

const BottomSheetPlaceholder = () => {
  return (
     <SkeletonContent
      containerStyle={{ flex: 1, width: 300, justifyContent:'center', alignItems:'center'}}
      isLoading={true}>
      <Text style={styles.normalText}>Your content</Text>
      <Text style={styles.bigText}>Other content</Text>
    </SkeletonContent>
  )
}

export default BottomSheetPlaceholder

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    normalText:{
        width:220,
        height:20,
        marginBottom:6,
    },
    bigText:{
        width: 180,
         height: 20,
        marginBottom: 6
    }
})