import React, { useState } from 'react';
import { CREDENCIALES_ACCESO, EMPRESA_INFO, INITIAL_CERTIFICATES } from './data/mockData';
import Sidebar from './components/Sidebar';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  
  // ESTADOS UNIFICADOS
  const [usuarios, setUsuarios] = useState([]); // Aquí se guardan los nuevos
  const [certificados, setCertificados] = useState(INITIAL_CERTIFICATES);
  const [archivos, setArchivos] = useState([]);
  const [clasesZoom, setClasesZoom] = useState([]);

  // SISTEMA DE LOGIN MEJORADO
  const manejarAcceso = (usuarioInput, passInput) => {
    // 1. Verifica usuario maestro
    const esMaestro = usuarioInput === CREDENCIALES_ACCESO.usuario && passInput === CREDENCIALES_ACCESO.password;
    // 2. Verifica en usuarios creados
    const esCreado = usuarios.find(u => u.correo === usuarioInput && u.pass === passInput);

    if (esMaestro || esCreado) {
      setIsLoggedIn(true);
    } else {
      alert("Usuario o contraseña no válidos.");
    }
  };

  if (!isLoggedIn) return <Login onLogin={manejarAcceso} />;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsLoggedIn(false)} />
      <main className="flex-1 overflow-y-auto p-10">
        <h1 className="text-3xl font-black mb-8 text-slate-800">SAP WORLD ACADEMY</h1>
        
        {activeTab === 'inicio' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="font-bold text-blue-600 uppercase mb-2">Misión</h2>
                <p className="text-slate-600 italic">"{EMPRESA_INFO.mision}"</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="font-bold text-blue-600 uppercase mb-2">Visión</h2>
                <p className="text-slate-600 italic">"{EMPRESA_INFO.vision}"</p>
              </div>
            </div>
            <SeccionUsuarios usuarios={usuarios} setUsuarios={setUsuarios} />
          </div>
        )}

        {activeTab === 'aula' && (
          <SeccionAula 
            archivos={archivos} setArchivos={setArchivos} 
            clases={clasesZoom} setClases={setClasesZoom} 
          />
        )}
        
        {activeTab === 'certificados' && <SeccionCertificados certificados={certificados} setCertificados={setCertificados} />}
        {activeTab === 'verificacion' && <SeccionVerificacion db={certificados} />}
      </main>
    </div>
  );
}

// --- SECCIÓN USUARIOS (CORREGIDA) ---
function SeccionUsuarios({ usuarios, setUsuarios }) {
  const [form, setForm] = useState({ nombre: '', correo: '', pass: '', rol: 'Estudiante' });

  const guardarUsuario = (e) => {
    e.preventDefault();
    if (!form.correo || !form.pass) return alert("El correo y contraseña son obligatorios para el acceso.");
    setUsuarios([...usuarios, form]);
    setForm({ nombre: '', correo: '', pass: '', rol: 'Estudiante' });
    alert("Usuario creado. ¡Ahora puedes cerrar sesión y entrar con esta cuenta!");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-6">Gestión de Usuarios</h2>
      <form onSubmit={guardarUsuario} className="grid grid-cols-2 gap-4 mb-8">
        <input type="text" placeholder="Nombre completo" className="border p-3 rounded-lg" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
        <input type="email" placeholder="Correo electrónico (Para Login)" className="border p-3 rounded-lg" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} />
        <input type="password" placeholder="Contraseña" className="border p-3 rounded-lg" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} />
        <select className="border p-3 rounded-lg" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
          <option value="Estudiante">Estudiante</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button className="col-span-2 bg-blue-600 text-white p-3 rounded-lg font-bold">Crear Cuenta de Acceso</button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="text-slate-400 border-b"><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
          <tbody>
            {usuarios.map((u, i) => <tr key={i} className="border-b"><td className="py-2">{u.nombre}</td><td>{u.correo}</td><td>{u.rol}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- SECCIÓN AULA (CORREGIDA CON ELIMINAR Y ZOOM) ---
function SeccionAula({ archivos, setArchivos, clases, setClases }) {
  const [linkZoom, setLinkZoom] = useState('');

  const subirArchivo = (e) => {
    const file = e.target.files[0];
    if (file) setArchivos([...archivos, { id: Date.now(), nombre: file.name }]);
  };

  const eliminarArchivo = (id) => setArchivos(archivos.filter(a => a.id !== id));
  const eliminarClase = (id) => setClases(clases.filter(c => c.id !== id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4 text-blue-700 font-black">CONTENIDO ACADÉMICO</h2>
        <input type="file" onChange={subirArchivo} className="mb-4 block w-full text-sm" />
        <div className="space-y-2">
          {archivos.map((f) => (
            <div key={f.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
              <span className="text-sm font-medium">📄 {f.nombre}</span>
              <div className="flex gap-2">
                <button onClick={() => alert("Abriendo: " + f.nombre)} className="text-blue-600 text-xs font-bold uppercase">Abrir</button>
                <button onClick={() => eliminarArchivo(f.id)} className="text-red-500 text-xs font-bold uppercase">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4 text-orange-600 font-black">CLASES GRABADAS ZOOM</h2>
        <div className="flex gap-2 mb-4">
          <input type="text" placeholder="Pegar link de Zoom o Drive" className="flex-1 border p-2 rounded-lg text-sm" value={linkZoom} onChange={e => setLinkZoom(e.target.value)} />
          <button onClick={() => { setClases([...clases, {id: Date.now(), url: linkZoom}]); setLinkZoom(''); }} className="bg-orange-500 text-white px-4 rounded-lg text-xs font-bold">AÑADIR</button>
        </div>
        <div className="space-y-2">
          {clases.map((c) => (
            <div key={c.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
              <span className="text-xs text-orange-800 truncate mr-4">{c.url}</span>
              <button onClick={() => eliminarClase(c.id)} className="text-red-500 text-xs font-bold">QUITAR</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ... (Las secciones de Certificados y Verificación se mantienen igual que el código anterior)

function Login({ onLogin }) {
  const [data, setData] = useState({ u: '', p: '' });
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <form onSubmit={(e) => { e.preventDefault(); onLogin(data.u, data.p); }} className="w-full max-w-sm bg-slate-800 p-10 rounded-3xl border border-slate-700">
        <h2 className="text-2xl font-black mb-8 text-blue-400 text-center uppercase tracking-tighter">SAP World Academy</h2>
        <input type="text" placeholder="Email" className="w-full bg-slate-700 border-none p-4 rounded-xl mb-4" onChange={e => setData({...data, u: e.target.value})} />
        <input type="password" placeholder="Contraseña" className="w-full bg-slate-700 border-none p-4 rounded-xl mb-8" onChange={e => setData({...data, p: e.target.value})} />
        <button className="w-full bg-blue-600 p-4 rounded-xl font-bold">Entrar al Sistema</button>
      </form>
    </div>
  );
}
