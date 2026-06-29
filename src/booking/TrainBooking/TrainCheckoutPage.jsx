import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, CreditCard, Landmark, Wallet, Eye } from 'lucide-react';

export default function FlightCheckoutPage() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const paymentMethods = [
    {
      id: 'upi',
      title: 'UPI Options',
      description: 'Pay Directly From Your Bank Account',
      icon: (
        <div className="w-6 h-6 flex items-center justify-center font-black text-xs italic text-orange-600 bg-orange-50 rounded">
          UPI
        </div>
      ),
    },
    {
      id: 'cards',
      title: 'Credit & Debit Cards',
      description: 'Visa, Mastercard, Amex, Rupay and more',
      icon: <CreditCard className="w-6 h-6 text-blue-600" />,
    },
    {
      id: 'netbanking',
      title: 'Net Banking',
      description: '40+ Banks Available',
      icon: <Landmark className="w-6 h-6 text-gray-600" />,
    },
    {
      id: 'wallets',
      title: 'Gift Cards & e-wallets',
      description: 'MMT Gift cards & Amazon Pay',
      icon: <Wallet className="w-6 h-6 text-emerald-600" />,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-100 font-sans text-gray-900 selection:bg-blue-200">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.3fr] gap-5 items-start">
        
        {/* ================= LEFT MAIN SECTION ================= */}
        <div className="space-y-4">
          
          {/* 1. Expandable Flight Summary Header */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Brand Stack Logos */}
                <div className="flex -space-x-2 shrink-0">
                  <div className="w-7 h-7 bg-indigo-900 rounded-md flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                    ✈
                  </div>
                  <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center text-white text-[10px] font-bold shadow-sm border border-white">
                    ▲
                  </div>
                </div>
                
                {/* Route Context */}
                <div>
                  <h3 className="font-black text-sm text-gray-900 tracking-tight">
                    Ghaziabad (HDO) ⇄ Navi Mumbai (NMI)
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 font-medium mt-0.5">
                    <span>Tue, 30 Jun'26</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span>5:00 PM → 7:05 PM</span>
                    <span className="text-gray-400 font-normal">(2h 5m)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span className="text-blue-600">(via cities)</span>
                  </div>
                </div>
              </div>

              {/* Toggle Trigger */}
              <button 
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-800 tracking-wide uppercase"
              >
                View Details 
                {isDetailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Hidden Drawer Workspace */}
            {isDetailsOpen && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-600">
                <p className="font-medium">Detailed structural stopover and layout metrics go here...</p>
              </div>
            )}
          </div>

          {/* 2. Payment Selector Group Box */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-5">
            <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4">
              Payment Options
            </h2>
            
            <div className="border border-gray-200 rounded-xl divide-y divide-gray-200 overflow-hidden">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    {method.icon}
                    <div>
                      <h4 className="font-black text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                        {method.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR PRICE BREAKDOWN ================= */}
        <div className="space-y-4">
          
          {/* 1. Bill Breakdown Block */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 flex items-center justify-between bg-white border-b border-gray-100">
              <span className="font-black text-base text-gray-900 tracking-tight">Total Due</span>
              <span className="font-black text-xl text-teal-600 tracking-tight">₹ 652</span>
            </div>
            
            <div className="p-4 bg-white space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                <span>Fare Lock Amount</span>
                <span>₹ 652</span>
              </div>
            </div>

            {/* Deadline Notification Block */}
            <div className="bg-orange-50 px-4 py-2.5 border-t border-orange-100 flex items-start gap-2 text-[11px] text-amber-900 leading-tight">
              <span className="mt-0.5 text-base leading-none">🕒</span>
              <p className="font-medium">
                To confirm booking, pay <span className="font-black">14450.0</span> by <span className="font-black">Jun 29, 2026 09:50</span>
              </p>
            </div>
          </div>

          {/* 2. Scan to Pay QR Block */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-4 flex gap-4 items-center justify-between">
            <div className="flex-1 space-y-2">
              <h3 className="font-black text-sm text-gray-900 tracking-tight">Scan to Pay</h3>
              <p className="text-[11px] text-gray-400 font-medium leading-normal max-w-[150px]">
                Instant Refund & High Success Rate
              </p>
              
              {/* Payment brand mock asset strip */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 opacity-80">
                <span className="text-[9px] font-black italic bg-orange-50 px-1 border border-orange-100 rounded text-orange-600">UPI</span>
                <span className="text-[9px] font-black bg-blue-50 px-1 border border-blue-100 rounded text-blue-600">G Pay</span>
                <span className="text-[9px] font-black bg-sky-50 px-1 border border-sky-100 rounded text-sky-600">Paytm</span>
              </div>
            </div>

            {/* QR Mock Window Container */}
            <div className="relative w-28 h-28 border border-gray-300 rounded-lg p-1.5 flex items-center justify-center bg-gray-50 group">
              {/* Corner target decorators */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-black rounded-tl" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-black rounded-tr" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-black rounded-bl" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-black rounded-br" />
              
              {showQR ? (
                // Simulated QR Block Grid pattern
                <div className="w-full h-full bg-slate-900/5 flex flex-wrap p-1 gap-1 items-center justify-center" onClick={() => setShowQR(false)}>
                  <div className="w-5 h-5 border-2 border-gray-900 rounded-xs self-start justify-self-start" />
                  <div className="w-5 h-5 border-2 border-gray-900 rounded-xs self-start justify-self-end" />
                  <div className="w-5 h-5 border-2 border-gray-900 rounded-xs self-end justify-self-start" />
                  <div className="w-2 h-2 bg-gray-900 rounded-xs" />
                </div>
              ) : (
                // Mask Blur Cover with View Trigger Button
                <div className="absolute inset-1 bg-white/75 backdrop-blur-xs flex items-center justify-center rounded">
                  <button 
                    onClick={() => setShowQR(true)}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[9px] font-black tracking-wide uppercase px-2.5 py-1.5 rounded-md shadow-md transition-all flex items-center gap-1"
                  >
                    <Eye size={10} /> View QR
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}