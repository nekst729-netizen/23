import { configureStore } from '@reduxjs/toolkit';
import spreadsheetReducer from '@/features/spreadsheet/store/spreadsheetSlice';

export const store = configureStore({
  reducer: {
    spreadsheet: spreadsheetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;