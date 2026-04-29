const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let certificados = [
  {
    codigo: "SWA-001",
    nombre: "Juan Perez",
    curso: "SAP MM y PM",
    horas: "80",
    nota: "18",
    estado: "Válido"
  }
];

// Obtener certificado
app.get('/certificado/:codigo', (req, res) => {
  const codigo = req.params.codigo;
  const cert = certificados.find(c => c.codigo === codigo);

  if (cert) {
    res.json({ valido: true, data: cert });
  } else {
    res.json({ valido: false });
  }
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor activo"));