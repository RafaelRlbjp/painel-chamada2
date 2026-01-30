const socket = io();

function chamar() {
  const pacienteInput = document.getElementById("paciente");
  const profissionalSelect = document.getElementById("profissional");
  const consultorioSelect = document.getElementById("consultorio");

  const nome = pacienteInput.value.trim();
  const prof = profissionalSelect.value;
  const localTexto = consultorioSelect.options[consultorioSelect.selectedIndex].text;

  if (!nome || !prof || consultorioSelect.value === "") {
    alert("Preencha todos os campos!");
    return;
  }

  // Enviando o objeto para o servidor
  socket.emit("chamar", {
    paciente: nome,      // Nome que o painel vai ler
    profissional: prof,  // Nome que o painel vai ler
    local: localTexto    // Nome que o painel vai ler
  });

  pacienteInput.value = "";
  console.log("Chamada enviada com sucesso!");
}