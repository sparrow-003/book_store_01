import React, { useState, useEffect } from 'react';
import { Book, Review, User } from '../types';
import { Button } from './Button';
import { backend } from '../services/mockBackend';

interface BookDetailPageProps {
  book: Book;
  onAddToCart: (book: Book) => void;
  onNavigateHome: () => void;
  user: User | null;
  onToggleWishlist: (book: Book) => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({ 
  book, 
  onAddToCart, 
  onNavigateHome, 
  user,
  onToggleWishlist
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  // New Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [book.id]);

  const loadReviews = async () => {
    setLoadingReviews(true);
    const data = await backend.getReviews(book.id);
    setReviews(data);
    setLoadingReviews(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await backend.addReview(book.id, user.id, user.name, rating, comment);
      setComment('');
      setRating(5);
      loadReviews(); // Refresh reviews
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isWishlisted = user?.wishlist?.includes(book.id);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-slate-500">
        <button onClick={onNavigateHome} className="hover:text-brand-600">Home</button>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{book.title}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Image */}
        <div className="md:col-span-1">
          <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-100 relative group">
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex justify-between items-start">
               <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{book.title}</h1>
                  <p className="text-xl text-slate-600">by {book.author}</p>
               </div>
               <div className="flex flex-col gap-2">
                 <button 
                  onClick={() => onToggleWishlist(book)}
                  className={`p-3 rounded-full border transition-all ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500'}`}
                 >
                   <svg className={`w-6 h-6 ${isWishlisted ? 'fill-current' : 'fill-none stroke-current'}`} strokeWidth="2" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>
                 </button>
               </div>
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center text-yellow-400">
                <span className="text-2xl font-bold text-slate-900 mr-2">{book.rating}</span>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(book.rating) ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">{book.reviewsCount} Reviews</span>
              <span className="text-slate-400">|</span>
              <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">{book.category}</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-lg font-semibold text-slate-900">Description</h3>
            <p className="text-slate-600 leading-relaxed">{book.description}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {book.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-sm">#{tag}</span>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-slate-900">${book.price.toFixed(2)}</span>
            </div>
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 shadow-lg shadow-brand-500/30" onClick={() => onAddToCart(book)}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-slate-200 pt-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
        
        {/* Write Review Form */}
        {user ? (
          <form onSubmit={handleSubmitReview} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 focus:outline-none transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-slate-300'}`}
                  >
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
                rows={3}
                placeholder="What did you like or dislike?"
                required
              />
            </div>
            <Button type="submit" disabled={submitting}>Submit Review</Button>
          </form>
        ) : (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 text-center text-slate-500">
            Please login to write a review.
          </div>
        )}

        {/* Reviews List */}
        {loadingReviews ? (
           <div className="space-y-4">
             {[1,2].map(i => (
               <div key={i} className="animate-pulse flex space-x-4">
                 <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                 <div className="flex-1 space-y-2 py-1">
                   <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                   <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                 </div>
               </div>
             ))}
           </div>
        ) : reviews.length === 0 ? (
          <p className="text-slate-500 italic">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                      {review.userName.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-900">{review.userName}</span>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div className="flex text-yellow-400 mb-2">
                   {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                   ))}
                </div>
                <p className="text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};