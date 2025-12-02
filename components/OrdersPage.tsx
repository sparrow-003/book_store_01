import React, { useState, useEffect } from 'react';
import { User, Order } from '../types';
import { backend } from '../services/mockBackend';
import { Button } from './Button';

interface OrdersPageProps {
  user: User;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await backend.getUserOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user.id]);

  const handleDownload = (fileUrl: string | undefined, title: string) => {
    if (!fileUrl) {
      alert("Download link not available.");
      return;
    }
    // Simulate secure download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${title}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
     return (
       <div className="flex justify-center items-center py-24">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
       </div>
     );
   }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-brand-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">My Library</h1>
        <p className="text-brand-100">Access and download your purchased books.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
           <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
           <p className="text-lg text-slate-600 font-medium">No books purchased yet.</p>
           <p className="text-slate-400">Your library awaits its first story.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center text-sm text-slate-500">
                  <span>Ordered on {new Date(order.date).toLocaleDateString()}</span>
                  <span className="font-mono">Order #{order.id}</span>
               </div>
               <div className="p-6">
                 {order.items.map((book) => (
                   <div key={book.id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 first:pt-0 last:pb-0 border-b border-slate-50 last:border-0">
                      <div className="w-16 h-24 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg">{book.title}</h4>
                        <p className="text-slate-500 text-sm">{book.author}</p>
                      </div>
                      <div>
                        <Button 
                          onClick={() => handleDownload(book.fileUrl, book.title)}
                          variant="secondary"
                          className="w-full sm:w-auto flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          Download PDF
                        </Button>
                      </div>
                   </div>
                 ))}
               </div>
               <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                 <span className="text-sm font-medium text-slate-600">Total Paid</span>
                 <span className="font-bold text-slate-900">${order.totalAmount.toFixed(2)}</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};