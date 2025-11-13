import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiKey } from "../helpers/http-client";

// Simple user slice to hold auth token and basic profile
const initialState = {
  token: (() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  })(),
  profile: null,
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await apiKey.post("/login", { email, password });
      const token = data?.access_token;
      if (!token) throw new Error("Invalid login response");
      try {
        localStorage.setItem("token", token);
      } catch {
        /* ignore */
      }
      return { token };
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ email, password, userName }, { rejectWithValue }) => {
    try {
      const { data } = await apiKey.post("/register", {
        email,
        password,
        userName,
      });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Register failed";
      return rejectWithValue(message);
    }
  }
);

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
      state.status = "idle";
      state.error = null;
      try {
        localStorage.removeItem("token");
      } catch {
        /* ignore */
      }
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setToken, logout, setProfile } = userSlice.actions;
export default userSlice.reducer;
