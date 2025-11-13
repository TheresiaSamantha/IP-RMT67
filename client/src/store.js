import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./features/bookSlice";
import userReducer from "./features/userSlice";
import myListReducer from "./features/myListSlice";

const store = configureStore({
  reducer: {
    books: booksReducer,
    user: userReducer,
    myList: myListReducer,
  },
});

export default store;
