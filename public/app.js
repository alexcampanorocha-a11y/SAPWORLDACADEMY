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
    })
    .catch(() => {
      document.getElementById("resultado").innerHTML =
        "❌ Error al conectar";
    });
}

function crear() {
  const codigo = document.getElementById("codigo").value;
  const nombre = document.getElementById("nombre").value;
  const curso = document.getElementById("curso").value;

  if (!codigo || !nombre || !curso) {
    alert("Completa todos los campos");
    return;
  }

  fetch('/api/certificado', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      codigo,
      nombre,
      curso
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Certificado guardado correctamente");

    // REDIRECCIÓN
    window.location.href = `/index.html`;
  })
  .catch(() => {
    alert("Error al guardar");
  });
}
