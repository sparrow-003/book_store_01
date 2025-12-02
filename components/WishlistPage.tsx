import React, { useState, useEffect } from 'react';
import { Book, User } from '../types';
import { Button } from './Button';
import { backend } from '../services/mockBackend';

interface WishlistPageProps {
  user: User;
  onAddToCart: (book: Book) => void;
  onBookClick: (book: Book) => void;
  onToggleWishlist: (book: Book) => void;
  onNavigateHome: () => void;
}

type SortOption = 'date' | 'price-asc' | 'price-desc' | 'title';

export const WishlistPage: React.FC<WishlistPageProps> = ({
  user,
  onAddToCart,
  onBookClick,
  onToggleWishlist,
  onNavigateHome
}) => {
  const [wishlistBooks, setWishlistBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');

  useEffect(() => {
    const fetchWishlistBooks = async () => {
      setLoading(true);
      try {
        if (!user.wishlist || user.wishlist.length === 0) {
          setWishlistBooks([]);
          setLoading(false);
          return;
        }

        // Fetch details for each book ID in the wishlist
        const bookPromises = user.wishlist.map(id => backend.getBookById(id));
        const books = await Promise.all(bookPromises);
        
        // Filter out undefined (deleted) books and ensure they are valid
        const validBooks = books.filter((b): b is Book => !!b);
        
        setWishlistBooks(validBooks);
      } catch (error) {
        console.error("Failed to load wishlist books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistBooks();
  }, [user.wishlist]);

  const sortedBooks = [...wishlistBooks].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
      default:
        // Sort by index in user.wishlist (descending for newest first)
        // Since the user.wishlist array is ordered chronologically (append on add),
        // higher index means more recently added.
        const indexA = user.wishlist.indexOf(a.id);
        const indexB = user.wishlist.indexOf(b.id);
        return indexB - indexA;
    }
  });

  const handleMoveToCart = (book: Book) => {
    onAddToCart(book);
    onToggleWishlist(book);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-rose-50 rounded-full shadow-sm">
               <svg className="w-7 h-7 text-rose-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
             </div>
             <div>
               <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                 My Wishlist
               </h2>
               <p className="text-slate-500 text-sm">{wishlistBooks.length} {wishlistBooks.length === 1 ? 'book' : 'books'} saved</p>
             </div>
          </div>
          
          {wishlistBooks.length > 0 && (
            <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
              <label htmlFor="sort-wishlist" className="text-sm font-medium text-slate-700 pl-2">Sort:</label>
              <div className="relative">
                <select 
                  id="sort-wishlist"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-brand-500 focus:border-brand-500 block w-full py-2 pl-3 pr-8 cursor-pointer font-medium hover:bg-slate-100 transition-colors"
                >
                  <option value="date">Date Added (Newest)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title">Title (A-Z)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
       </div>
      
      {sortedBooks.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h3>
          <p className="text-slate-500 mb-8 max-w-sm">It looks like you haven't saved any books yet. Explore our collection and heart your favorites!</p>
          <Button onClick={onNavigateHome} size="lg">Start Browsing</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBooks.map(book => (
            <div 
              key={book.id} 
              data-book-id={book.id}
              className="group bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 relative"
            >
               <input type="hidden" name="hidden_book_id" value={book.id} />

               {/* Cover Image */}
               <div 
                 className="w-full sm:w-32 h-48 sm:h-44 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-slate-100 relative"
                 onClick={() => onBookClick(book)}
               >
                 <img 
                   src={book.coverImage} 
                   alt={book.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                 />
               </div>

               {/* Content */}
               <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div className="cursor-pointer" onClick={() => onBookClick(book)}>
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{book.title}</h3>
                      <p className="text-slate-600 font-medium">{book.author}</p>
                    </div>
                    <button 
                      onClick={() => onToggleWishlist(book)}
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-full transition-colors"
                      title="Remove from wishlist"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-3 space-x-3 text-sm text-slate-500">
                     <span className="bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide">{book.category}</span>
                     <div className="flex items-center text-yellow-400 bg-yellow-50 px-2 py-0.5 rounded-full">
                        <span className="text-slate-700 font-bold mr-1">{book.rating}</span>
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                     </div>
                  </div>

                  <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed">{book.description}</p>

                  <div className="mt-auto pt-5 flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900">${book.price.toFixed(2)}</span>
                    <Button onClick={() => handleMoveToCart(book)} className="shadow-sm">
                      Move to Cart
                    </Button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};