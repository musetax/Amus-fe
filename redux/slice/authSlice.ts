// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreState: (state) => {
      return initialState; // Reset state to initial state
    },
    setUserData: (state, action) => {
      console.log(action.payload,'action.payloadaction.payloadaction.payload');
      
      state.user = action.payload;
    },
    clearUserData: (state, action) => {
       
      state.user = null;
    },
  },
});

export const { setUserData, restoreState,clearUserData } = authSlice.actions;
export default authSlice.reducer;
