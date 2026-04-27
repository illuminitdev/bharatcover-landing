import { api } from '@/lib/api';
import { guestFetch } from '@/lib/guest-api';

export const productService = {
  list() {
    return api.get('/products');
  },
  byId(productId: string) {
    return api.get(`/products/${encodeURIComponent(productId)}`);
  },
  byIdForGuestCheckout(productId: string) {
    return guestFetch(`/products/${encodeURIComponent(productId)}`);
  },
};
