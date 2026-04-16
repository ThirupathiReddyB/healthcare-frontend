import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import pageReducer from "./user/pageSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Configure the persist settings
const persistConfig = {
  key: "root", // key for the persisted store in storage
  storage, // storage engine to use
};

// Combine reducers
const rootReducer = combineReducers({
  storeUserData: userReducer,
  storePageData: pageReducer,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with the persisted reducer


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore these actions
      },
    }),
});

export const persistor = persistStore(store); // Persistor for persisting the store

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
