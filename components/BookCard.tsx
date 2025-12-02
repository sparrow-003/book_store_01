import React from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
  onClick: (book: Book) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onAddToCart, 
  onClick, 
  isWishlisted, 
  onToggleWishlist 
}) => {
  return (
    <div 
      data-book-id={book.id}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full relative"
    >
      <input type="hidden" name="book_id" value={book.id} />
      
      <div 
        className="relative h-64 overflow-hidden cursor-pointer bg-slate-100"
        onClick={() => onClick(book)}
      >
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          loading="lazy"
        />
        {/* Category Tag */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-brand-700 shadow-sm">
          {book.category}
        </div>

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(book); }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-rose-500 shadow-sm transition-all hover:scale-110"
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isWishlisted ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="cursor-pointer" onClick={() => onClick(book)}>
          <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">{book.title}</h3>
          <p className="text-sm text-slate-500 mb-2">{book.author}</p>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 text-sm">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-slate-400 ml-1">({book.reviewsCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">${book.price.toFixed(2)}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(book); }}
            className="p-2 rounded-full bg-slate-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};