import React from 'react';
import { Home, BookOpen, Award, LogOut, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menus = [
    { id: 'inicio', label: 'Inicio', icon: <Home size={20}/> },
    { id: 'aula', label: 'Aula Virtual', icon: <BookOpen size={20}/> },
    { id: 'certificados', label: 'Certificados', icon: <Award size={20}/> },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] text-white flex flex-col">
      <div className="p-6 text-center border-b border-slate-700 font-black text-blue-400">SAP WORLD</div>
      <nav className="flex-1 p-4 space-y-2">
        {menus.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === item.id ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="m-4 flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-xl">
        <LogOut size={20}/> Cerrar Sesión
      </button>
    </aside>
  );
}
