import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BookCard } from './components/BookCard';
import { Button } from './components/Button';
import { ChatBot } from './components/ChatBot';
import { WishlistPage } from './components/WishlistPage';
import { PaymentPage } from './components/PaymentPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { AdminDashboard } from './components/AdminDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { BookDetailPage } from './components/BookDetailPage';
import { OrdersPage } from './components/OrdersPage';
import { backend } from './services/mockBackend';
import { getBookRecommendations } from './services/geminiService';
import { User, Book, CartItem } from './types';

function App() {
  // --- STATE ---
  const [currentPage, setCurrentPage] = useState('home'); // home, login, register, seller, admin, cart, checkout, book-detail, wishlist, orders
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // --- EFFECTS ---
  useEffect(() => {
    loadBooks();
    const storedUser = localStorage.getItem('bs_active_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.wishlist) parsedUser.wishlist = [];
      setUser(parsedUser);
    }
  }, []);

  const loadBooks = async () => {
    const data = await backend.getBooks();
    setBooks(data);
  };

  // --- HANDLERS ---
  const handleAuthSuccess = (u: User) => {
    setUser(u);
    localStorage.setItem('bs_active_user', JSON.stringify(u));
    if (u.role === 'admin') {
      setCurrentPage('admin');
    } else if (u.role === 'seller') {
      setCurrentPage('seller');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bs_active_user');
    setCurrentPage('home');
  };

  const addToCart = (book: Book) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === book.id);
      if (exists) {
        return prev.map(item => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const handleToggleWishlist = async (book: Book) => {
    if (!user) {
      alert("Please login to use the wishlist.");
      setCurrentPage('login');
      return;
    }
    
    try {
      const updatedWishlist = await backend.toggleWishlist(user.id, book.id);
      const updatedUser = { ...user, wishlist: updatedWishlist };
      setUser(updatedUser);
      localStorage.setItem('bs_active_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Wishlist update failed", err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }

    const textResults = await backend.searchBooks(searchQuery);
    
    // AI Recommender (Mock)
    if (textResults.length === 0) {
      const recommendations = await getBookRecommendations(searchQuery, books);
      if (recommendations && recommendations.length > 0) {
        const recIds = recommendations.map((r: any) => r.bookId);
        const aiBooks = books.filter(b => recIds.includes(b.id));
        setBooks(aiBooks);
        return;
      }
    }
    setBooks(textResults);
  };

  const handlePaymentSuccess = async () => {
    if (user) {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await backend.createOrder(user.id, cart, total);
    }
    setCart([]);
    alert('Payment Successful! Your books are now available in My Library.');
    setCurrentPage('orders');
  };

  // --- VIEWS ---

  const renderHome = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-700 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to BookStore</h1>
          <p className="text-brand-100 text-lg mb-8 leading-relaxed">
            Your one-stop destination for all things books! Whether you’re a passionate reader, exploring new titles, or searching for the perfect gift, BookStore connects you to a world of reading.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search by title, author, or topic..." 
              className="flex-1 px-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="lg" className="rounded-xl shadow-lg">Search</Button>
          </form>
        </div>
      </div>

      {/* Book Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Featured Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onAddToCart={addToCart} 
              onClick={(b) => { setSelectedBook(b); setCurrentPage('book-detail'); }}
              isWishlisted={user?.wishlist?.includes(book.id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
          {books.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No books found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCart = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <p className="text-slate-500 mb-4">Your cart is empty.</p>
          <Button onClick={() => setCurrentPage('home')}>Browse Books</Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {cart.map(item => (
              <li key={item.id} data-book-id={item.id} className="p-6 flex items-center justify-between">
                <input type="hidden" name="cart_book_id" value={item.id} />
                <div className="flex items-center space-x-4">
                  <img src={item.coverImage} className="w-16 h-24 object-cover rounded" alt={item.title} />
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.author}</p>
                    <p className="text-brand-600 font-medium mt-1">${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
            <span className="text-xl font-bold text-slate-900">Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
            <Button size="lg" onClick={() => setCurrentPage('checkout')}>Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar 
        user={user} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'book-detail' && selectedBook && (
          <BookDetailPage 
            book={selectedBook}
            onAddToCart={addToCart}
            onNavigateHome={() => setCurrentPage('home')}
            user={user}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
        
        {/* Auth Pages */}
        {currentPage === 'login' && (
          <LoginPage 
            onLoginSuccess={handleAuthSuccess} 
            onNavigateRegister={() => setCurrentPage('register')} 
          />
        )}
        {currentPage === 'register' && (
          <RegisterPage 
            onRegisterSuccess={handleAuthSuccess} 
            onNavigateLogin={() => setCurrentPage('login')} 
          />
        )}
        
        {/* User Specific Pages */}
        {currentPage === 'wishlist' && user && (
          <WishlistPage 
            user={user}
            onAddToCart={addToCart}
            onBookClick={(b) => { setSelectedBook(b); setCurrentPage('book-detail'); }}
            onToggleWishlist={handleToggleWishlist}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'orders' && user && (
           <OrdersPage user={user} />
        )}
        
        {/* Role Specific Pages */}
        {currentPage === 'seller' && user?.role === 'seller' && (
           <SellerDashboard user={user} />
        )}
        {currentPage === 'admin' && user?.role === 'admin' && <AdminDashboard />}
        
        {/* Access Control Fallbacks */}
        {(currentPage === 'admin' || currentPage === 'seller') && user?.role !== currentPage && (
           <div className="text-center py-20 text-slate-500">
             <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
             <p>You do not have permission to view this page.</p>
           </div>
        )}

        {/* Cart/Checkout */}
        {currentPage === 'cart' && renderCart()}
        {currentPage === 'checkout' && (
          <PaymentPage 
            cart={cart}
            totalAmount={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={() => setCurrentPage('cart')}
          />
        )}
      </main>

      <ChatBot />
    </div>
  );
}

export default App;