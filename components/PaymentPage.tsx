import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { CartItem } from '../types';

interface PaymentPageProps {
  cart: CartItem[];
  totalAmount: number;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ cart, totalAmount, onPaymentSuccess, onCancel }) => {
  const [method, setMethod] = useState<'card' | 'paypal' | 'crypto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call for payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onPaymentSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <button onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-800 flex items-center mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          Back to Cart
        </button>
        <h2 className="text-3xl font-bold text-slate-900">Secure Checkout</h2>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Order Summary Column */}
        <div className="order-2 md:order-1 bg-slate-50 p-6 rounded-xl h-fit border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-700">Order Summary</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-4 scrollbar-thin">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm group">
                <span className="text-slate-600 truncate w-2/3 group-hover:text-brand-600">{item.quantity}x {item.title}</span>
                <span className="font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Tax (Est.)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
              <span className="font-bold text-slate-900 text-lg">Total</span>
              <span className="font-bold text-brand-600 text-2xl">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form Column */}
        <div className="order-1 md:order-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-700">Payment Details</h3>
          
          {/* Method Selection */}
          <div className="flex space-x-2 mb-6 p-1 bg-slate-100 rounded-lg">
             {['card', 'paypal', 'crypto'].map((m) => (
               <button 
                 key={m}
                 onClick={() => setMethod(m as any)}
                 className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${method === m ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {m}
               </button>
             ))}
          </div>

          <form onSubmit={handlePay} className="space-y-4">
            {method === 'card' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <Input label="Cardholder Name" placeholder="John Doe" required />
                <div className="relative">
                  <Input label="Card Number" placeholder="0000 0000 0000 0000" maxLength={19} required />
                  <div className="absolute top-9 right-3 flex space-x-1">
                     <div className="w-8 h-5 bg-slate-200 rounded"></div>
                     <div className="w-8 h-5 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Input label="Expiry" placeholder="MM/YY" className="flex-1" maxLength={5} required />
                  <Input label="CVV" placeholder="123" className="flex-1" maxLength={4} type="password" required />
                </div>
              </div>
            )}
            
            {method === 'paypal' && (
              <div className="p-6 bg-blue-50 text-blue-800 rounded-lg text-sm text-center border border-blue-100 animate-in fade-in">
                <svg className="w-12 h-12 mx-auto mb-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.946 5.05-4.331 6.794-9.02 6.794h-2.13c-.372 0-.678.298-.739.663l-.718 4.347h5.26a.641.641 0 0 1 .633.74l-.447 2.684a.641.641 0 0 1-.633.545H7.076z"/></svg>
                <p className="font-semibold">PayPal Secure Checkout</p>
                <p className="mt-1 opacity-80">You will be redirected to PayPal to complete your purchase safely.</p>
              </div>
            )}
            
            {method === 'crypto' && (
               <div className="p-4 bg-slate-50 text-slate-600 rounded-lg text-sm text-center border border-slate-200 animate-in fade-in">
                 <p className="mb-2">Send exactly <strong className="text-slate-900">{(totalAmount / 45000).toFixed(6)} BTC</strong> to:</p>
                 <div className="bg-white p-2 rounded border border-slate-300 font-mono text-xs text-slate-800 break-all select-all">
                   1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
                 </div>
                 <p className="mt-2 text-xs text-slate-400">Scan QR code support coming soon.</p>
               </div>
            )}

            <div className="pt-4 flex flex-col gap-3">
              <Button type="submit" size="lg" className="w-full shadow-lg hover:shadow-xl transition-shadow" isLoading={isProcessing}>
                {method === 'paypal' ? 'Continue to PayPal' : `Pay $${totalAmount.toFixed(2)}`}
              </Button>
              <div className="flex justify-center items-center space-x-2 text-xs text-slate-400 mt-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span>Payments are secure and encrypted.</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};