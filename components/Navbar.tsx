import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ user, cartCount, onLogout, onNavigate, currentPage }) => {
  const isActive = (page: string) => currentPage === page ? 'text-brand-600 font-semibold' : 'text-slate-600 hover:text-brand-600';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
              BookStore
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className={isActive('home')}>Browse</button>
            {user && (
              <>
                <button onClick={() => onNavigate('wishlist')} className={isActive('wishlist')}>Wishlist</button>
                <button onClick={() => onNavigate('orders')} className={isActive('orders')}>My Library</button>
              </>
            )}
            {user && user.role === 'seller' && (
              <button onClick={() => onNavigate('seller')} className={isActive('seller')}>Seller Dashboard</button>
            )}
            {user && user.role === 'admin' && (
              <button onClick={() => onNavigate('admin')} className={isActive('admin')}>Admin Portal</button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('cart')} className="relative p-2 text-slate-600 hover:text-brand-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
                <button 
                  onClick={onLogout}
                  className="text-sm text-slate-500 hover:text-rose-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button onClick={() => onNavigate('login')} className="px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg">
                  Login
                </button>
                <button onClick={() => onNavigate('register')} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};