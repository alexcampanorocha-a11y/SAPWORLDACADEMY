import React, { useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';

export default function Verificacion({ mockDB }) {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);

  const validar = (e) => {
    e.preventDefault();
    const cert = mockDB.find(c => c.codigo.toUpperCase() === codigo.toUpperCase());
    setResultado(cert ? cert : 'error');
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-black mb-6">Validador Oficial</h2>
      <form onSubmit={validar} className="flex gap-2 mb-10">
        <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} className="border p-4 flex-1 rounded-xl" placeholder="Ingresa código..."/>
        <button className="bg-blue-600 text-white px-8 rounded-xl">Validar</button>
      </form>
      {resultado && resultado !== 'error' && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-emerald-500">
          <p className="text-emerald-600 font-bold flex items-center"> <ShieldCheck className="mr-2"/> CERTIFICADO VÁLIDO </p>
          <h3 className="text-2xl font-black mt-2">{resultado.nombre}</h3>
          <p className="text-slate-500">{resultado.curso}</p>
        </div>
      )}
    </div>
  );
}