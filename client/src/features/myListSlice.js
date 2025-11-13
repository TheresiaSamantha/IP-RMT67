import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiKey } from "../helpers/http-client";

// Helpers to attach auth header from user slice
const withAuth = (getState) => {
  const token = getState()?.user?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchMyList = createAsyncThunk(
  "myList/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const headers = withAuth(getState);
      const { data } = await apiKey.get("/mylist", { headers });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch my list";
      return rejectWithValue(message);
    }
  }
);

export const addToMyList = createAsyncThunk(
  "myList/add",
  async (bookId, { getState, rejectWithValue }) => {
    try {
      const headers = withAuth(getState);
      const { data } = await apiKey.post(`/mylist/${bookId}`, null, {
        headers,
      });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Failed to add to list";
      return rejectWithValue(message);
    }
  }
);

export const removeFromMyList = createAsyncThunk(
  "myList/remove",
  async (id, { getState, rejectWithValue }) => {
    try {
      const headers = withAuth(getState);
      await apiKey.delete(`/mylist/${id}`, { headers });
      return id;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Failed to remove from list";
      return rejectWithValue(message);
    }
  }
);

export const updateMyListNote = createAsyncThunk(
  "myList/updateNote",
  async ({ id, note }, { getState, rejectWithValue }) => {
    try {
      const headers = withAuth(getState);
      const { data } = await apiKey.patch(
        `/mylist/${id}`,
        { note },
        { headers }
      );
      return data; // { message, data: updatedItem }
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Failed to update note";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const myListSlice = createSlice({
  name: "myList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchMyList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToMyList.fulfilled, (state, action) => {
        // Backend returns { message, data } where data is the MyList item
        const newItem = action.payload?.data || action.payload;
        if (!newItem?.id) return;
        const exists = state.items.some((i) => i.id === newItem.id);
        if (!exists) state.items.push(newItem);
      })
      .addCase(removeFromMyList.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((i) => i.id !== id);
      })
      .addCase(updateMyListNote.fulfilled, (state, action) => {
        const updated = action.payload?.data || action.payload;
        if (!updated?.id) return;
        const idx = state.items.findIndex((i) => i.id === updated.id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...updated };
        }
      });
  },
});

export default myListSlice.reducer;
