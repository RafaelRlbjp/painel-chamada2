const socket = io();
const sintetizador = window.speechSynthesis;

const beep = new Audio("/audio/bip.mp3");

function tocar2Bips() {
  beep.currentTime = 0;
  beep.play().catch(()=>{});

  setTimeout(() => {
    beep.currentTime = 0;
    beep.play().catch(()=>{});
  }, 700);
}

function falar(frase) {
  const msg = new SpeechSynthesisUtterance(frase);
  msg.lang = "pt-BR";
  msg.rate = 0.9;
  sintetizador.speak(msg);
}

socket.on("proxima-chamada", (dados) => {

  const frase = `Paciente ${dados.paciente}`;

  // ================= PRIMEIRA CHAMADA =================
  tocar2Bips();

  setTimeout(() => {
    sintetizador.cancel();
    falar(frase);
  }, 1400);

  // ================= SEGUNDA CHAMADA =================
  setTimeout(() => {
    tocar2Bips();
  }, 6000);

  setTimeout(() => {
    sintetizador.cancel();
    falar(frase);
  }, 7400);


  // ---------- histórico ----------
  const nomeAtual = document.getElementById("nome-paciente").innerText;

  if (nomeAtual && nomeAtual !== "AGUARDANDO...") {
    const lista = document.getElementById("lista-historico");
    const novoItem = document.createElement("li");

    novoItem.innerText = nomeAtual;
    lista.prepend(novoItem);

    if (lista.children.length > 4) lista.lastChild.remove();
  }

  // ---------- atualizar painel ----------
  document.getElementById("nome-paciente").innerText = dados.paciente;
  document.getElementById("nome-profissional").innerText = dados.profissional;
  document.getElementById("consultorio").innerText = dados.consultorio;

  // ---------- piscar apenas painel ----------
  const painel = document.querySelector(".area-principal");
  painel.classList.add("piscar-amarelo");

  setTimeout(() => {
    painel.classList.remove("piscar-amarelo");
  }, 9000);

});
