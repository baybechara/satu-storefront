import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  product: any
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: any, quantity: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id)
          if (existingItem) {
            return {
              items: state.items.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            }
          }
          return { items: [...state.items, { product, quantity }] }
        })
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId)
        }))
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(item => 
            item.product.id === productId 
              ? { ...item, quantity }
              : item
          )
        }))
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    }),
    {
      name: 'cart-storage',
    }
  )
)
