import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { User } from '../types';
import { backend } from '../services/mockBackend';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigateLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Role is automatically 'user' (Buyer)
      const user = await backend.register(name, email, password);
      onRegisterSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
        <p className="text-slate-500 mt-2">Join BookStore to start reading</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input 
          label="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="John Doe"
          required 
        />
        <Input 
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="john@example.com"
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Create a strong password"
          required 
        />

        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <Button className="w-full" size="lg" isLoading={loading} type="submit">
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button onClick={onNavigateLogin} className="text-brand-600 hover:text-brand-700 font-medium">
          Log in
        </button>
      </div>
      
      <div className="mt-4 text-center text-xs text-slate-400">
        Note: Seller accounts are invitation-only. Please contact support.
      </div>
    </div>
  );
};