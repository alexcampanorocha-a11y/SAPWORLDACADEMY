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
    // Credenciales maestras según corrección de seguridad
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
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* BANNER PRINCIPAL */}
            <div className="w-full h-72 rounded-[45px] overflow-hidden shadow-2xl border-4 border-white relative">
              <img src="/banner-inicio.jpg" alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent flex items-center p-12">
                <h2 className="text-white text-4xl font-black italic uppercase tracking-tighter drop-shadow-lg">
                  Formando expertos con SAP <br/> para el área industrial
                </h2>
              </div>
            </div>

            {/* SECCIÓN MISIÓN Y VISIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative overflow-hidden rounded-[40px] bg-white shadow-sm border h-80 transition-all hover:shadow-xl">
                <img src="/mision-img.jpg" alt="Misión" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative p-10 flex flex-col h-full justify-center">
                  <h3 className="text-blue-600 font-black italic text-2xl uppercase mb-4 tracking-tighter">Nuestra Misión</h3>
                  <p className="text-slate-700 font-bold leading-relaxed">{EMPRESA_INFO.mision}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[40px] bg-slate-900 shadow-sm h-80 transition-all hover:shadow-indigo-500/20 shadow-xl">
                <img src="/vision-img.jpg" alt="Visión" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-10 flex flex-col h-full justify-center">
                  <h3 className="text-indigo-400 font-black italic text-2xl uppercase mb-4 tracking-tighter">Nuestra Visión</h3>
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

// --- COMPONENTE AULA (Eliminación por Nombre) ---
function SeccionAula({ archivos, setArchivos, clases, setClases, esAdmin }) {
  const [tema, setTema] = useState('');

  const eliminarDato = async (identificador, tabla) => {
    if (window.confirm(`¿Deseas eliminar este registro permanentemente?`)) {
      try {
        const columnaBusqueda = tabla === 'materiales' ? 'nombre' : 'id';
        const { error } = await supabase.from(tabla).delete().eq(columnaBusqueda, identificador);

        if (error) throw error;

        if (tabla === 'materiales') {
          setArchivos(prev => prev.filter(a => a.nombre !== identificador));
        } else {
          setClases(prev => prev.filter(c => c.id !== identificador));
        }
        alert("Eliminado con éxito.");
      } catch (err) { alert(`Error al eliminar: ${err.message}`); }
    }
  };

  const manejarSubida = async (e, tipo) => {
    if (!esAdmin) return;
    const file = e.target.files[0];
    if (!file || (tipo === 'zoom' && !tema)) return;
    try {
      const path = `${tipo}_${Date.now()}_${file.name}`;
      await supabase.storage.from('materiales-sap').upload(path, file);
      const { data: { publicUrl } } = supabase.storage.from('materiales-sap').getPublicUrl(path);
      const tabla = tipo === 'zoom' ? 'clases_zoom' : 'materiales';
      const row = tipo === 'zoom' ? { tema: tema, link: publicUrl } : { nombre: path, link: publicUrl };
      const { data: insertedData } = await supabase.from(tabla).insert([row]).select();
      
      if (tipo === 'zoom') setClases([...clases, insertedData[0]]);
      else setArchivos([...archivos, insertedData[0]]);
      
      setTema(''); alert("Cargado correctamente.");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white p-10 rounded-[40px] border shadow-sm">
        <h2 className="text-2xl font-black mb-6 italic text-slate-800">Repositorio PDF</h2>
        {esAdmin && <input type="file" onChange={(e) => manejarSubida(e, 'mat')} className="mb-6 block text-xs" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archivos.map((a) => (
            <div key={a.nombre} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-3xl border">
              <span className="font-bold text-xs truncate mr-4">📄 {a.nombre}</span>
              <div className="flex gap-4 items-center">
                <a href={a.link} target="_blank" rel="noreferrer" className="text-blue-600 font-black text-[10px] uppercase">Descargar</a>
                {esAdmin && (
                  <button onClick={() => eliminarDato(a.nombre, 'materiales')} className="text-red-500 font-black text-[10px] uppercase hover:underline">Eliminar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[40px] border-l-[12px] border-l-indigo-600 shadow-sm">
        <h2 className="text-2xl font-black mb-6 italic text-slate-800">Grabaciones en Vivo</h2>
        {esAdmin && (
          <div className="flex gap-4 mb-8 bg-indigo-50/50 p-6 rounded-[30px]">
            <input className="border-2 border-white p-4 rounded-2xl flex-1 text-sm outline-none" placeholder="Título de la clase" value={tema} onChange={e => setTema(e.target.value)} />
            <input type="file" onChange={(e) => manejarSubida(e, 'zoom')} className="text-xs" />
          </div>
        )}
        <div className="grid gap-4">
          {clases.map((c) => (
            <div key={c.id} className="flex justify-between p-6 bg-white border rounded-[30px] items-center">
              <span className="font-black text-sm text-slate-700 italic">🎥 {c.tema}</span>
              <div className="flex gap-4 items-center">
                <a href={c.link} target="_blank" rel="noreferrer" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase">Ver Clase</a>
                {esAdmin && (
                  <button onClick={() => eliminarDato(c.id, 'clases_zoom')} className="text-red-500 font-black text-[10px] uppercase hover:underline">Eliminar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE USUARIOS ---
function SeccionUsuarios({ setUsuarios, usuarios }) {
  const [form, setForm] = useState({ nombre: '', correo: '', pass: '', rol: 'Estudiante' });
  const guardar = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('usuarios').insert([form]);
    if (!error) { setUsuarios(prev => [...prev, form]); setForm({ nombre: '', correo: '', pass: '', rol: 'Estudiante' }); alert("Usuario creado."); }
  };
  return (
    <div className="bg-white p-10 rounded-[40px] border shadow-sm">
      <h2 className="text-2xl font-black italic text-slate-800 mb-6 uppercase">Gestión de Personal</h2>
      <form onSubmit={guardar} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input className="border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
        <input className="border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm" placeholder="Email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required />
        <input className="border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm" type="password" placeholder="Pass" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} required />
        <select className="border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
          <option value="Estudiante">Estudiante</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button className="bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase">Registrar</button>
      </form>
    </div>
  );
}

// --- COMPONENTE CERTIFICADOS (Registro) ---
function SeccionCertificados({ certificados, setCertificados, esAdmin }) {
  const [form, setForm] = useState({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fecha_exp: '' });
  const guardar = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('certificados').insert([form]).select();
    if (!error) { setCertificados([...certificados, data[0]]); setForm({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fecha_exp: '' }); alert("Certificado emitido."); }
  };
  return (
    <div className="bg-white p-10 rounded-[40px] border shadow-sm">
      <h2 className="text-2xl font-black mb-8 italic uppercase text-slate-800">Emisión de Títulos</h2>
      {esAdmin ? (
        <form onSubmit={guardar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm font-bold" placeholder="Nombre Completo del Alumno" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
          <input className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm font-bold" placeholder="Curso o Módulo SAP" value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} required />
          <input className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm font-bold" placeholder="Horas Totales" value={form.horas} onChange={e => setForm({...form, horas: e.target.value})} required />
          <input className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm font-bold" placeholder="Nota de Aprobación" value={form.nota} onChange={e => setForm({...form, nota: e.target.value})} required />
          <input className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm font-bold" placeholder="Código de Verificación Único" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} required />
          <input className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl text-sm font-bold" placeholder="Fecha de Expedición" value={form.fecha_exp} onChange={e => setForm({...form, fecha_exp: e.target.value})} required />
          <button className="md:col-span-2 bg-slate-900 text-white p-5 rounded-[24px] font-black text-xs uppercase shadow-2xl">Registrar en Base de Datos</button>
        </form>
      ) : <p className="text-slate-400 italic text-center py-10 font-bold tracking-widest">ACCESO RESTRINGIDO - SOLO ADMINISTRADORES</p>}
    </div>
  );
}

// --- COMPONENTE VERIFICACIÓN PÚBLICA ---
function SeccionVerificacion({ db }) {
  const [code, setCode] = useState('');
  const [found, setFound] = useState(null);

  const handleSearch = () => {
    const result = db.find(c => c.codigo.trim().toLowerCase() === code.trim().toLowerCase());
    setFound(result || "error");
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="bg-white p-12 rounded-[50px] shadow-sm border text-center">
        <h2 className="text-3xl font-black mb-2 italic text-slate-800 uppercase">Validación de Credenciales</h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10 tracking-[0.5em]">SAP WORLD ACADEMY VERIFIED</p>
        
        <div className="flex gap-4 mb-10">
          <input className="flex-1 border-[3px] border-slate-100 p-6 rounded-[30px] text-center font-black text-xl outline-none focus:border-blue-600 transition-all" placeholder="CÓDIGO DE CERTIFICADO" value={code} onChange={e => setCode(e.target.value)} />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-12 rounded-[30px] font-black text-xs uppercase shadow-2xl hover:bg-blue-700 transition-colors">Validar</button>
        </div>

        {found === "error" && <p className="text-red-500 font-black uppercase text-sm animate-pulse">Código no registrado en el sistema oficial.</p>}

        {found && found !== "error" && (
          <div className="bg-slate-900 text-white p-12 rounded-[45px] text-left border-t-[12px] border-blue-500 animate-in zoom-in duration-500">
            <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
              <div>
                <p className="text-blue-400 text-[9px] font-black uppercase mb-1">Especialista Certificado</p>
                <h3 className="text-3xl font-black italic">{found.nombre}</h3>
              </div>
              <div className="bg-blue-600 px-4 py-1 rounded-full text-[8px] font-black uppercase">Estado: Válido</div>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div><p className="text-slate-500 text-[9px] font-black uppercase mb-1">Curso / Módulo</p><p className="text-lg font-bold text-slate-100">{found.curso}</p></div>
              <div><p className="text-slate-500 text-[9px] font-black uppercase mb-1">Código de Registro</p><p className="text-lg font-mono font-bold text-blue-400">{found.codigo}</p></div>
              <div><p className="text-slate-500 text-[9px] font-black uppercase mb-1">Nota Final</p><p className="text-lg font-bold text-slate-100">{found.nota}</p></div>
              <div><p className="text-slate-500 text-[9px] font-black uppercase mb-1">Horas Lectivas</p><p className="text-lg font-bold text-slate-100">{found.horas} Horas</p></div>
              <div className="col-span-2 pt-6 border-t border-slate-800 flex justify-between items-end">
                <div><p className="text-slate-500 text-[9px] font-black uppercase mb-1">Fecha de Expedición</p><p className="font-black text-blue-400">{found.fecha_exp}</p></div>
                <img src="/logo.png" alt="SAP Logo" className="h-8 opacity-20 grayscale" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- COMPONENTE LOGIN ---
function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-14 rounded-[60px] shadow-2xl w-full max-w-md border-t-[12px] border-blue-600 flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="h-48 mb-10 object-contain" />
        <div className="space-y-5 w-full">
          <input className="w-full border-2 p-5 rounded-3xl font-bold" placeholder="Usuario / Correo" value={u} onChange={e => setU(e.target.value)} />
          <input className="w-full border-2 p-5 rounded-3xl font-bold" type="password" placeholder="Contraseña" value={p} onChange={e => setP(e.target.value)} />
          <button onClick={() => onLogin(u, p)} className="w-full bg-blue-600 text-white p-6 rounded-[28px] font-black uppercase shadow-xl hover:scale-105 transition-all">Ingresar al Sistema</button>
        </div>
      </div>
    </div>
  );
}
