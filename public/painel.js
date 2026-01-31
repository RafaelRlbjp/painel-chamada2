const socket = io();
const sintetizador = window.speechSynthesis;

const nomePaciente = document.getElementById("nome-paciente");
const nomeProfissional = document.getElementById("nome-profissional");
const consultorio = document.getElementById("consultorio");
const listaHistorico = document.getElementById("lista-historico");

// estado inicial
nomePaciente.classList.add("aguardando");

socket.on("proxima-chamada", (dados) => {

  /* HISTÓRICO */
  const nomeAtual = nomePaciente.innerText;
  if (nomeAtual && nomeAtual !== "AGUARDANDO...") {
    const li = document.createElement("li");
    li.innerText = nomeAtual;
    listaHistorico.prepend(li);
    if (listaHistorico.children.length > 4)
      listaHistorico.lastChild.remove();
  }

  /* ATUALIZA TELA */
  nomePaciente.innerText = dados.paciente;
  nomeProfissional.innerText = dados.profissional;
  consultorio.innerText = dados.consultorio;

  nomePaciente.classList.remove("aguardando");

  /* ALERTA VISUAL */
  document.body.classList.add("piscar-amarelo");
  setTimeout(() => {
    document.body.classList.remove("piscar-amarelo");
  }, 12000);

  /* VOZ (2x) */
  sintetizador.cancel();

  const frase = `Paciente ${dados.paciente}. Comparecer ao ${dados.consultorio} com ${dados.profissional}`;

  function falar() {
    const msg = new SpeechSynthesisUtterance(frase);
    msg.lang = "pt-BR";
    msg.rate = 0.9;
    sintetizador.speak(msg);
  }

  falar();
  setTimeout(falar, 6000);
});

setInterval(()=>{
  const r = document.getElementById("relogio");
  r.innerText = new Date().toLocaleTimeString();
},1000);
