import { CartItem, Product } from "../types";

export const addToCart = (
    cart: CartItem[],
    product: Product,
    size: string,
    color: string,
    quantity: number = 1
): CartItem[] => {
    const existingItemIndex = cart.findIndex(
        (item) =>
            item.product.id === product.id &&
            item.size === size &&
            item.color === color
    );

    if (existingItemIndex >= 0) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
    }

    return [...cart, { product, size, color, quantity }];
};

export const removeFromCart = (
    cart: CartItem[],
    itemIndex: number
): CartItem[] => {
    return cart.filter((_, index) => index !== itemIndex);
};

export const updateCartItemQuantity = (
    cart: CartItem[],
    itemIndex: number,
    quantity: number
): CartItem[] => {
    if (quantity <= 0) {
        return removeFromCart(cart, itemIndex);
    }

    const updatedCart = [...cart];
    updatedCart[itemIndex].quantity = quantity;
    return updatedCart;
};

export const getCartTotal = (cart: CartItem[]): number => {
    return cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );
};

export const getCartItemCount = (cart: CartItem[]): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
};

export const calculateTax = (
    subtotal: number,
    taxRate: number = 0.08
): number => {
    return subtotal * taxRate;
};

export const calculateShipping = (
    subtotal: number,
    freeShippingThreshold: number = 100
): number => {
    return subtotal >= freeShippingThreshold ? 0 : 15;
};
