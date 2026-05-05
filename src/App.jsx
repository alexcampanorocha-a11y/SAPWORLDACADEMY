import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';

const EMPRESA_INFO = {
  mision: "Brindar capacitación técnica de élite en módulos SAP MM y PM para potenciar la industria minera e industrial.",
  vision: "Ser la academia virtual referente en el mercado hispanohablante para consultores SAP."
};

// Correo maestro para identificar al administrador principal
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
    // Acceso Maestro para administración
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
      {/* Sidebar con Logo de SAP World Academy */}
      <div className="flex flex-col h-full bg-white border-r w-72 shadow-xl relative z-20">
        <div className="p-8 border-b flex flex-col items-center bg-slate-50/50">
          <img 
            src="/logo.png" 
            alt="SAP World Logo" 
            className="h-40 w-auto mb-4 object-contain drop-shadow-md" 
          />
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
          <div className="text-right">
             <p className="text-[9px] font-black text-blue-600 uppercase">Usuario Activo</p>
             <p className="text-xs font-bold italic">{userEmail}</p>
          </div>
        </header>

        {activeTab === 'inicio' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Banner Principal Superior con Texto Actualizado */}
            <div className="w-full h-72 rounded-[45px] overflow-hidden shadow-2xl border-4 border-white relative">
              <img 
                src="/banner-inicio.jpg" 
                alt="Banner SAP" 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-1000"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1454165833767-0275080064f1?q=80&w=1200"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent flex items-center p-12">
                <h2 className="text-white text-4xl font-black italic uppercase tracking-tighter drop-shadow-lg">
                  Formando expertos con SAP <br/> para el area industrial
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-6">
                <div className="h-56 w-full rounded-[40px] overflow-hidden shadow-lg border-4 border-white">
                  <img 
                    src="/mision-img.jpg" 
                    alt="Misión" 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800"; }}
                  />
                </div>
                <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 border-l-8 border-l-blue-600 flex-1">
                  <h2 className="font-black text-blue-600 uppercase text-xs mb-3 tracking-[0.2em]">Nuestra Misión</h2>
                  <p className="text-slate-600 italic text-sm leading-relaxed font-medium">"{EMPRESA_INFO.mision}"</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="h-56 w-full rounded-[40px] overflow-hidden shadow-lg border-4 border-white">
                  <img 
                    src="/vision-img.jpg" 
                    alt="Visión" 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"; }}
                  />
                </div>
                <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 border-l-8 border-l-indigo-600 flex-1">
                  <h2 className="font-black text-indigo-600 uppercase text-xs mb-3 tracking-[0.2em]">Nuestra Visión</h2>
                  <p className="text-slate-600 italic text-sm leading-relaxed font-medium">"{EMPRESA_INFO.vision}"</p>
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

// --- COMPONENTES AUXILIARES ---

