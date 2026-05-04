import React, { useState } from 'react';
import { INITIAL_USERS, INITIAL_CERTIFICATES } from './data/mockData';
import Sidebar from './components/Sidebar';
import Verificacion from './pages/Verificacion';

export default function App() {
  const [user, setUser] = useState({ name: 'Admin SAP', role: 'admin' }); // Estado inicial
  const [activeTab, setActiveTab] = useState('inicio');
  const [mockDB] = useState(INITIAL_CERTIFICATES);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => console.log('Saliendo...')} />
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'inicio' && <div className="p-10"><h1>Bienvenido a SAP World</h1></div>}
        {activeTab === 'verificar' && <Verificacion mockDB={mockDB} />}
        {activeTab === 'aula' && <div className="p-10"><h1>Aula Virtual Activa</h1></div>}
      </main>
    </div>
  );
}