import { StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';

const ImageScreen = (props) => {
  return (
    <View style={styles.container}>
    <Text>This is an image screen</Text>
      {/* <Image style={styles.thumbnail} source={{uri: props.userData.localUri}} /> */}
    </View>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },  
    thumbnail: {
        width: 300,
        height: 300,
        resizeMode: "contain",
    }
});
