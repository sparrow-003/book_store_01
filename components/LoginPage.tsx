import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { User } from '../types';
import { backend } from '../services/mockBackend';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await backend.login(email, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('Invalid credentials. For Admin, use alex@123 / alex@123');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-slate-500 mt-2">Log in to your BookStore account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Email or ID" 
          type="text" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="e.g. alex@123" 
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <Button className="w-full" size="lg" isLoading={loading} type="submit">
          Log In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button onClick={onNavigateRegister} className="text-brand-600 hover:text-brand-700 font-medium">
          Sign up as a Reader
        </button>
      </div>
      
      {/* Demo Hints */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
        <p className="mb-1">Admin: alex@123 / alex@123</p>
        <p>User: alice@example.com / password123</p>
      </div>
    </div>
  );
};