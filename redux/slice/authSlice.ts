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
    setWorkAddress: (state, action) => {
      state.workAddress = action.payload;
    },
  },
});

export const { setWorkAddress, restoreState } = authSlice.actions;
export default authSlice.reducer;
