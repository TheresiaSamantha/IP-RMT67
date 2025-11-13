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

// Thunk: fetch single book detail (and trigger AI summary generation if missing)
export const fetchBookDetail = createAsyncThunk(
  "books/fetchBookDetail",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiKey.get(`/books/${id}`);
      return data; // single book object, includes aiSummary
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch book detail";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  meta: { total: 0, page: 1, perPage: 12, totalPages: 1 },
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  details: {}, // cache by id: { data, status, error }
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
      })
      // Detail fetching
      .addCase(fetchBookDetail.pending, (state, action) => {
        const id = action.meta.arg;
        state.details[id] = state.details[id] || {};
        state.details[id].status = "loading";
        state.details[id].error = null;
      })
      .addCase(fetchBookDetail.fulfilled, (state, action) => {
        const book = action.payload;
        const id = book?.id;
        if (id != null) {
          state.details[id] = {
            status: "succeeded",
            error: null,
            data: book,
          };
          // If this book exists in items, update it (e.g., aiSummary)
          const idx = state.items.findIndex((b) => b.id === id);
          if (idx !== -1) {
            state.items[idx] = { ...state.items[idx], ...book };
          }
        }
      })
      .addCase(fetchBookDetail.rejected, (state, action) => {
        const id = action.meta.arg;
        state.details[id] = state.details[id] || {};
        state.details[id].status = "failed";
        state.details[id].error =
          action.payload || "Failed to load book detail";
      });
  },
});

export const { setPage } = bookSlice.actions;
export default bookSlice.reducer;
