function buscar() {
  const codigo = document.getElementById("codigo").value;

  fetch(`/api/certificado/${codigo}`)
    .then(r => r.json())
    .then(data => {
      if (data) {
        document.getElementById("resultado").innerHTML =
          `✅ ${data.nombre} - ${data.curso}`;
      } else {
        document.getElementById("resultado").innerHTML =
          "❌ No encontrado";
      }
    });
}

function crear() {
  const data = {
    codigo: document.getElementById("codigo").value,
    nombre: document.getElementById("nombre").value,
    curso: document.getElementById("curso").value
  };

  fetch('/api/certificado', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  .then(() => {
  alert("Certificado creado correctamente");

  // Redirigir automáticamente a validación
  window.location.href = `/index.html`;
});
