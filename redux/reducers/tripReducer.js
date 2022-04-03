import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
        isNewTripAdded: false
    }

    export const tripReducer = createSlice({
        name:'newTrip',
        initialState,
        reducers:{
            setIsNewTripAdded: (state, action) => {
                state.isNewTripAdded = action.payload;
            }
        }
    });

     // action creators
     export const {setIsNewTripAdded} = tripReducer.actions;

     export const selectIsNewTripAdded = (state) => state.newTrip.isNewTripAdded;
 
     export default tripReducer;