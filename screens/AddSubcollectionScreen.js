import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import sizeof from 'firestore-size';
import {doc, getDoc, updateDoc, collection, setDoc} from 'firebase/firestore';
import {auth, db} from '../firebase';
import {useSelector} from 'react-redux';
import { selectFullname, selectEmail } from '../redux/reducers/userReducer';
import { selectPlace } from '../redux/reducers/placeReducer';

// fsd20@gmail.com


const AddSubcollectionScreen = () => {
  const userId = 'stelyfed22@gmail.com';

  const currentUser = useSelector(selectEmail);
  const currentPlace = useSelector(selectPlace);




    const findDocumentSize = async () => {
      const docRef = doc(db,'users',userId);
      const docSnap = await getDoc(docRef);
    
    
      if (docSnap.exists()) {
          const data = docSnap.data();
    
          const bytes = sizeof(data);
      } else {
        console.log("No such document!");
      }        
    };

    const addSubcollToDoc = async () => {
      // get the specific document
      const docRef = doc(db,'users',userId);

      // ADD A SUBCOLLECTION SPECIFYING THE ID

      // the document with the collection that I want to our doc
      const subcollection = doc(db,`users/${userId}/trip_plans`,'first_trip');
      const tripData = {
        title: 'Paris2',
        image: 'image_paris2',
      }

      await setDoc(subcollection,tripData);

      // ADD A SUBCOLLECTION WITHOUT SPECIFYING THE ID
       // the document with the collection that I want to our doc
      //  const subcollection = collection(db,`users/${userId}/trip_plans`);
      //  const tripData = {
      //    title: 'Paris2',
      //    image: 'image_paris2',
      //  }
 
      //  // add the subcollection along with doc inside current user doc
      //  await addDoc(subcollection,tripData);
      
    };

  return (
    <View style={styles.container}>
      <View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={findDocumentSize}
            >
              <Text style={styles.buttonText}>Find doc size</Text>
          </TouchableOpacity>
      </View>

      <View>
          <TouchableOpacity 
            style={[styles.addButton, {backgroundColor:'purple', marginTop:20,}]}
            onPress={addSubcollToDoc}
            >
              <Text style={styles.buttonText}>Add subcollection to doc</Text>
          </TouchableOpacity>
      </View>

    </View>
  )
}

export default AddSubcollectionScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonText:{
        fontSize:18,
        fontWeight:'700',
        color:'#fff',
    },
    addButton:{
        backgroundColor:'#218EC8',
        padding:10,
        borderRadius:15,
    }
})