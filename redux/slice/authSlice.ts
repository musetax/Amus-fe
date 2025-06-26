// src/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  user: null,
  loading: false,
  error: null,
  isFormFill:false
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
 
    setFormSubmitted: (state, action) => {
       
      state.isFormFill = action.payload;
    },
 
 
    clearUserData: (state, action) => {
       
      state.user = null;
      state.isFormFill = false;

    },
  },
});

export const { setUserData, restoreState,clearUserData,setFormSubmitted } = authSlice.actions;
export default authSlice.reducer;
