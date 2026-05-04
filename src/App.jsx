import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Conexión a la base de datos real
import { EMPRESA_INFO } from './data/mockData';
import Sidebar from './components/Sidebar';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  
  // Estados que se sincronizarán con la base de datos
  const [usuarios, setUsuarios] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [clasesZoom, setClasesZoom] = useState([]);

  // 1. CARGAR DATOS AL INICIAR
  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const { data: userList } = await supabase.from('usuarios').select('*');
    const { data: certList } = await supabase.from('certificados').select('*');
    if (userList) setUsuarios(userList);
    if (certList) setCertificados(certList);
  }

  // 2. SISTEMA DE LOGIN CON BASE DE DATOS
  const manejarAcceso = async (usuarioInput, passInput) => {
    // Primero verifica el acceso maestro (Alex)
    if (usuarioInput === 'Alex@sap.edu.pe' && passInput === 'Adolescente') {
      setIsLoggedIn(true);
      return;
    }

    // Si no, busca en la tabla de usuarios en Supabase
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', usuarioInput)
      .eq('pass', passInput)
      .single();

    if (data) {
      setIsLoggedIn(true);
    } else {
      alert("Credenciales incorrectas o usuario no existe en la base de datos.");
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

// --- SECCIÓN USUARIOS (CONEXIÓN REAL) ---
function SeccionUsuarios({ usuarios, setUsuarios }) {
  const [form, setForm] = useState({ nombre: '', correo: '', pass: '', rol: 'Estudiante' });

  const guardarUsuario = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('usuarios').insert([form]);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      setUsuarios([...usuarios, form]);
      setForm({ nombre: '', correo: '', pass: '', rol: 'Estudiante' });
      alert("¡Usuario guardado permanentemente en la nube!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-6">Gestión de Usuarios Real-Time</h2>
      <form onSubmit={guardarUsuario} className="grid grid-cols-2 gap-4 mb-8">
        <input type="text" placeholder="Nombre" className="border p-3 rounded-lg" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
        <input type="email" placeholder="Correo (Login)" className="border p-3 rounded-lg" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} />
        <input type="password" placeholder="Contraseña" className="border p-3 rounded-lg" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} />
        <select className="border p-3 rounded-lg" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
          <option value="Estudiante">Estudiante</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button className="col-span-2 bg-blue-600 text-white p-3 rounded-lg font-bold">Registrar en Base de Datos</button>
      </form>
      <table className="w-full text-left">
        <thead><tr className="text-slate-400 border-b"><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
        <tbody>
          {usuarios.map((u, i) => <tr key={i} className="border-b"><td className="py-2">{u.nombre}</td><td>{u.correo}</td><td>{u.rol}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

// --- SECCIÓN CERTIFICADOS (CONEXIÓN REAL) ---
function SeccionCertificados({ certificados, setCertificados }) {
  const [form, setForm] = useState({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fecha_exp: '' });

  const guardarCert = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('certificados').insert([form]);
    if (error) alert(error.message);
    else {
      setCertificados([...certificados, form]);
      setForm({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fecha_exp: '' });
      alert("Certificado emitido y guardado.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border max-w-3xl">
      <h2 className="text-xl font-bold mb-6 italic text-indigo-600">Emisor de Certificados SAP</h2>
      <form onSubmit={guardarCert} className="grid grid-cols-2 gap-4">
        <input className="border p-3 rounded-lg" placeholder="Alumno" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
        <input className="border p-3 rounded-lg" placeholder="Curso" value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} />
        <input className="border p-3 rounded-lg" placeholder="Horas" value={form.horas} onChange={e => setForm({...form, horas: e.target.value})} />
        <input className="border p-3 rounded-lg" placeholder="Nota" value={form.nota} onChange={e => setForm({...form, nota: e.target.value})} />
        <input className="border p-3 rounded-lg" placeholder="Código Único" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} />
        <input className="border p-3 rounded-lg" type="date" value={form.fecha_exp} onChange={e => setForm({...form, fecha_exp: e.target.value})} />
        <button className="col-span-2 bg-indigo-600 text-white p-3 rounded-lg font-bold">Emitir Registro Permanente</button>
      </form>
    </div>
  );
}

// ... Las funciones de SeccionAula, SeccionVerificacion y Login se mantienen iguales al código anterior para conservar la interfaz ...
