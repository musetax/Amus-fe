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
  },
});

export const { setUserData, restoreState } = authSlice.actions;
export default authSlice.reducer;
