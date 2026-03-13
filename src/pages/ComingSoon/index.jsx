import React from 'react';
import { Mail, ArrowRight, ShieldCheck, Sparkles, Watch } from 'lucide-react';

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
           <Sparkles size={14} /> Something extraordinary is coming
        </div>
        
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] to-yellow-200">Trading</span>
        </h2>
        
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed">
          We're building an exclusive, high-performance marketplace for premium digital and physical assets. Secure, fast, and driven by excellence.
        </p>

        {/* Notify Form */}
        <div className="w-full max-w-md bg-[#111C2E]/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative mt-2">
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

        {/* Optional Features/Values under the form */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl border-t border-white/5 pt-12">
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-[#111C2E] border border-white/5 flex items-center justify-center mb-4 text-[#D4A017] group-hover:bg-[#111C2E]/80 group-hover:scale-110 transition-all duration-300">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Secure Vault</h3>
            <p className="text-[11px] text-white/40 leading-relaxed max-w-[200px]">Bank-grade security and automated verification</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-[#111C2E] border border-white/5 flex items-center justify-center mb-4 text-[#D4A017] group-hover:bg-[#111C2E]/80 group-hover:scale-110 transition-all duration-300">
              <Sparkles size={24} />
            </div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Premium Market</h3>
            <p className="text-[11px] text-white/40 leading-relaxed max-w-[200px]">Curated inventory and high-value merchants</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-[#111C2E] border border-white/5 flex items-center justify-center mb-4 text-[#D4A017] group-hover:bg-[#111C2E]/80 group-hover:scale-110 transition-all duration-300">
              <Watch size={24} />
            </div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Real-Time Data</h3>
            <p className="text-[11px] text-white/40 leading-relaxed max-w-[200px]">Sub-second execution and live pricing metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
