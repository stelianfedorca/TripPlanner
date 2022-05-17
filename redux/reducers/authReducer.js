import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSignedIn: false,
    isFirstSignIn: true,
};

const options = {
    name:'auth',
    initialState,
    reducers:{
        setIsSignedIn: (state, action) => {
            state.isSignedIn = action.payload;
        },
        setIsFirstSignIn: (state, action) => {
            state.isFirstSignIn = action.payload;
        }
    }
};
export const authReducer = createSlice(options);

    // action creators
    export const {setIsSignedIn, setIsFirstSignIn} = authReducer.actions;

    export const selectIsSignedIn = (state) => state.auth.isSignedIn;
    export const selectIsFirstSignIn = (state) => state.auth.isFirstSignIn;

    export default authReducer;
