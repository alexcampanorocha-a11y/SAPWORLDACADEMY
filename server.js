const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let certificados = [
  { codigo: "CERT-001", nombre: "Juan Perez", curso: "SAP MM" }
];

// VALIDAR
app.get('/api/certificado/:codigo', (req, res) => {
  const cert = certificados.find(c => c.codigo === req.params.codigo);
  res.json(cert || null);
});

// CREAR (AQUÍ ESTABA EL ERROR PROBABLE)
app.post('/api/certificado', (req, res) => {
  const { codigo, nombre, curso } = req.body;

  if (!codigo || !nombre || !curso) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  certificados.push({ codigo, nombre, curso });

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor funcionando"));
