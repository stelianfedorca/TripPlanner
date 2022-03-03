import { configureStore } from "@reduxjs/toolkit";
import placeReducer from "./reducers/placeReducer";
import { userReducer } from "./reducers/userReducer";
import { combineReducers } from "redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from "redux-persist";


const persistConfig = {
    key: 'root',
    version: 2,
    storage: AsyncStorage,
}

    const rootReducer = combineReducers({
        place: placeReducer.reducer,
        user: userReducer.reducer,
    })

    const userPersistReducer = persistReducer(persistConfig, rootReducer)


export default configureStore({
    reducer: userPersistReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:false,
    })
})