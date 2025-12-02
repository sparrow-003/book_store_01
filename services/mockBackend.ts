import { User, Book, Review, CartItem, Order } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alice Reader',
    email: 'alice@example.com',
    password: 'password123',
    role: 'user',
    walletBalance: 100,
    avatar: 'https://picsum.photos/seed/alice/100/100',
    wishlist: []
  },
  {
    id: 's1',
    name: 'John Publisher',
    email: 'john@example.com',
    password: 'password123',
    role: 'seller',
    walletBalance: 500,
    avatar: 'https://picsum.photos/seed/john/100/100',
    wishlist: []
  },
  {
    id: 'a1',
    name: 'Alex Admin',
    email: 'alex@123',
    password: 'alex@123',
    role: 'admin',
    walletBalance: 0,
    avatar: 'https://picsum.photos/seed/admin/100/100',
    wishlist: []
  }
];

const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'The Future of AI',
    author: 'Dr. Sarah Connor',
    description: 'A deep dive into artificial intelligence and its impact on humanity. This book explores neural networks, machine learning, and the ethical implications of sentient code.',
    price: 29.99,
    isbn: '978-3-16-148410-0',
    category: 'Technology',
    coverImage: 'https://picsum.photos/seed/tech/400/600',
    sellerId: 's1',
    rating: 4.5,
    reviewsCount: 12,
    tags: ['AI', 'Tech', 'Future'],
    status: 'approved',
    addedAt: new Date().toISOString(),
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'b2',
    title: 'Mystery at the Manor',
    author: 'Arthur Doyle',
    description: 'A classic whodunit set in the rolling hills of England. When the Duke is found dead, only one detective can solve the case.',
    price: 14.99,
    isbn: '978-1-40-289462-6',
    category: 'Mystery',
    coverImage: 'https://picsum.photos/seed/mystery/400/600',
    sellerId: 's1',
    rating: 4.8,
    reviewsCount: 45,
    tags: ['Crime', 'Thriller', 'Classic'],
    status: 'approved',
    addedAt: new Date().toISOString(),
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'b3',
    title: 'Cosmic Voyage',
    author: 'Neil Sagan',
    description: 'Journey through the stars in this illustrated guide to our universe. From black holes to nebulas, experience the grandeur of space.',
    price: 35.00,
    isbn: '978-0-74-327356-5',
    category: 'Science',
    coverImage: 'https://picsum.photos/seed/space/400/600',
    sellerId: 's1',
    rating: 4.2,
    reviewsCount: 8,
    tags: ['Space', 'Science', 'Astronomy'],
    status: 'approved',
    addedAt: new Date().toISOString(),
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    bookId: 'b1',
    userId: 'u1',
    userName: 'Alice Reader',
    rating: 5,
    comment: 'Absolutely fascinating read! The chapters on neural networks were particularly enlightening.',
    date: new Date().toISOString()
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockBackend {
  private users: User[] = [];
  private books: Book[] = [];
  private orders: Order[] = [];
  private reviews: Review[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const storedUsers = localStorage.getItem('bs_users');
    const storedBooks = localStorage.getItem('bs_books');
    const storedOrders = localStorage.getItem('bs_orders');
    const storedReviews = localStorage.getItem('bs_reviews');

    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      this.users = this.users.map(u => ({ 
        ...u, 
        wishlist: u.wishlist || [],
        password: u.password || 'password123'
      }));
    } else {
      this.users = MOCK_USERS;
      this.saveUsers();
    }

    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    } else {
      this.books = MOCK_BOOKS;
      this.saveBooks();
    }

    if (storedOrders) {
      this.orders = JSON.parse(storedOrders);
    } else {
      this.orders = [];
    }

    if (storedReviews) {
      this.reviews = JSON.parse(storedReviews);
    } else {
      this.reviews = MOCK_REVIEWS;
      this.saveReviews();
    }
  }

  private saveUsers() { localStorage.setItem('bs_users', JSON.stringify(this.users)); }
  private saveBooks() { localStorage.setItem('bs_books', JSON.stringify(this.books)); }
  private saveOrders() { localStorage.setItem('bs_orders', JSON.stringify(this.orders)); }
  private saveReviews() { localStorage.setItem('bs_reviews', JSON.stringify(this.reviews)); }

  // Auth
  async login(email: string, password?: string): Promise<User | null> {
    await delay(600);
    const user = this.users.find(u => u.email === email && u.password === password);
    return user || null;
  }

  async register(name: string, email: string, password?: string): Promise<User> {
    await delay(600);
    if (this.users.some(u => u.email === email)) throw new Error("User already exists");

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: password || 'password123',
      role: 'user',
      walletBalance: 0,
      avatar: `https://picsum.photos/seed/${name}/100/100`,
      wishlist: []
    };
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  async createSeller(name: string, email: string, password?: string): Promise<User> {
    await delay(500);
     if (this.users.some(u => u.email === email)) throw new Error("User already exists");

    const newSeller: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: password || 'seller123',
      role: 'seller',
      walletBalance: 0,
      avatar: `https://picsum.photos/seed/${name}/100/100`,
      wishlist: []
    };
    this.users.push(newSeller);
    this.saveUsers();
    return newSeller;
  }

  async getUsers(): Promise<User[]> {
    await delay(300);
    return this.users;
  }

  async deleteUser(id: string): Promise<void> {
    await delay(300);
    this.users = this.users.filter(u => u.id !== id);
    this.saveUsers();
  }

  async toggleWishlist(userId: string, bookId: string): Promise<string[]> {
    await delay(200);
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    if (!user.wishlist) user.wishlist = [];

    const index = user.wishlist.indexOf(bookId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(bookId);
    }
    
    this.saveUsers();
    return user.wishlist;
  }

  // Books
  async getBooks(): Promise<Book[]> {
    await delay(400);
    return this.books.filter(b => b.status === 'approved');
  }

  async getPendingBooks(): Promise<Book[]> {
    await delay(300);
    return this.books.filter(b => b.status === 'pending');
  }

  async getBookById(id: string): Promise<Book | undefined> {
    await delay(200);
    return this.books.find(b => b.id === id);
  }

  async addBook(book: Omit<Book, 'id' | 'rating' | 'reviewsCount' | 'status' | 'addedAt'>): Promise<Book> {
    await delay(800);
    const newBook: Book = {
      ...book,
      id: Math.random().toString(36).substr(2, 9),
      rating: 0,
      reviewsCount: 0,
      status: 'pending',
      addedAt: new Date().toISOString()
    };
    this.books.push(newBook);
    this.saveBooks();
    return newBook;
  }

  async approveBook(id: string): Promise<void> {
    await delay(300);
    const bookIndex = this.books.findIndex(b => b.id === id);
    if (bookIndex > -1) {
      this.books[bookIndex].status = 'approved';
      this.saveBooks();
    }
  }

  async rejectBook(id: string): Promise<void> {
    await delay(300);
    const bookIndex = this.books.findIndex(b => b.id === id);
    if (bookIndex > -1) {
      this.books[bookIndex].status = 'rejected';
      this.saveBooks();
    }
  }

  async deleteBook(id: string): Promise<void> {
    await delay(300);
    this.books = this.books.filter(b => b.id !== id);
    this.saveBooks();
  }

  async searchBooks(query: string): Promise<Book[]> {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return this.books.filter(b => 
      b.status === 'approved' && (
        b.title.toLowerCase().includes(lowerQuery) ||
        b.author.toLowerCase().includes(lowerQuery) ||
        b.category.toLowerCase().includes(lowerQuery) ||
        b.tags.some(t => t.toLowerCase().includes(lowerQuery))
      )
    );
  }

  // Orders
  async createOrder(userId: string, cartItems: CartItem[], totalAmount: number): Promise<Order> {
    await delay(1000);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      items: cartItems,
      totalAmount,
      date: new Date().toISOString(),
      status: 'completed',
      paymentMethod: 'card',
      downloadToken: Math.random().toString(36).substr(2, 12)
    };
    this.orders.unshift(newOrder); // Add to beginning
    this.saveOrders();
    return newOrder;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    await delay(500);
    return this.orders.filter(o => o.userId === userId);
  }

  // Reviews
  async getReviews(bookId: string): Promise<Review[]> {
    await delay(300);
    return this.reviews.filter(r => r.bookId === bookId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addReview(bookId: string, userId: string, userName: string, rating: number, comment: string): Promise<Review> {
    await delay(600);
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      bookId,
      userId,
      userName,
      rating,
      comment,
      date: new Date().toISOString()
    };
    
    this.reviews.push(newReview);
    this.saveReviews();

    // Update Book Rating
    const bookIndex = this.books.findIndex(b => b.id === bookId);
    if (bookIndex > -1) {
      const book = this.books[bookIndex];
      const newCount = book.reviewsCount + 1;
      // Weighted Average
      const newRating = ((book.rating * book.reviewsCount) + rating) / newCount;
      
      this.books[bookIndex] = {
        ...book,
        reviewsCount: newCount,
        rating: parseFloat(newRating.toFixed(1))
      };
      this.saveBooks();
    }

    return newReview;
  }
}

export const backend = new MockBackend();