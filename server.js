const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const FILE = 'certificados.json';

// Leer archivo
function leerDatos() {
  try {
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Guardar archivo
function guardarDatos(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// VALIDAR
app.get('/api/certificado/:codigo', (req, res) => {
  const data = leerDatos();
  const cert = data.find(c => c.codigo === req.params.codigo);
  res.json(cert || null);
});

// CREAR
app.post('/api/certificado', (req, res) => {
  const { codigo, nombre, curso } = req.body;

  if (!codigo || !nombre || !curso) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  let data = leerDatos();

  const existe = data.find(c => c.codigo === codigo);
  if (existe) {
    return res.status(400).json({ error: "Código ya existe" });
  }

  data.push({ codigo, nombre, curso });
  guardarDatos(data);

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor con JSON listo"));
