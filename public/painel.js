const socket = io();
const sintetizador = window.speechSynthesis;

// 🔔 BEEP MP3 (2x)
const beep = new Audio("/audio/bip.mp3");

function tocarBeep() {
  beep.currentTime = 0;
  beep.play().catch(()=>{});

  setTimeout(() => {
    beep.currentTime = 0;
    beep.play().catch(()=>{});
  }, 1200);
}

socket.on("proxima-chamada", (dados) => {

  // 🔔 alerta sonoro MP3 (funciona na TV)
  tocarBeep();

  // 1. mover atual para histórico
  const nomeAtual = document.getElementById("nome-paciente").innerText;

  if (nomeAtual && nomeAtual !== "AGUARDANDO...") {
    const lista = document.getElementById("lista-historico");
    const novoItem = document.createElement("li");

    novoItem.innerText = nomeAtual;
    lista.prepend(novoItem);

    if (lista.children.length > 4) lista.lastChild.remove();
  }

  // 2. atualizar tela
  document.getElementById("nome-paciente").innerText = dados.paciente;
  document.getElementById("nome-profissional").innerText = dados.profissional;
  document.getElementById("consultorio").innerText = dados.consultorio;

  // 3. piscar SOMENTE painel
  document.querySelector(".area-principal").classList.add("piscar-amarelo");

  setTimeout(() => {
    document.querySelector(".area-principal").classList.remove("piscar-amarelo");
  }, 8000);

  // 4. voz (opcional — notebook)
  sintetizador.cancel();

  const frase = `Paciente ${dados.paciente}`;

  const falar = () => {
    const msg = new SpeechSynthesisUtterance(frase);
    msg.lang = "pt-BR";
    msg.rate = 0.9;
    sintetizador.speak(msg);
  };

  falar();
  setTimeout(falar, 6000);
});
