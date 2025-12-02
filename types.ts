export type Role = 'user' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  walletBalance: number;
  wishlist: string[];
  password?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  isbn: string;
  category: string;
  coverImage: string;
  sellerId: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  addedAt: string;
  fileUrl?: string;
  apiSource?: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  date: string;
  status: 'completed';
  paymentMethod: string;
  downloadToken?: string;
}

export interface AIRecommendation {
  reason: string;
  bookTitle: string;
}