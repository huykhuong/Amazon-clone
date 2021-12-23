import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  changed: false,
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    replaceCart(state, action) {
      state.items = action.payload.items;
    },
    addToBasket: (state, action) => {
      state.items = [...state.items, action.payload];
      state.changed = true;
    },
    removeFromBasket: (state, action) => {
      // const existingItem = state.items.find(
      //   (item) => item.id === action.payload
      // );
      state.changed = true;
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const basketActions = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;
export const cartChanged = (state) => state.basket.changed;
export const selectTotal = (state) =>
  state.basket.items.reduce((total, item) => total + item.price, 0);

export default basketSlice.reducer;
