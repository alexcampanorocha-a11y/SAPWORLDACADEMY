import React from 'react';
import { Globe, LogOut, Home, BookOpen, Search } from 'lucide-react';

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="w-64 bg-[#0f172a] text-white flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-lg">SAP WORLD</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button onClick={() => setActiveTab('inicio')} className={`w-full flex p-3 rounded-lg ${activeTab === 'inicio' ? 'bg-blue-600' : ''}`}> <Home className="mr-2"/> Inicio</button>
        <button onClick={() => setActiveTab('aula')} className={`w-full flex p-3 rounded-lg ${activeTab === 'aula' ? 'bg-blue-600' : ''}`}> <BookOpen className="mr-2"/> Aula</button>
        <button onClick={() => setActiveTab('verificar')} className={`w-full flex p-3 rounded-lg ${activeTab === 'verificar' ? 'bg-blue-600' : ''}`}> <Search className="mr-2"/> Verificar</button>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button onClick={onLogout} className="text-red-400 flex items-center"> <LogOut className="mr-2"/> Salir </button>
      </div>
    </aside>
  );
}