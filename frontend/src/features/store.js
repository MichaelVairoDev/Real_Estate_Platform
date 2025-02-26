import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import propertyReducer from './properties/propertySlice';
import favoriteReducer from './favorites/favoriteSlice';
import messageReducer from './messages/messageSlice';
import uiReducer from './ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    favorites: favoriteReducer,
    messages: messageReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 