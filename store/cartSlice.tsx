import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  currencyCode: string;
  size: {
    name: string;
    value: string;
  };
  variantId: string;
  merchandise: {
    id: string;
    image: {
      src: string;
      altText: string | null;
    };
    priceV2: {
      amount: number;
      currencyCode: string;
    };
    product: {
      title: string;
      handle: string;
      vendor: string;
    };
  };
  attributes: {
    key: string;
    value: string;
  }[];
}

interface CartState {
  cart: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: [],
  totalPrice: 0,
  totalQuantity: 0,
  isLoading: false,
  error: null,
};

const calculateTotals = (cart: CartItem[]) => {
  return {
    totalQuantity: cart.reduce((total, item) => total + item.quantity, 0),
    totalPrice: cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.variantId === action.payload.variantId
      );

      if (existingItemIndex >= 0) {
        state.cart[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }

      const totals = calculateTotals(state.cart);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(
        (item) => item.id !== action.payload
      );
      const totals = calculateTotals(state.cart);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ lineId: string; quantity: number }>
    ) => {
      const { lineId, quantity } = action.payload;
      
      console.log("=== REDUX UPDATE QUANTITY REDUCER ===");
      console.log("Received lineId:", lineId);
      console.log("Received quantity:", quantity);
      console.log("Current cart items:", state.cart.map(item => ({ id: item.id, title: item.title })));
      
      const item = state.cart.find((item) => item.id === lineId);
      
      console.log("Found item:", item ? { id: item.id, title: item.title, quantity: item.quantity } : "NOT FOUND");

      if (item) {
        item.quantity = quantity;
        const totals = calculateTotals(state.cart);
        state.totalQuantity = totals.totalQuantity;
        state.totalPrice = totals.totalPrice;
        console.log("Item updated successfully");
      } else {
        console.log("Item not found in cart - lineId mismatch");
      }
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
      const totals = calculateTotals(action.payload);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  setLoading,
  setError,
  clearError,
  clearCart,
  setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
