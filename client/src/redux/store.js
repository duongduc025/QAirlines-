import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import bookingSlice from "./bookingSlice";
import flightSlice from "./flightSlice";
import airCraftSlice from "./airCraftSlice";
import promotionSlice from "./promotionSlice";



const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth:authSlice,
    booking: bookingSlice,
    flight: flightSlice,
    aircraft: airCraftSlice,
    promotion: promotionSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;