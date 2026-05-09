import React, { useState } from 'react';

interface AuthProps {
  onLogin: (name: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Nama minimal 2 karakter');
      return;
    }
    onLogin(trimmed);
  };

  return (
    <div className="fixed inset-0 bg-pink-50 z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] w-full max-w-md p-6 sm:p-8 shadow-2xl border border-white/60">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-500 rounded-3xl flex items-center justify-center text-white shadow-lg mx-auto mb-4 animate-float">
            <i className="fas fa-baby-carriage text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-pink-900 leading-none mb-2">BundaCare</h1>
          <p className="text-xs uppercase tracking-widest text-pink-500 font-bold">Momen Berharga</p>
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Masuk / Daftar</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Nama Pengguna</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="w-full bg-slate-50 p-4 rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-400 outline-none text-slate-700 transition" 
              placeholder="Minimal 2 karakter" 
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <button 
            type="submit" 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition flex justify-center items-center gap-2 mt-4"
          >
            <i className="fas fa-sign-in-alt"></i> Lanjut
          </button>
        </form>
      </div>
    </div>
  );
};
