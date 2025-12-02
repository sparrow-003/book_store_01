import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { backend } from '../services/mockBackend';
import { User, Book } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create-seller' | 'users' | 'books'>('create-seller');
  
  // Create Seller State
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerEmail, setNewSellerEmail] = useState('');
  const [newSellerPass, setNewSellerPass] = useState('');
  const [sellerMsg, setSellerMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // User Mgmt State
  const [users, setUsers] = useState<User[]>([]);
  
  // Book Moderation State
  const [pendingBooks, setPendingBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    if (activeTab === 'users') {
      const data = await backend.getUsers();
      setUsers(data);
    } else if (activeTab === 'books') {
      const data = await backend.getPendingBooks();
      setPendingBooks(data);
    }
  };

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    setSellerMsg(null);
    try {
      await backend.createSeller(newSellerName, newSellerEmail, newSellerPass);
      setSellerMsg({ type: 'success', text: 'Seller account created successfully!' });
      setNewSellerName('');
      setNewSellerEmail('');
      setNewSellerPass('');
    } catch (err: any) {
      setSellerMsg({ type: 'error', text: err.message || 'Failed to create seller.' });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await backend.deleteUser(id);
      loadData();
    }
  };

  const handleApproveBook = async (id: string) => {
    await backend.approveBook(id);
    loadData();
  };

  const handleRejectBook = async (id: string) => {
    if (window.confirm("Reject this book listing?")) {
      await backend.rejectBook(id);
      loadData();
    }
  };

  const renderSidebar = () => (
    <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 h-fit">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">Admin Controls</h3>
      <div className="space-y-1">
        <button 
          onClick={() => setActiveTab('create-seller')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'create-seller' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Create Seller
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Manage Users
        </button>
        <button 
          onClick={() => setActiveTab('books')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'books' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Moderate Books
          {pendingBooks.length > 0 && <span className="ml-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingBooks.length}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold">Admin Portal</h2>
        <p className="text-slate-300 mt-2">Manage your platform, users, and content.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {renderSidebar()}

        <div className="flex-1">
          {activeTab === 'create-seller' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                Create New Seller
              </h3>
              <p className="text-sm text-slate-500 mb-6">Sellers cannot sign up themselves. Use this form to generate credentials for a new seller.</p>
              
              <form onSubmit={handleCreateSeller} className="space-y-4">
                <Input label="Seller Name" value={newSellerName} onChange={(e) => setNewSellerName(e.target.value)} placeholder="Business Name or Author Name" required />
                <Input label="Seller Email" type="email" value={newSellerEmail} onChange={(e) => setNewSellerEmail(e.target.value)} placeholder="seller@business.com" required />
                <Input label="Temp Password" type="text" value={newSellerPass} onChange={(e) => setNewSellerPass(e.target.value)} placeholder="Generate a password" required />
                
                {sellerMsg && (
                  <div className={`p-3 rounded-lg text-sm text-center ${sellerMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {sellerMsg.text}
                  </div>
                )}
                <Button className="w-full">Create Seller Account</Button>
              </form>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">User Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                          {u.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'seller' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4 text-right">
                          {u.role !== 'admin' && (
                            <button onClick={() => handleDeleteUser(u.id)} className="text-rose-600 hover:text-rose-800 font-medium">Delete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="space-y-6">
              {pendingBooks.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                  <div className="inline-block p-4 rounded-full bg-emerald-50 mb-4">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
                  <p className="text-slate-500">No books pending approval.</p>
                </div>
              ) : (
                pendingBooks.map(book => (
                  <div key={book.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6">
                    <img src={book.coverImage} alt={book.title} className="w-full sm:w-32 h-48 object-cover rounded-lg bg-slate-100" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">{book.title}</h4>
                          <p className="text-slate-600">{book.author}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Pending Review</span>
                      </div>
                      <p className="text-slate-500 mt-2 text-sm line-clamp-3">{book.description}</p>
                      <div className="mt-3 flex gap-2">
                        {book.tags.map(t => <span key={t} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{t}</span>)}
                      </div>
                      {book.fileUrl && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                           <div className="flex items-center text-sm text-slate-700">
                             <svg className="w-5 h-5 mr-2 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                             <span>Book File (PDF)</span>
                           </div>
                           <a href={book.fileUrl} target="_blank" rel="noreferrer" className="text-brand-600 text-sm font-medium hover:underline">Preview</a>
                        </div>
                      )}
                      <div className="mt-6 flex gap-3">
                        <Button size="sm" onClick={() => handleApproveBook(book.id)}>Approve Listing</Button>
                        <Button size="sm" variant="danger" onClick={() => handleRejectBook(book.id)}>Reject</Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};