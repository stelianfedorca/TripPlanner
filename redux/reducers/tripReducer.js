import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
        isNewTripAdded: false,
        startDate: "",
        endDate: "",
    }

    export const tripReducer = createSlice({
        name:'newTrip',
        initialState,
        reducers:{
            setIsNewTripAdded: (state, action) => {
                state.isNewTripAdded = action.payload;
            },
            setStartDate: (state, action) => {
                state.startDate = action.payload;
            },
            setEndDate: (state, action) => {
                state.endDate = action.payload;
            }
        }
    });

     // action creators
     export const {setIsNewTripAdded, setStartDate, setEndDate} = tripReducer.actions;

     export const selectIsNewTripAdded = (state) => state.newTrip.isNewTripAdded;
     export const selectStartDate = (state) => state.newTrip.startDate;
     export const selectEndDate = (state) => state.newTrip.endDate;
     export default tripReducer;