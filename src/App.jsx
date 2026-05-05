import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';

const EMPRESA_INFO = {
  mision: "Brindar capacitación técnica de élite en módulos SAP MM y PM para potenciar la industria minera e industrial.",
  vision: "Ser la academia virtual referente en el mercado hispanohablante para consultores SAP."
};

const ADMIN_MASTER_EMAIL = 'Alex@sap.edu.pe';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [userEmail, setUserEmail] = useState(''); 
  const [activeTab, setActiveTab] = useState('inicio');
  
  const [usuarios, setUsuarios] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [clasesZoom, setClasesZoom] = useState([]);

  useEffect(() => {
    const cargarTodo = async () => {
      const { data: userDB } = await supabase.from('usuarios').select('*');
      const { data: certDB } = await supabase.from('certificados').select('*');
      const { data: matDB } = await supabase.from('materiales').select('*');
      const { data: zoomDB } = await supabase.from('clases_zoom').select('*');
      
      if (userDB) setUsuarios(userDB);
      if (certDB) setCertificados(certDB);
      if (matDB) setArchivos(matDB);
      if (zoomDB) setClasesZoom(zoomDB);
    };
    cargarTodo();
  }, []);

  const manejarAcceso = async (u, p) => {
    if (u === ADMIN_MASTER_EMAIL && p === 'Adolescente') {
      setIsAdmin(true);
      setIsLoggedIn(true);
      setUserEmail(u);
      return;
    }

    const { data } = await supabase.from('usuarios').select('*').eq('correo', u).eq('pass', p).single();
    if (data) {
      setIsLoggedIn(true);
      setIsAdmin(data.rol === 'Administrador'); 
      setUserEmail(u);
    } else {
      alert("Credenciales incorrectas");
    }
  };

  if (!isLoggedIn) return <Login onLogin={manejarAcceso} />;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <div className="flex flex-col h-full bg-white border-r w-72 shadow-xl relative z-20">
        <div className="p-8 border-b flex flex-col items-center bg-slate-50/50">
          <img src="/logo.png" alt="SAP World Logo" className="h-40 w-auto mb-4 object-contain drop-shadow-md" />
          <div className="text-center">
            <p className="text-[11px] font-black text-slate-800 uppercase tracking-[0.4em]">Academy</p>
            <div className="h-1 w-12 bg-blue-600 mx-auto mt-2 rounded-full"></div>
          </div>
        </div>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsLoggedIn(false)} />
      </div>
      
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-12 flex justify-between items-end border-b pb-6">
          <div>
            <h1 className="text-5xl font-black text-slate-800 tracking-tighter italic uppercase">SAP World Academy</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">SISTEMA DE GESTIÓN ACADÉMICA</p>
          </div>
          <div className="text-right text-xs font-bold italic">{userEmail}</div>
        </header>

        {activeTab === 'inicio' && (
          <div className="space-y-12">
            <div className="w-full h-72 rounded-[45px] overflow-hidden shadow-2xl border-4 border-white relative">
              <img src="/banner-inicio.jpg" alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent flex items-center p-12">
                <h2 className="text-white text-4xl font-black italic uppercase tracking-tighter drop-shadow-lg">
                  Formando expertos con SAP <br/> para el sector industrial
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative overflow-hidden rounded-[40px] bg-white shadow-sm border h-80 transition-all">
                <img src="/mision-img.jpg" alt="Misión" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="relative p-10 flex flex-col h-full justify-center">
                  <h3 className="text-blue-600 font-black italic text-2xl uppercase mb-4">Nuestra Misión</h3>
                  <p className="text-slate-700 font-bold leading-relaxed">{EMPRESA_INFO.mision}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-[40px] bg-slate-900 shadow-xl h-80">
                <img src="/vision-img.jpg" alt="Visión" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="relative p-10 flex flex-col h-full justify-center">
                  <h3 className="text-indigo-400 font-black italic text-2xl uppercase mb-4">Nuestra Visión</h3>
                  <p className="text-white font-bold leading-relaxed">{EMPRESA_INFO.vision}</p>
                </div>
              </div>
            </div>
            {isAdmin && <SeccionUsuarios setUsuarios={setUsuarios} usuarios={usuarios} />}
          </div>
        )}

        {activeTab === 'aula' && (
          <SeccionAula archivos={archivos} setArchivos={setArchivos} clases={clasesZoom} setClases={setClasesZoom} esAdmin={isAdmin} />
        )}

        {activeTab === 'certificados' && (
          <SeccionCertificados certificados={certificados} setCertificados={setCertificados} esAdmin={isAdmin} />
        )}

        {activeTab === 'verificacion' && (
          <SeccionVerificacion db={certificados} />
        )}
      </main>
    </div>
  );
}

