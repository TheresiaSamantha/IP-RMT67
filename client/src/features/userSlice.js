import { createSlice } from "@reduxjs/toolkit";

// Simple user slice to hold auth token and basic profile
const initialState = {
  token: null,
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    logout(state) {
      state.token = null;
      state.profile = null;
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
  },
});

export const { setToken, logout, setProfile } = userSlice.actions;
export default userSlice.reducer;
