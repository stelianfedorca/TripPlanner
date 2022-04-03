import { createSlice } from "@reduxjs/toolkit";

    const initialState = () => ({
        uid:'',
        fullname:'',
        email:'',
        image:'101',
        imageUrl:'',
    })

    export const userReducer = createSlice({
        name: 'user',
        initialState: initialState(),
        reducers:{
            setUid: (state, action) => {
                state.uid = action.payload;
            },
            
            setName: (state, action) => {
                console.log("setName called with: " + action.payload);
                state.fullname = action.payload;
            },

            setEmail: (state, action) => {
                console.log("setEmail called with: " + action.payload);
                state.email = action.payload;
            },

            setImage: (state, action) => {
                state.image = action.payload;
            },

            setImageUrl: (state, action) => {
                state.imageUrl = action.payload;
            },

            userSignOut: (state, action) => {
                state = initialState();
            },
        }
    });

    // exporting the action creators
    export const {setUid, setName, setEmail, setImage, setImageUrl, userSignOut} = userReducer.actions;

    // kind of like getters
    export const selectUid = (state) => state.user.uid;
    export const selectFullname = (state) => state.user.fullname;
    export const selectEmail = (state) => state.user.email;
    export const selectImage = (state) => state.user.image;
    export const selectImageUrl = (state) => state.user.imageUrl;
    export default userReducer;