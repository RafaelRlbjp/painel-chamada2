const socket = io();

let fila = [];
let chamando = false;

// profissional → pacientes
let mapaPacientes = {};

const nome = document.getElementById("nome");
const local = document.getElementById("local");
const prof = document.getElementById("profissional");
const historico = document.getElementById("historico");
const ultimo = document.getElementById("ultimo");
const btnSom = document.getElementById("ativarSom");

let audioLiberado = false;

// liberar som
if (btnSom) {
  btnSom.addEventListener("click", () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    audioLiberado = true;
    btnSom.style.display = "none";
  });
}

function falar(texto) {
  return new Promise(resolve => {

    if (audioLiberado) {
      const msg = new SpeechSynthesisUtterance(texto);
      msg.lang = "pt-BR";
      msg.rate = 0.9;

      speechSynthesis.cancel();
      speechSynthesis.speak(msg);
    }

    ultimo.classList.add("piscar");

    setTimeout(() => {
      ultimo.classList.remove("piscar");
      resolve();
    }, texto.length * 140);
  });
}

// processar fila
async function executar() {
  if (chamando || fila.length === 0) return;

  chamando = true;

  const d = fila.shift();

  if (!mapaPacientes[d.profissional]) {
    mapaPacientes[d.profissional] = [];
  }

  let lista = mapaPacientes[d.profissional];
  let posicao;

  // NÃO incrementa se for segunda chamada
  if (lista.includes(d.nome)) {
    posicao = lista.indexOf(d.nome) + 1;
  } else {
    lista.push(d.nome);
    posicao = lista.length;
  }

  nome.innerHTML = `
    <div class="numero">Paciente ${posicao}</div>
    <div class="paciente">${d.nome}</div>
  `;

  // NÃO repete consultório aqui
  local.innerHTML = `<div>${d.local}</div>`;
  prof.innerHTML = `<div>${d.profissional}</div>`;

  const frase = `Paciente ${posicao} ${d.nome}, dirigir-se para ${d.local}, com ${d.profissional}`;

  await falar(frase);
  await falar(frase);

  const hora = new Date().toLocaleTimeString();

  const li = document.createElement("li");
li.innerText = `${hora} — Paciente ${posicao} — ${d.nome} — ${d.local} — ${d.profissional}`;
historico.prepend(li);

  if (historico.children.length > 5)
    historico.removeChild(historico.lastChild);

  chamando = false;
  executar();
}

// receber chamadas
socket.off("chamada");

socket.on("chamada", dados => {
  fila.push(dados);
  executar();
});
