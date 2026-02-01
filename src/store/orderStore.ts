import {create} from "zustand"
import type { OrderItem } from "../types/order"

interface CreateOrderPayload {
    items: OrderItem[],
    addToCart: (item: OrderItem) => void,
    removeFromCart: (id: string) => void,
    updateQuantity: (id: string, quantity: number) => void,
    clearCart: () => void,
    totalAmount: () => number,
}

export const useOrderStore = create<CreateOrderPayload>((set, get) => ({
    items: [],
    addToCart: (item) => {
        const existingItem = get().items.find(i => i.id === item.id);
        if(existingItem) {
            set({
                items: get().items.map(i => 
                    i.id === item.id ? {
                        ...i,
                        quantity: i.quantity + item.quantity,
                        total: (i.quantity + item.quantity) * i.price
                    } : i
                )
            })
        } else {
            set({items: [...get().items, { ...item, total: item.price * item.quantity }]})
        }
    },
    removeFromCart: (id: string) => {
        set({ items: get().items.filter(item => item.id !== id) })
    },
    updateQuantity: (id: string, quantity: number = 1) => {
        set({
            items: get().items.map(item =>
                item.id === id ? { ...item, quantity, total: item.price * quantity } : item
            )
        });
    },
    clearCart: () => set({ items: [] }),
    totalAmount: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}))

