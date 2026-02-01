const socket = io();

function chamarPaciente() {
  const paciente = document.getElementById("paciente").value.trim();
  const profissional = document.getElementById("profissional").value;
  const consultorio = document.getElementById("consultorio").value;

  if (!paciente || !profissional || !consultorio) {
    alert("Preencha todos os campos!");
    return;
  }

  // Enviando como 'nome' para bater com o servidor
  socket.emit("chamar", {
    nome: paciente,
    profissional: profissional,
    consultorio: consultorio
  });

  document.getElementById("paciente").value = "";
  document.getElementById("paciente").focus();
}