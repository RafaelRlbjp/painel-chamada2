const socket = io();

function chamar() {
  const nome = paciente.value.trim();
  const prof = profissional.value;
  const cons = consultorio.value;

  if (!nome || !prof || !cons) {
    alert("Preencha tudo");
    return;
  }

  socket.emit("chamar", {
    nome,
    profissional: prof,
    local: consultorio.options[consultorio.selectedIndex].text
  });

  paciente.value = "";
}
