const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let fila = [];
let executando = false;
let liberado = false;
let primeira = true;

/* ================= LIBERA AUDIO NA TV ================= */

document.body.addEventListener("click", () => {

  if (liberado) return;
  liberado = true;

  bip.currentTime = 0;
  bip.play().then(() => {
    bip.pause();
    bip.currentTime = 0;
  }).catch(() => {});

  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(""));

}, { once: true });

/* ================= RECEBE CHAMADO ================= */

socket.on("novoChamado", dados => {

  if (!dados || !dados.ultimo) return;

  fila.push(dados);

  if (!executando) executarFila();

});

/* ================= FILA ================= */

function executarFila() {

  if (fila.length === 0) {
    executando = false;
    return;
  }

  executando = true;

  const dados = fila.shift();

  atualizarTela(dados);

  if (primeira) {
    primeira = false;
    executando = false;
    return;
  }

  chamar2x(dados);
}

/* ================= UI ================= */

function atualizarTela(dados) {

  nome.innerText = dados.ultimo.nome.toUpperCase();
  prof.innerText = dados.ultimo.profissional.toUpperCase();
  cons.innerText = dados.ultimo.consultorio.toUpperCase();

  hist.innerHTML = "";

  dados.historico.forEach(p => {
    const li = document.createElement("li");
    li.innerText = p.nome;
    hist.appendChild(li);
  });
}

/* ================= CHAMADA DUPLA ================= */

function chamar2x(dados) {

  let vezes = 0;

  const repetir = setInterval(() => {

    painel.classList.add("piscar-amarelo");

    tocarBip(2);
    falar(dados);

    vezes++;

    if (vezes >= 2) {

      clearInterval(repetir);

      setTimeout(() => {
        painel.classList.remove("piscar-amarelo");
        executando = false;
        executarFila();
      }, 2500);

    }

  }, 3500);
}

/* ================= BIP ================= */

function tocarBip(qtd) {

  let i = 0;

  const t = setInterval(() => {

    bip.currentTime = 0;
    bip.play().catch(() => {});

    i++;

    if (i >= qtd) clearInterval(t);

  }, 450);
}

/* ================= VOZ ================= */

function falar(d) {

  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(
    `Paciente ${d.ultimo.nome}. Dirigir-se ao ${d.ultimo.consultorio}. Com ${d.ultimo.profissional}`
  );

  msg.lang = "pt-BR";
  msg.rate = 0.9;

  speechSynthesis.speak(msg);
}
