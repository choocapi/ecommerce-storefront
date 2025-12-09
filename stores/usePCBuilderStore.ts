import type { IProduct } from '@/types/products';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface PCBuilderComponent {
  product: IProduct;
  quantity: number;
}

interface PCBuilderState {
  components: Record<string, PCBuilderComponent>;
  addComponent: (categorySlug: string, product: IProduct, quantity?: number) => void;
  removeComponent: (categorySlug: string) => void;
  updateQuantity: (categorySlug: string, quantity: number) => void;
  clearConfig: () => void;
  getTotalPrice: () => number;
  getComponent: (categorySlug: string) => PCBuilderComponent | undefined;
}

export const usePCBuilderStore = create<PCBuilderState>()(
  persist(
    (set, get) => ({
      components: {},

      addComponent: (categorySlug, product, quantity = 1) => {
        set((state) => ({
          components: {
            ...state.components,
            [categorySlug]: {
              product,
              quantity: Math.max(1, quantity),
            },
          },
        }));
      },

      removeComponent: (categorySlug) => {
        set((state) => {
          const newComponents = { ...state.components };
          delete newComponents[categorySlug];
          return { components: newComponents };
        });
      },

      updateQuantity: (categorySlug, quantity) => {
        set((state) => {
          const component = state.components[categorySlug];
          if (!component) return state;

          return {
            components: {
              ...state.components,
              [categorySlug]: {
                ...component,
                quantity: Math.max(1, quantity),
              },
            },
          };
        });
      },

      clearConfig: () => {
        set({ components: {} });
      },

      getTotalPrice: () => {
        const { components } = get();
        return Object.values(components).reduce((total, component) => {
          return total + component.product.price * component.quantity;
        }, 0);
      },

      getComponent: (categorySlug) => {
        return get().components[categorySlug];
      },
    }),
    {
      name: 'pc-builder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ components: state.components }),
    },
  ),
);