function SeccionAula({ archivos, setArchivos, clases, setClases, esAdmin }) {
  // Orden de módulos solicitado: PM, PP, QM, MM
  const [moduloActivo, setModuloActivo] = useState('PM');
  const [tema, setTema] = useState('');
  const modulos = ['PM', 'PP', 'QM', 'MM'];

  const archivosFiltrados = archivos.filter(a => a.nombre.toUpperCase().includes(moduloActivo));
  const clasesFiltradas = clases.filter(c => c.tema.toUpperCase().includes(moduloActivo));

  const eliminarDato = async (identificador, tabla) => {
    if (window.confirm(`¿Eliminar permanentemente?`)) {
      try {
        const columna = tabla === 'materiales' ? 'nombre' : 'id';
        await supabase.from(tabla).delete().eq(columna, identificador);
        if (tabla === 'materiales') setArchivos(prev => prev.filter(a => a.nombre !== identificador));
        else setClases(prev => prev.filter(c => c.id !== identificador));
      } catch (err) { alert("Error al eliminar."); }
    }
  };

  const manejarSubida = async (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const path = `${moduloActivo}_${Date.now()}_${file.name}`;
      await supabase.storage.from('materiales-sap').upload(path, file);
      const { data: { publicUrl } } = supabase.storage.from('materiales-sap').getPublicUrl(path);
      
      const tabla = tipo === 'zoom' ? 'clases_zoom' : 'materiales';
      const row = tipo === 'zoom' ? { tema: `[${moduloActivo}] ${tema}`, link: publicUrl } : { nombre: path, link: publicUrl };
      const { data } = await supabase.from(tabla).insert([row]).select();
      
      if (tipo === 'zoom') setClases([...clases, data[0]]);
      else setArchivos([...archivos, data[0]]);
      setTema('');
    } catch (err) { alert("Error de subida."); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex gap-4 bg-white p-4 rounded-[30px] border shadow-sm overflow-x-auto">
        {modulos.map(m => (
          <button 
            key={m}
            onClick={() => setModuloActivo(m)}
            className={`px-10 py-4 rounded-2xl font-black text-xs transition-all ${moduloActivo === m ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            MÓDULO {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <div className="flex justify-between items-center mb-8">
            {/* Título personalizado para material académico */}
            <h2 className="text-xl font-black italic uppercase text-slate-800">Material Académico {moduloActivo}</h2>
            {esAdmin && <label className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold cursor-pointer"> SUBIR <input type="file" hidden onChange={e => manejarSubida(e, 'mat')} /></label>}
          </div>
          <div className="space-y-3">
            {archivosFiltrados.length > 0 ? archivosFiltrados.map(a => (
              <div key={a.nombre} className="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center">
                <span className="text-[11px] font-bold truncate w-40">📄 {a.nombre}</span>
                <div className="flex gap-3">
                  <a href={a.link} target="_blank" className="text-blue-600 font-black text-[9px] uppercase">Descargar</a>
                  {esAdmin && <button onClick={() => eliminarDato(a.nombre, 'materiales')} className="text-red-500 font-black text-[9px] uppercase">X</button>}
                </div>
              </div>
            )) : <p className="text-slate-300 text-center py-10 text-xs italic">Sin materiales en {moduloActivo}</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border-l-[10px] border-blue-600 shadow-sm">
          {/* Título personalizado para grabaciones de zoom */}
          <h2 className="text-xl font-black italic uppercase text-slate-800 mb-8">Grabación en Zoom {moduloActivo}</h2>
          {esAdmin && (
            <div className="flex gap-2 mb-6">
              <input className="bg-slate-50 border p-3 rounded-xl text-xs flex-1" placeholder="Título" value={tema} onChange={e => setTema(e.target.value)} />
              <label className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold cursor-pointer flex items-center"> VIDEO <input type="file" hidden onChange={e => manejarSubida(e, 'zoom')} /></label>
            </div>
          )}
          <div className="space-y-4">
            {clasesFiltradas.length > 0 ? clasesFiltradas.map(c => (
              <div key={c.id} className="p-5 bg-slate-900 text-white rounded-[25px] flex justify-between items-center">
                <span className="text-xs font-bold italic">🎥 {c.tema}</span>
                <div className="flex gap-3">
                  <a href={c.link} target="_blank" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase">Play</a>
                  {esAdmin && <button onClick={() => eliminarDato(c.id, 'clases_zoom')} className="text-red-400 font-black text-[9px]">X</button>}
                </div>
              </div>
            )) : <p className="text-slate-300 text-center py-10 text-xs italic">Sin grabaciones en {moduloActivo}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SeccionUsuarios({ setUsuarios, usuarios }) {
  const [form, setForm] = useState({ nombre: '', correo: '', pass: '', rol: 'Estudiante' });
  const guardar = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('usuarios').insert([form]);
    if (!error) { setUsuarios([...usuarios, form]); setForm({ nombre: '', correo: '', pass: '', rol: 'Estudiante' }); alert("Usuario registrado."); }
  };
  return (
    <div className="bg-white p-10 rounded-[40px] border shadow-sm">
      <h2 className="text-2xl font-black italic mb-6">GESTIÓN DE ACADEMIA</h2>
      <form onSubmit={guardar} className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input className="bg-slate-50 p-4 rounded-xl text-sm" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
        <input className="bg-slate-50 p-4 rounded-xl text-sm" placeholder="Email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required />
        <input className="bg-slate-50 p-4 rounded-xl text-sm" type="password" placeholder="Pass" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} required />
        <select className="bg-slate-50 p-4 rounded-xl text-sm font-bold" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
          <option value="Estudiante">Estudiante</option>
          <option value="Administrador">Admin</option>
        </select>
        <button className="bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase">Registrar</button>
      </form>
    </div>
  );
}

function SeccionCertificados({ certificados, setCertificados, esAdmin }) {
  const [form, setForm] = useState({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fecha_exp: '' });
  const guardar = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('certificados').insert([form]).select();
    if (!error) { setCertificados([...certificados, data[0]]); setForm({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fecha_exp: '' }); alert("Emitido."); }
  };
  return (
    <div className="bg-white p-10 rounded-[40px] border shadow-sm">
      <h2 className="text-2xl font-black mb-8 italic uppercase">Emisión de Títulos Oficiales</h2>
      {esAdmin ? (
        <form onSubmit={guardar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="bg-slate-50 p-4 rounded-xl text-sm font-bold" placeholder="Alumno" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
          <input className="bg-slate-50 p-4 rounded-xl text-sm font-bold" placeholder="Módulo SAP" value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} required />
          <input className="bg-slate-50 p-4 rounded-xl text-sm font-bold" placeholder="Horas" value={form.horas} onChange={e => setForm({...form, horas: e.target.value})} required />
          <input className="bg-slate-50 p-4 rounded-xl text-sm font-bold" placeholder="Nota" value={form.nota} onChange={e => setForm({...form, nota: e.target.value})} required />
          <input className="bg-slate-50 p-4 rounded-xl text-sm font-bold" placeholder="Código Único" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} required />
          <input className="bg-slate-50 p-4 rounded-xl text-sm font-bold" placeholder="Fecha" value={form.fecha_exp} onChange={e => setForm({...form, fecha_exp: e.target.value})} required />
          <button className="md:col-span-2 bg-slate-900 text-white p-4 rounded-xl font-black text-xs uppercase shadow-xl">Registrar Certificado</button>
        </form>
      ) : <p className="text-center text-slate-300 font-bold py-10 uppercase tracking-widest text-xs">Acceso solo para directores</p>}
    </div>
  );
}

function SeccionVerificacion({ db }) {
  const [code, setCode] = useState('');
  const [found, setFound] = useState(null);
  const handleSearch = () => {
    const result = db.find(c => c.codigo.trim().toLowerCase() === code.trim().toLowerCase());
    setFound(result || "error");
  };
  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white p-12 rounded-[50px] shadow-sm border text-center">
        <h2 className="text-2xl font-black mb-10 italic uppercase">Verificación de Credenciales</h2>
        <div className="flex gap-3 mb-10">
          <input className="flex-1 border-2 border-slate-100 p-5 rounded-2xl text-center font-bold" placeholder="CÓDIGO" value={code} onChange={e => setCode(e.target.value)} />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-8 rounded-2xl font-black text-xs uppercase">Validar</button>
        </div>
        {found && found !== "error" && (
          <div className="bg-slate-900 text-white p-10 rounded-[40px] text-left border-t-[10px] border-blue-500 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black mb-4">{found.nombre}</h3>
            <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-bold text-slate-400">
              <div className="bg-white/5 p-4 rounded-xl"><p>Módulo</p><p className="text-white text-sm">{found.curso}</p></div>
              <div className="bg-white/5 p-4 rounded-xl"><p>Código</p><p className="text-blue-400 text-sm">{found.codigo}</p></div>
              <div className="bg-white/5 p-4 rounded-xl"><p>Nota</p><p className="text-white text-sm">{found.nota}</p></div>
              <div className="bg-white/5 p-4 rounded-xl"><p>Horas</p><p className="text-white text-sm">{found.horas}</p></div>
            </div>
            <p className="mt-6 text-[9px] text-slate-500 font-bold">FECHA: {found.fecha_exp}</p>
          </div>
        )}
        {found === "error" && <p className="text-red-500 font-black text-xs uppercase tracking-widest">Código no válido</p>}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-14 rounded-[60px] w-full max-w-sm border-t-[10px] border-blue-600 flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="h-40 mb-10 object-contain" />
        <div className="space-y-4 w-full">
          <input className="w-full border p-4 rounded-2xl font-bold text-sm" placeholder="Email" value={u} onChange={e => setU(e.target.value)} />
          <input className="w-full border p-4 rounded-2xl font-bold text-sm" type="password" placeholder="Pass" value={p} onChange={e => setP(e.target.value)} />
          <button onClick={() => onLogin(u, p)} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase text-xs shadow-lg">Entrar</button>
        </div>
      </div>
    </div>
  );
}
