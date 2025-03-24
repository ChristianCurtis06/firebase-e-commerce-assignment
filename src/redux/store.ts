import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const saveState = (state: RootState) => {
    try {
        const serializedState = JSON.stringify(state.cart);
        sessionStorage.setItem('cartState', serializedState);
    } catch (e) {
        console.error("Could not save state", e);
    }
};

const loadState = () => {
    try {
        const serializedState = sessionStorage.getItem('cartState');
        if (serializedState === null) {
            return undefined;
        }
        return { cart: JSON.parse(serializedState) };
    } catch (e) {
        console.error("Could not load state", e);
        return undefined;
    }
};

const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    preloadedState,
});

store.subscribe(() => {
    saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;