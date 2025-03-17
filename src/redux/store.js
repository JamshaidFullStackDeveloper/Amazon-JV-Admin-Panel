import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './GetApiSlice/InvestorsList.jsx'
export const store = configureStore({
  reducer: {
    api: apiReducer,
  },
});
