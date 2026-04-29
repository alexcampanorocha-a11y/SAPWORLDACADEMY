const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let certificados = [
  { codigo: "CERT-001", nombre: "Juan Perez", curso: "SAP MM", horas: "80", nota: "18", fecha: "2026-04-20" }
];

// VALIDAR
app.get('/api/certificado/:codigo', (req, res) => {
  const cert = certificados.find(c => c.codigo === req.params.codigo);
  res.json(cert || null);
});

// CREAR
app.post('/api/certificado', (req, res) => {
  certificados.push(req.body);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Servidor listo"));