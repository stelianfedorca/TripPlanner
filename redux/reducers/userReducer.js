import { createSlice } from "@reduxjs/toolkit";

   

    export const userReducer = createSlice({
        name: 'user',
        initialState:{
            fullname:'',
            email:'',
        },
        reducers:{
            setName: (state, action) => {
                console.log("setName called with: " + action.payload);
                state.fullname = action.payload;
            },

            setEmail: (state, action) => {
                console.log("setEmail called with: " + action.payload);
                state.email = action.payload;
            },

        }
    });

    // exporting the action creators
    export const {setName, setEmail} = userReducer.actions;

    // kind of like getters
    export const selectName = (state) => state.user.fullname;
    export const selectEmail = (state) => state.user.email;

    export default userReducer;