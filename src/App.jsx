import React, { useState } from 'react';
import { CREDENCIALES_ACCESO, EMPRESA_INFO, INITIAL_CERTIFICATES } from './data/mockData';
import Sidebar from './components/Sidebar';
import Verificacion from './pages/Verificacion';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ user: '', pass: '' });
  const [activeTab, setActiveTab] = useState('inicio');
  const [usuarios, setUsuarios] = useState([{ nombre: 'Alex', rol: 'Administrador' }]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.user === CREDENCIALES_ACCESO.usuario && loginData.pass === CREDENCIALES_ACCESO.password) {
      setIsLoggedIn(true);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <form onSubmit={handleLogin} className="bg-slate-800 p-10 rounded-2xl shadow-2xl w-96">
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">SAP WORLD ACADEMY</h1>
          <input type="email" placeholder="Usuario" className="w-full p-3 mb-4 rounded bg-slate-700 border-none" 
            onChange={(e) => setLoginData({...loginData, user: e.target.value})} />
          <input type="password" placeholder="Contraseña" className="w-full p-3 mb-6 rounded bg-slate-700 border-none" 
            onChange={(e) => setLoginData({...loginData, pass: e.target.value})} />
          <button className="w-full bg-blue-600 p-3 rounded-lg font-bold hover:bg-blue-500">Acceder</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsLoggedIn(false)} />
      <main className="flex-1 overflow-y-auto p-10">
        <h1 className="text-3xl font-black mb-8 text-slate-800">SAP WORLD ACADEMY</h1>
        
        {activeTab === 'inicio' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold text-blue-600 uppercase">Misión</h2>
                <p className="text-slate-600">{EMPRESA_INFO.mision}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold text-blue-600 uppercase">Visión</h2>
                <p className="text-slate-600">{EMPRESA_INFO.vision}</p>
              </div>
            </div>
            <SeccionUsuarios usuarios={usuarios} setUsuarios={setUsuarios} />
          </div>
        )}

        {activeTab === 'aula' && <SeccionAula />}
        {activeTab === 'certificados' && <SeccionCertificados />}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTES AUXILIARES ---

function SeccionUsuarios({ usuarios, setUsuarios }) {
  const [nuevo, setNuevo] = useState({ nombre: '', rol: 'Estudiante' });
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
      <div className="flex gap-2 mb-6">
        <input type="text" placeholder="Nombre" className="border p-2 rounded" value={nuevo.nombre} onChange={e => setNuevo({...nuevo, nombre: e.target.value})} />
        <select className="border p-2 rounded" onChange={e => setNuevo({...nuevo, rol: e.target.value})}>
          <option value="Estudiante">Estudiante</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button onClick={() => setUsuarios([...usuarios, nuevo])} className="bg-green-600 text-white px-4 rounded">Crear</button>
      </div>
      <ul className="divide-y text-slate-600">
        {usuarios.map((u, i) => <li key={i} className="py-2">{u.nombre} - <span className="font-bold">{u.rol}</span></li>)}
      </ul>
    </div>
  );
}

function SeccionAula() {
  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Contenido Académico (PPT, PDF, WORD)</h2>
        <input type="file" className="mb-4" />
        <p className="text-sm text-slate-400">Subir material de estudio para los módulos SAP.</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Zoom (Clases Grabadas)</h2>
        <input type="text" placeholder="Enlace de la grabación" className="w-full border p-2 mb-2 rounded" />
        <button className="bg-orange-500 text-white px-4 py-2 rounded">Añadir Clase</button>
      </div>
    </div>
  );
}

function SeccionCertificados() {
  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Creación de Certificados</h2>
      <div className="grid grid-cols-2 gap-4">
        <input className="border p-3 rounded" placeholder="Nombre completo" />
        <input className="border p-3 rounded" placeholder="Curso (ej: SAP MM)" />
        <input className="border p-3 rounded" placeholder="Horas académicas" />
        <input className="border p-3 rounded" placeholder="Nota" />
        <input className="border p-3 rounded" placeholder="Código Único" />
        <input className="border p-3 rounded" type="date" label="Fecha de Expiración" />
      </div>
      <button className="mt-6 w-full bg-blue-700 text-white p-3 rounded-lg font-bold">Generar Registro de Certificado</button>
    </div>
  );
}