function SeccionUsuarios({ setUsuarios, usuarios }) {
  const [form, setForm] = useState({ nombre: '', correo: '', pass: '', rol: 'Estudiante' });
  
  const guardar = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('usuarios').insert([form]);
    if (!error) { 
      setUsuarios(prev => [...prev, form]); 
      setForm({ nombre: '', correo: '', pass: '', rol: 'Estudiante' }); 
      alert("Acceso institucional creado."); 
    } else { alert("Error al registrar el usuario."); }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm("¿Eliminar este acceso?")) {
      const { error } = await supabase.from('usuarios').delete().eq('id', id);
      if (!error) {
        setUsuarios(prev => prev.filter(u => u.id !== id));
        alert("Usuario eliminado.");
      }
    }
  };

  return (
    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
      <h2 className="text-2xl font-black italic text-slate-800 mb-6 uppercase tracking-tighter">Gestión de Personal</h2>
      <form onSubmit={guardar} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <input className="border-2 border-slate-50 bg-slate-50/50 p-4 rounded-2xl text-sm outline-none focus:border-blue-600 focus:bg-white" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
        <input className="border-2 border-slate-50 bg-slate-50/50 p-4 rounded-2xl text-sm outline-none focus:border-blue-600 focus:bg-white" placeholder="Email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required />
        <input className="border-2 border-slate-50 bg-slate-50/50 p-4 rounded-2xl text-sm outline-none focus:border-blue-600 focus:bg-white" type="password" placeholder="Pass" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} required />
        <select className="border-2 border-slate-50 bg-slate-50/50 p-4 rounded-2xl text-sm font-bold" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
          <option value="Estudiante">Estudiante</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button className="bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors">Registrar</button>
      </form>

      <div className="space-y-2">
        {usuarios.map(u => (
          <div key={u.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold">{u.nombre} ({u.correo})</span>
            {u.correo !== ADMIN_MASTER_EMAIL && (
              <button onClick={() => eliminarUsuario(u.id)} className="text-red-500 font-black text-[10px] uppercase hover:underline">Eliminar Acceso</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeccionAula({ archivos, setArchivos, clases, setClases, esAdmin }) {
  const [tema, setTema] = useState('');

  const eliminarDato = async (id, tabla) => {
    if (window.confirm("¿Deseas eliminar este material permanentemente?")) {
      const { error } = await supabase.from(tabla).delete().eq('id', id);
      if (!error) {
        if (tabla === 'materiales') setArchivos(prev => prev.filter(a => a.id !== id));
        else setClases(prev => prev.filter(c => c.id !== id));
        alert("Eliminado del sistema.");
      }
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
      
      setTema(''); alert("Cargado con éxito.");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white p-10 rounded-[40px] border shadow-sm">
        <h2 className="text-2xl font-black mb-6 italic text-slate-800">Repositorio PDF</h2>
        {esAdmin && <input type="file" onChange={(e) => manejarSubida(e, 'mat')} className="mb-6 block text-xs" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archivos.map((a) => (
            <div key={a.id} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-3xl border">
              <span className="font-bold text-xs truncate mr-4">📄 {a.nombre}</span>
              <div className="flex gap-4 items-center">
                <a href={a.link} target="_blank" rel="noreferrer" className="text-blue-600 font-black text-[10px] uppercase">Descargar</a>
                {esAdmin && (
                  <button onClick={() => eliminarDato(a.id, 'materiales')} className="text-red-500 font-black text-[10px] uppercase">Eliminar</button>
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
            <input className="border-2 border-white p-4 rounded-2xl flex-1 text-sm outline-none focus:border-indigo-400" placeholder="Título de la clase" value={tema} onChange={e => setTema(e.target.value)} />
            <input type="file" onChange={(e) => manejarSubida(e, 'zoom')} className="text-xs self-center" />
          </div>
        )}
        <div className="grid gap-4">
          {clases.map((c) => (
            <div key={c.id} className="flex justify-between p-6 bg-white border rounded-[30px] shadow-sm items-center">
              <span className="font-black text-sm text-slate-700 italic">🎥 {c.tema}</span>
              <div className="flex gap-4 items-center">
                <a href={c.link} target="_blank" rel="noreferrer" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all">Ver Clase</a>
                {esAdmin && (
                  <button onClick={() => eliminarDato(c.id, 'clases_zoom')} className="text-red-500 font-black text-[10px] uppercase">Eliminar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SeccionCertificados({ certificados, setCertificados, esAdmin }) {
  const [form, setForm] = useState({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fecha_exp: '' });
  
  const guardar = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('certificados').insert([form]).select();
    if (!error) { setCertificados([...certificados, data[0]]); setForm({ nombre: '', curso: '', horas: '', nota: '', codigo: '', fecha_exp: '' }); alert("Certificado emitido."); }
  };

  const eliminarCert = async (id) => {
    if (window.confirm("¿Anular este certificado del sistema?")) {
      const { error } = await supabase.from('certificados').delete().eq('id', id);
      if (!error) {
        setCertificados(prev => prev.filter(c => c.id !== id));
        alert("Certificado anulado.");
      }
    }
  };

  return (
    <div className="bg-white p-10 rounded-[40px] border shadow-sm">
      <h2 className="text-2xl font-black mb-8 italic uppercase text-slate-800">Emisión de Títulos Oficiales</h2>
      {esAdmin ? (
        <>
          <form onSubmit={guardar} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {Object.keys(form).map(k => (
              <div key={k}>
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2 mb-1 block">{k.replace('_',' ')}</label>
                <input className="w-full border-2 border-slate-50 bg-slate-50/50 p-4 rounded-2xl text-sm outline-none focus:border-blue-600 uppercase font-bold" value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})} required />
              </div>
            ))}
            <button className="md:col-span-2 bg-slate-900 text-white p-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 shadow-2xl transition-all">Registrar en Sistema</button>
          </form>

          <div className="border-t pt-8">
             <h3 className="text-sm font-black uppercase text-slate-400 mb-4 tracking-widest">Historial Reciente</h3>
             <div className="space-y-3">
                {certificados.slice(-5).map(c => (
                  <div key={c.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl text-xs">
                    <span className="font-bold">{c.nombre} - {c.codigo}</span>
                    <button onClick={() => eliminarCert(c.id)} className="text-red-500 font-black uppercase">Anular</button>
                  </div>
                ))}
             </div>
          </div>
        </>
      ) : <p className="text-slate-400 italic text-center py-10 font-bold">Acceso restringido para alumnos.</p>}
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
    <div className="max-w-3xl mx-auto py-10">
      <div className="bg-white p-12 rounded-[50px] shadow-sm border text-center relative overflow-hidden">
        <h2 className="text-3xl font-black mb-2 italic text-slate-800">CENTRO DE VALIDACIÓN</h2>
        <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] mb-12 font-black">Autenticación SAP World Academy</p>
        <div className="flex gap-4 mb-14 relative z-10">
          <input className="flex-1 border-[3px] border-slate-100 p-6 rounded-[30px] outline-none focus:border-blue-600 text-center font-black tracking-[0.2em] shadow-inner text-xl" placeholder="CÓDIGO ID" value={code} onChange={e => setCode(e.target.value)} />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-12 rounded-[30px] font-black text-xs uppercase shadow-2xl hover:bg-blue-700">Validar</button>
        </div>
        {found === "error" && <p className="text-red-500 font-black uppercase text-sm animate-pulse">Código no registrado en el sistema</p>}
        {found && found !== "error" && (
          <div className="bg-slate-900 text-white p-12 rounded-[45px] text-left shadow-2xl animate-in zoom-in duration-500 border-t-[12px] border-blue-500 relative z-10">
            <div className="flex justify-between items-start mb-10 border-b border-slate-800 pb-8">
              <div><p className="text-blue-400 text-[10px] font-black uppercase mb-2">Especialista Certificado</p><h3 className="text-4xl font-black italic leading-none">{found.nombre}</h3></div>
              <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-xl shadow-blue-900/40">Validado</div>
            </div>
            <div className="grid grid-cols-2 gap-y-10 gap-x-12">
              <div><p className="text-slate-500 text-[9px] font-black uppercase mb-2">Módulo</p><p className="text-lg font-bold text-slate-200">{found.curso}</p></div>
              <div><p className="text-slate-500 text-[9px] font-black uppercase mb-2">ID Registro</p><p className="text-lg font-mono font-bold text-blue-400">{found.codigo}</p></div>
              <div><p className="text-slate-500 text-[9px] font-black uppercase mb-2">Nota</p><p className="text-lg font-bold text-slate-200">{found.nota}</p></div>
              <div><p className="text-slate-500 text-[9px] font-black uppercase mb-2">Horas</p><p className="text-lg font-bold text-slate-200">{found.horas} h</p></div>
              <div className="col-span-2 pt-8 border-t border-slate-800 flex flex-col items-center">
                <p className="text-slate-500 text-[9px] font-black uppercase mb-2">Expedición</p>
                <p className="font-black text-blue-400 text-sm mb-6">{found.fecha_exp}</p>
                <img src="/logo.png" className="h-10 grayscale opacity-30" alt="SAP Logo" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-14 rounded-[60px] shadow-2xl w-full max-w-md border-t-[12px] border-blue-600 flex flex-col items-center animate-in zoom-in duration-500">
        <img src="/logo.png" alt="Logo" className="h-48 w-auto mb-10 object-contain drop-shadow-xl" />
        <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic mb-10">SAP WORLD</h2>
        <div className="space-y-5 w-full">
          <input className="w-full border-[3px] border-slate-50 bg-slate-50/50 p-5 rounded-3xl outline-none focus:border-blue-600 font-bold text-sm" placeholder="Correo Institucional" value={u} onChange={e => setU(e.target.value)} />
          <input className="w-full border-[3px] border-slate-50 bg-slate-50/50 p-5 rounded-3xl outline-none focus:border-blue-600 font-bold text-sm" type="password" placeholder="Contraseña" value={p} onChange={e => setP(e.target.value)} />
          <button onClick={() => onLogin(u, p)} className="w-full bg-blue-600 text-white p-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/30 mt-6 transition-all hover:scale-[1.02]">Ingresar al Sistema</button>
        </div>
      </div>
    </div>
  );
}
