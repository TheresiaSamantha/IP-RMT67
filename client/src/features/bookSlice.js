import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiKey } from "../helpers/http-client";

// Thunk: fetch paginated books from backend
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 12 } = params;
      const { data } = await apiKey.get("/books", {
        params: { page, limit },
      });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Failed to fetch books";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  meta: { total: 0, page: 1, perPage: 12, totalPages: 1 },
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setPage(state, action) {
      state.meta.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        const incoming = action.payload?.data || [];
        const meta = action.payload?.meta || initialState.meta;
        const requestedPage = action.meta?.arg?.page || 1;
        if (requestedPage > 1) {
          // Append for subsequent pages
          state.items = [...state.items, ...incoming];
        } else {
          // First page or refresh
          state.items = incoming;
        }
        state.meta = meta;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load books";
      });
  },
});

export const { setPage } = bookSlice.actions;
export default bookSlice.reducer;
