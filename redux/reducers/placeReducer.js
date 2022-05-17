import {createSlice} from '@reduxjs/toolkit';

    const initialState = {
        id: "",
        name: 'temp_place',
    }

    export const placeReducer = createSlice({
        name: 'place',
        initialState,
        reducers: {
            setPlace: (state, action) => {
                state.name = action.payload;
            },
            setPlaceId: (state, action) => {
                state.id = action.payload;
            }
        }
    });

    // action creators
    export const {setPlace, setPlaceId} = placeReducer.actions;

    export const selectPlaceId = (state) => state.place.id;
    export const selectPlace = (state) => state.place.name;
    export default placeReducer;
