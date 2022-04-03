import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
        placeSearched: '',
    }

    export const searchReducer = createSlice({
        name:'search',
        initialState,
        reducers:{
            setPlaceSearched: (state, action) => {
                state.placeSearched = action.payload;
            }
        }
    });

     // action creators
     export const {setPlaceSearched} = searchReducer.actions;

     export const selectPlaceSearched = (state) => state.search.placeSearched;
 
     export default searchReducer;