import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { backend } from '../services/mockBackend';
import { generateBookMetadata } from '../services/geminiService';

interface SellerDashboardProps {
  user: User;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ user }) => {
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadPrice, setUploadPrice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSmartFill = async () => {
    if (!uploadTitle || !uploadAuthor) {
      alert("Please enter Title and Author first.");
      return;
    }
    setIsGenerating(true);
    const metadata = await generateBookMetadata(uploadTitle, uploadAuthor);
    setIsGenerating(false);
    
    if (metadata) {
      setUploadDesc(metadata.description);
      setUploadCategory(metadata.category);
      setUploadTags(metadata.tags.join(', '));
    } else {
      alert("Could not generate metadata. Check API Key.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadBook = async () => {
    if (!uploadTitle || !uploadAuthor || !uploadPrice) {
      alert("Please fill in the required fields.");
      return;
    }
    
    if (!file) {
      alert("Please upload a PDF file for your book.");
      return;
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 100);

    // Create a fake URL for the uploaded file (mock)
    const fakeFileUrl = URL.createObjectURL(file);

    await backend.addBook({
      title: uploadTitle,
      author: uploadAuthor,
      description: uploadDesc,
      price: parseFloat(uploadPrice),
      category: uploadCategory,
      isbn: 'MOCK-ISBN-' + Date.now(),
      coverImage: `https://picsum.photos/seed/${uploadTitle}/400/600`,
      sellerId: user.id,
      tags: uploadTags.split(',').map(t => t.trim()),
      fileUrl: fakeFileUrl,
      apiSource: 'manual'
    });
    
    setTimeout(() => {
      alert("Book uploaded successfully! Sent to Admin for approval.");
      // Reset form
      setUploadTitle('');
      setUploadAuthor('');
      setUploadDesc('');
      setUploadPrice('');
      setUploadCategory('');
      setUploadTags('');
      setFile(null);
      setUploadProgress(0);
    }, 600);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4">Seller Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Total Earnings</span>
              <span className="font-bold text-brand-600">${user.walletBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">Books Listed</span>
              <span className="font-bold text-slate-900">12</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white">
          <h3 className="font-bold text-lg mb-2">AI Tools</h3>
          <p className="text-violet-100 text-sm mb-4">Use Gemini AI to auto-generate descriptions and tags for your books to increase sales.</p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-6">List a New Book</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Book Title *" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g. The Great Gatsby" />
              <Input label="Author *" value={uploadAuthor} onChange={(e) => setUploadAuthor(e.target.value)} placeholder="e.g. F. Scott Fitzgerald" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <button 
                  type="button" 
                  onClick={handleSmartFill}
                  disabled={isGenerating}
                  className="text-xs flex items-center text-brand-600 hover:text-brand-700 font-medium"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {isGenerating ? 'Generating...' : 'Auto-Fill with AI'}
                </button>
              </div>
              <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                rows={4}
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Category" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} placeholder="e.g. Fiction" />
              <Input label="Price ($) *" type="number" value={uploadPrice} onChange={(e) => setUploadPrice(e.target.value)} placeholder="19.99" />
            </div>

            <Input label="Tags (comma separated)" value={uploadTags} onChange={(e) => setUploadTags(e.target.value)} placeholder="classic, drama, american" />

            {/* File Upload Section */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-sm text-slate-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                    <span>Upload Book PDF</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1 inline">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PDF up to 50MB</p>
              </div>
              {file && (
                <div className="mt-4 flex items-center justify-between bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm">
                   <span className="truncate max-w-[200px]">{file.name}</span>
                   <span className="font-semibold">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button onClick={handleUploadBook} size="lg" disabled={!file || !uploadTitle}>
                {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Submit for Review'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};