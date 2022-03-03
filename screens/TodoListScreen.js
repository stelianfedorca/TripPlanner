import { KeyboardAvoidingView, StyleSheet, Text, View,TextInput, TouchableOpacity, Keyboard, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import Task from '../components/Task'
import { db } from '../firebase';
import { collection, getDocs,doc,setDoc, addDoc, query, onSnapshot, orderBy,where,Timestamp} from 'firebase/firestore';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';


const ref = collection(db,'colors'); 

const Tab = createBottomTabNavigator();

const TodoListScreen = () => {
    const [task, setTask] = useState();
    // This is the array that holds all the items
    const [taskItems, setTaskItems] = useState([]);

    // useEffect() function is called when components is rendered
    useEffect(() => {
        // called on the first render
        // And everytime any dependency value changes

        console.log("useEffect() is called...");
        // Temp Array
        const colors = [];
        
        const q = query(collection(db, "cities"), orderBy("created"));

        onSnapshot(q, (querySnapshot) => {
            setTaskItems(
                querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }))
            )
            
            
        });
       
        taskItems.map(t => {
            console.log(t);
        })
    },[]);
        

    const handleAddTask = () => {
       Keyboard.dismiss();
       setTaskItems([...taskItems,task]);
       setTask(null); 
    }

    const completeTask = (index) => {
        let itemsCopy = [...taskItems]; // copy the items into another array
        itemsCopy.splice(index,1); // remove that one item from array
        setTaskItems(itemsCopy); // set the main array 
    }

    const getData = async () => {
        const querySnapshot = await getDocs(collection(db,"colors"));

        const list = [];

        querySnapshot.forEach((doc) => {
           list.push(doc.data());
        });

        console.log(list);
        setTaskItems(list);

    }

    // Add a new document in collection "cities"
    const addData = async () => {
        Keyboard.dismiss();
        const taskTitle = task;
        const data = {
            title: taskTitle,
            created: Timestamp.now()
        };

        setTask(null);

        await addDoc(collection(db,"cities"), data);

    }

    
    // UI

  return (
    <View style={styles.container}>

    {/*Today's Tasks */}
    <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>List of cities</Text>

        <View style={styles.items}>

        <FlatList
            data={taskItems}
            renderItem={({item}) => (
                <Text style={styles.item}>{item.data.title}</Text>
            )}
                
            />
             
            {/* {
                taskItems.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                        <Task text={item.data.title}/>
                        </TouchableOpacity>
                    ) 
                    
                })
            } */}
            
        </View>
    </View>

      

    </View>

    );
};

export default TodoListScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#E8EAED',
    },
    tasksWrapper:{
        paddingTop:80,
        paddingHorizontal:20,
        paddingBottom:80,
        // flex:1,
    },
    sectionTitle:{  
        fontSize:24,
        fontWeight:'bold',
    },
    items:{
        marginTop: 30,
        // marginBottom:30,
        // flex:1,
    },
    item:{
        fontSize:33,
        fontWeight:'normal',
    },
    writeTaskWrapper:{
        position: 'absolute',
        bottom: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'center',
    },
    input:{
        paddingVertical:15,
        paddingHorizontal:15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth:1,
        width:250,
    },
    addWrapper:{
        width:60,
        height:60,
        backgroundColor:'white',
        borderRadius:60,
        justifyContent:'center',
        alignItems:'center',
        borderColor: '#C0C0C0',
        borderWidth:1,
    },
    addText:{
        fontSize:40,
        color:'#C0C0C0',
        justifyContent:'center',
        alignItems:'center',
    },

    buttonsContainer:{
        position:'absolute',
        bottom:140,
        width:'100%',
        justifyContent:'space-evenly',
        alignItems:'baseline',
        flexDirection:'row',
    },
    buttonAdd:{
        backgroundColor: '#0782F9',
        width:'40%',
        padding:10,
        borderRadius:12,
        alignItems:'center',
        elevation:2,
        shadowRadius:2,
        margin:15,
    },

    buttonGet:{
        backgroundColor: '#D8B059',
        width:'40%',
        padding:10,
        borderRadius:12,
        alignItems:'center',
        elevation:2,
        shadowRadius:2,
        margin:15,
    },
    buttonText:{
      fontSize: 18,
      color:'white',
      fontWeight:'bold'  
    },
    tabNavigator:{
        marginTop:20,
        marginBottom:20,
    },
});
