import React, { useState } from 'react';
import { CREDENCIALES_ACCESO, EMPRESA_INFO, INITIAL_CERTIFICATES } from './data/mockData';
import Sidebar from './components/Sidebar';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  
  // Estados para "guardar" información en memoria
  const [usuarios, setUsuarios] = useState([]);
  const [certificados, setCertificados] = useState(INITIAL_CERTIFICATES);
  const [archivos, setArchivos] = useState([]);

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

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

        {activeTab === 'aula' && <SeccionAula archivos={archivos} setArchivos={setArchivos} />}
        {activeTab === 'certificados' && <SeccionCertificados certificados={certificados} setCertificados={setCertificados} />}
        {activeTab === 'verificacion' && <SeccionVerificacion db={certificados} />}
      </main>
    </div>
  );
}

// --- COMPONENTES DE CADA SECCIÓN ---

function SeccionUsuarios({ usuarios, setUsuarios }) {
  const [form, setForm] = useState({ nombre: '', correo: '', pass: '', rol: 'Estudiante' });

  const guardarUsuario = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.correo) return alert("Rellena los campos");
    setUsuarios([...usuarios, form]);
    setForm({ nombre: '', correo: '', pass: '', rol: 'Estudiante' });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-6">Gestión de Usuarios</h2>
      <form onSubmit={guardarUsuario} className="grid grid-cols-2 gap-4 mb-8">
        <input type="text" placeholder="Nombre completo" className="border p-3 rounded-lg" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
        <input type="email" placeholder="Correo electrónico" className="border p-3 rounded-lg" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} />
        <input type="password" placeholder="Contraseña" className="border p-3 rounded-lg" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} />
        <select className="border p-3 rounded-lg" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
          <option value="Estudiante">Estudiante</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button className="col-span-2 bg-blue-600 text-white p-3 rounded-lg font-bold">Registrar Usuario</button>
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

function SeccionAula({ archivos, setArchivos }) {
  const manejarArchivo = (e) => {
    const file = e.target.files[0];
    if (file) setArchivos([...archivos, { nombre: file.name, tipo: file.type, fecha: new Date().toLocaleDateString() }]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Contenido Académico</h2>
        <input type="file" onChange={manejarArchivo} className="mb-4 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700" />
        <ul className="space-y-2">
          {archivos.map((f, i) => <li key={i} className="text-sm p-2 bg-slate-50 rounded border">📄 {f.nombre} <span className="text-xs text-slate-400">({f.fecha})</span></li>)}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Clases Grabadas (Zoom)</h2>
        <p className="text-slate-400">Próximamente: Integración directa con grabaciones de la nube.</p>
      </div>
    </div>
  );
}

function SeccionCertificados({ certificados, setCertificados }) {
  const [form, setForm] = useState({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fechaExp: '' });

  const guardar = (e) => {
    e.preventDefault();
    setCertificados([...certificados, form]);
    setForm({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fechaExp: '' });
    alert("Certificado registrado en el sistema.");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm max-w-3xl">
      <h2 className="text-xl font-bold mb-6">Generador de Certificados</h2>
      <form onSubmit={guardar} className="grid grid-cols-2 gap-4">
        <input className="border p-3 rounded-lg" placeholder="Nombre del Alumno" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
        <input className="border p-3 rounded-lg" placeholder="Curso SAP" value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} />
        <input className="border p-3 rounded-lg" placeholder="Horas" value={form.horas} onChange={e => setForm({...form, horas: e.target.value})} />
        <input className="border p-3 rounded-lg" placeholder="Nota" value={form.nota} onChange={e => setForm({...form, nota: e.target.value})} />
        <input className="border p-3 rounded-lg" placeholder="Código (ej: SAP-001)" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} />
        <input className="border p-3 rounded-lg" type="date" value={form.fechaExp} onChange={e => setForm({...form, fechaExp: e.target.value})} />
        <button className="col-span-2 bg-indigo-600 text-white p-3 rounded-lg font-bold mt-4">Guardar en Base de Datos</button>
      </form>
    </div>
  );
}

function SeccionVerificacion({ db }) {
  const [busqueda, setBusqueda] = useState('');
  const [resultado, setResultado] = useState(null);

  const buscar = () => {
    const encontrado = db.find(c => c.codigo.trim().toUpperCase() === busqueda.trim().toUpperCase());
    setResultado(encontrado || 'no_existe');
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6">Verificación de Certificados</h2>
      <div className="flex gap-2 mb-10">
        <input className="flex-1 border-2 border-blue-100 p-4 rounded-xl text-lg" placeholder="Introduce el código del certificado..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <button onClick={buscar} className="bg-blue-600 text-white px-8 rounded-xl font-bold">Verificar</button>
      </div>

      {resultado === 'no_existe' && <p className="text-red-500 font-bold">Código no encontrado en nuestros registros.</p>}
      
      {resultado && resultado !== 'no_existe' && (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border-t-[10px] border-emerald-500 text-left">
          <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-black uppercase">Certificado Oficial Válido</span>
          <h3 className="text-4xl font-black mt-4 mb-2 text-slate-800">{resultado.nombre}</h3>
          <p className="text-slate-500 text-xl mb-6">Ha completado satisfactoriamente el curso de:</p>
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl">
            <div><p className="text-[10px] text-slate-400 font-bold uppercase">Curso</p><p className="font-bold">{resultado.curso}</p></div>
            <div><p className="text-[10px] text-slate-400 font-bold uppercase">Horas</p><p className="font-bold">{resultado.horas} hrs</p></div>
            <div><p className="text-[10px] text-slate-400 font-bold uppercase">Nota Final</p><p className="font-bold">{resultado.nota}</p></div>
            <div><p className="text-[10px] text-slate-400 font-bold uppercase">Expiración</p><p className="font-bold">{resultado.fechaExp}</p></div>
          </div>
          <p className="mt-6 text-[10px] text-slate-300 text-center uppercase tracking-widest">Código de Autenticidad: {resultado.codigo}</p>
        </div>
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [data, setData] = useState({ u: '', p: '' });
  const entrar = (e) => {
    e.preventDefault();
    if (data.u === CREDENCIALES_ACCESO.usuario && data.p === CREDENCIALES_ACCESO.password) onLogin();
    else alert("Error de acceso");
  };
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <form onSubmit={entrar} className="w-full max-w-sm bg-slate-800 p-10 rounded-3xl border border-slate-700">
        <h2 className="text-2xl font-black mb-8 text-blue-400 text-center uppercase tracking-tighter">SAP World Academy</h2>
        <input type="text" placeholder="Email" className="w-full bg-slate-700 border-none p-4 rounded-xl mb-4" onChange={e => setData({...data, u: e.target.value})} />
        <input type="password" placeholder="Contraseña" className="w-full bg-slate-700 border-none p-4 rounded-xl mb-8" onChange={e => setData({...data, p: e.target.value})} />
        <button className="w-full bg-blue-600 p-4 rounded-xl font-bold shadow-lg shadow-blue-900/40">Entrar al Sistema</button>
      </form>
    </div>
  );
}
