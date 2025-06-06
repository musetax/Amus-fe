// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  user: null,
  loading: false,
  error: null,
  shouldSpeak:false
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
    setSpeak: (state, action) => {
       
      state.shouldSpeak = action.payload;
    },
    clearUserData: (state, action) => {
       
      state.user = null;
    },
  },
});

export const { setUserData, restoreState,clearUserData ,setSpeak} = authSlice.actions;
export default authSlice.reducer;
