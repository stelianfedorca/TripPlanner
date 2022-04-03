import { configureStore, createAction } from "@reduxjs/toolkit";
import placeReducer from "./reducers/placeReducer";
import { userReducer } from "./reducers/userReducer";
import { combineReducers } from "redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from "redux-persist";
import tripReducer from "./reducers/tripReducer";
import searchReducer from "./reducers/searchReducer";


const persistConfig = {
    key: 'root',
    version: 2,
    storage: AsyncStorage,
}

    const rootReducer = combineReducers({
        place: placeReducer.reducer,
        user: userReducer.reducer,
        newTrip: tripReducer.reducer,
        search: searchReducer.reducer,
    });

    export const resetAction = createAction('reset');

    const resettableReducer = (state, action) => {
        if(resetAction.match(action)) {
            return rootReducer(undefined, action);
        }

        return rootReducer(state,action);
    }

    const userPersistReducer = persistReducer(persistConfig, resettableReducer)


export default configureStore({
    reducer: userPersistReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:false,
        immutableCheck:false,
    }),
})