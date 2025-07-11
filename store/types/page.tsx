import { CartItem } from '../cartSlice'; // Export CartItem interface from cartSlice

export interface RootState {
    cart: {
        items: CartItem[];
        loading: boolean;
        selectedQuantity: number;
    };
    // Add other slices here as needed
}