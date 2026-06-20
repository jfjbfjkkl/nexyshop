export type ProductType = "game" | "giftcard";

export interface CartDeliveryData {
  playerId?: string;
  region?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  denomination: string;
  price: number;
  quantity: number;
  type: ProductType;
  image?: string;
  art?: string;
  delivery?: CartDeliveryData;
}

export interface CheckoutCustomer {
  email: string;
  firstName: string;
  lastName: string;
}

export interface CheckoutPayload {
  customer: CheckoutCustomer;
  cart: CartItem[];
  currency?: string;
}

export interface ResolvedCheckoutLine {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  denomination: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  delivery?: CartDeliveryData;
}

export interface OrderTokenLine extends ResolvedCheckoutLine {
  providerProductId: number;
  partnerReference: string;
}

export interface OrderTokenPayload {
  orderId: string;
  currency: string;
  createdAt: string;
  customer: CheckoutCustomer;
  items: OrderTokenLine[];
}

export interface FulfillmentRecord {
  partnerReference: string;
  providerProductId: number;
  status: "pending" | "submitted" | "failed";
  astralResponse?: unknown;
  error?: string;
}

export interface StoredOrderRecord {
  orderId: string;
  paymentId: string;
  paymentStatus: string;
  checkoutUrl?: string;
  currency: string;
  amount: number;
  customer: CheckoutCustomer;
  items: OrderTokenLine[];
  fulfillment: FulfillmentRecord[];
  updatedAt: string;
}