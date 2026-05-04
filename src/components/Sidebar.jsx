import React from 'react';
import { Home, BookOpen, Award, Search, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menus = [
    { id: 'inicio', label: 'Inicio', icon: <Home size={18}/> },
    { id: 'aula', label: 'Aula Virtual', icon: <BookOpen size={18}/> },
    { id: 'certificados', label: 'Gestión Certificados', icon: <Award size={18}/> },
    { id: 'verificacion', label: 'Verificación Pública', icon: <Search size={18}/> },
  ];

  return (
    <aside className="w-72 bg-[#0f172a] text-white flex flex-col border-r border-slate-800">
      <div className="p-10 font-black text-2xl text-blue-500 tracking-tighter text-center">SAP WORLD</div>
      <nav className="flex-1 px-4 space-y-1">
        {menus.map(m => (
          <button key={m.id} onClick={() => setActiveTab(m.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-medium transition-all ${activeTab === m.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}>
            {m.icon} {m.label}
          </button>
        ))}
      </nav>
      <div className="p-6">
        <button onClick={onLogout} className="w-full p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all">
          <LogOut size={18}/> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
