import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    lastAdditionTime: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const itemInCart = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (itemInCart) {
        if (itemInCart.quantity < 50) 
        { 
        itemInCart.quantity++;
        }
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
      state.lastAdditionTime = Date.now();
    },
    incrementQuantity: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload);
      item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload);
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    removeItem: (state, action) => {
      const removeItem = state.cart.filter(
        (item) => item.id !== action.payload
      );
      state.cart = removeItem;
    },
    addComment: (state, action) => {      
      const item = state.cart.find((item) => item.id === action.payload.id);
     item.comment = action.payload.comment;
    },
    resetCart: (state, action) => {
      state.cart = [];
      state.lastAdditionTime = null;
      // return { ...state, payload: {} };
    },
  },
});

const resetCartAfterTimeout = (dispatch, lastAdditionTime) => {
  setTimeout(() => {
    const currentTime = Date.now();
    const timeSinceLastAddition = currentTime - lastAdditionTime;
    if (timeSinceLastAddition >= 10 * 60 * 10) {
      dispatch(resetCart());
    } else {
      resetCartAfterTimeout(dispatch, lastAdditionTime);
    }
  }, 1000);
};

export const cartReducer = cartSlice.reducer;
export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  resetCart,
  addComment,
} = cartSlice.actions;
export const addToCartWithTimeout = (item) => (dispatch, getState) => {
  dispatch(addToCart(item));
  const lastAdditionTime = getState().cart.lastAdditionTime;
  if (lastAdditionTime) {
    resetCartAfterTimeout(dispatch, lastAdditionTime);
  }
};
