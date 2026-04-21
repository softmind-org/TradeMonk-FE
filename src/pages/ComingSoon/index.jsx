import React from 'react';
import { Mail, ArrowRight, ShieldCheck, Sparkles, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#D4A017] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#111C2E] rounded-full mix-blend-screen filter blur-[150px] opacity-50"></div>
      
      {/* Content Container */}
      <div className="z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">
        {/* Logo/Brand Area */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-[#111C2E] border border-white/10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,160,23,0.1)]">
            <ShieldCheck size={28} className="text-[#D4A017]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">TradeMonk</h1>
        </div>

        {/* Main Headline */}
        <div className="inline-flex mb-6 px-4 py-1.5 rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 text-[#D4A017] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(212,160,23,0.15)] items-center gap-2">
           <Sparkles size={14} /> Coming Soon
        </div>
        
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-yellow-200">Marketplace</span>
        </h2>
        
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed">
          The premier destination to buy, sell, and discover trading cards and curated collectibles.
        </p>

        {/* Notify Form */}
        <div className="w-full max-w-md bg-[#111C2E]/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative mt-2 mb-8">
          <div className="pl-4">
            <Mail size={20} className="text-[#D4A017]" />
          </div>
          <input 
            type="email" 
            placeholder="Enter email for early access..." 
            className="w-full bg-transparent border-none text-white px-4 py-3 text-sm focus:outline-none focus:ring-0 placeholder:text-white/30"
          />
          <button className="bg-[#D4A017] hover:bg-[#b58812] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all flex items-center gap-2 shrink-0">
            Notify Me <ArrowRight size={16} />
          </button>
        </div>

        {/* Home Link */}
        <Link 
          to="/" 
          className="group flex items-center gap-2 text-white/40 hover:text-[#D4A017] transition-all duration-300 font-bold text-xs uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-[#D4A017]/30"
        >
          <Home size={14} className="group-hover:scale-110 transition-transform" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
