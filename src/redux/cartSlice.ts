import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../queries/Products';

interface CartState {
    cart: Product[];
}

const initialState: CartState = {
    cart: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            const existingProduct = state.cart.find(product => product.id === action.payload.id);
            if (existingProduct) {
                existingProduct.quantity = (existingProduct.quantity || 1) + 1;
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
        },
        removeProduct: (state, action: PayloadAction<number>) => {
            state.cart = state.cart.filter(product => product.id !== action.payload);
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const existingProduct = state.cart.find(product => product.id === action.payload.id);
            if (existingProduct) {
                existingProduct.quantity = action.payload.quantity;
            }
        },
        clearCart: (state) => {
            state.cart = [];
        },
    },
});

export const { addProduct, removeProduct, updateProduct, clearCart } = cartSlice.actions;
export default cartSlice.reducer;