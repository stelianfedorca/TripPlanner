import {createSlice} from '@reduxjs/toolkit';

    const initialState = {
        name: 'temp_place',
    }

    export const placeReducer = createSlice({
        name: 'place',
        initialState,
        reducers: {
            setPlace: (state, action) => {
                state.name = action.payload;
            }
        }
    });

    // action creators
    export const {setPlace} = placeReducer.actions;

    export const selectPlace = (state) => state.place.name;

    export default placeReducer;
