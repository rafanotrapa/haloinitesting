import React, { useState } from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0].id);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUserId);
    if (user) onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2745] via-[#081B33] to-[#000000] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Shapes - Fixed to not interfere with scroll */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[80%] md:w-[60%] h-[60%] bg-[#D9232D] rounded-full blur-[100px] md:blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[70%] md:w-[50%] h-[50%] bg-[#00529C] rounded-full blur-[100px] md:blur-[150px] opacity-20"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 w-full max-w-md rounded-3xl shadow-2xl z-10 animate-fade-in ring-1 ring-white/10 m-4 flex flex-col max-h-[90vh]">
        <div className="p-8 md:p-10 text-center shrink-0">
          <div className="bg-gradient-to-tr from-[#D9232D] to-[#FF4D58] w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-900/50 transform -rotate-3 hover:rotate-0 transition-all duration-500">
             <Building2 size={32} md:size={40} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">HK ProjectOne</h1>
          <p className="text-slate-300 text-xs md:text-sm font-medium">Hutama Karya Enterprise System</p>
        </div>

        <div className="px-6 pb-8 md:px-8 md:pb-10 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 ml-1">Select Identity</label>
              <div className="space-y-3">
                {users.map((user) => (
                  <label 
                    key={user.id} 
                    className={`flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-300 group ${
                      selectedUserId === user.id 
                        ? 'bg-white text-slate-900 shadow-lg scale-[1.02] ring-2 ring-[#D9232D]/20' 
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="user" 
                      value={user.id} 
                      checked={selectedUserId === user.id}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-0.5 rounded-full mr-3 border-2 shrink-0 ${selectedUserId === user.id ? 'border-[#D9232D]' : 'border-transparent'}`}>
                      <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{user.name}</div>
                      <div className={`text-xs font-medium truncate ${selectedUserId === user.id ? 'text-[#D9232D]' : 'text-slate-500'}`}>{user.role}</div>
                    </div>
                    
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedUserId === user.id ? 'border-[#D9232D] bg-[#D9232D]' : 'border-slate-500'}`}>
                      {selectedUserId === user.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#D9232D] to-[#B01225] text-white py-4 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-red-900/30 transition-all btn-press flex items-center justify-center group mt-4"
            >
              <span>Access Workspace</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 font-medium">Inovasi Untuk Solusi</p>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-slate-500 text-xs tracking-wide text-center">© 2024 PT Hutama Karya (Persero)</p>
    </div>
  );
};

export default Login;