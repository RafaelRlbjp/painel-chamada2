const socket = io();

const nome = document.getElementById("nome-paciente");
const prof = document.getElementById("nome-profissional");
const cons = document.getElementById("consultorio");
const hist = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

socket.on("novoChamado",dados=>{

 if(!dados.ultimo) return;

 nome.innerText = dados.ultimo.nome;
 prof.innerText = dados.ultimo.profissional;
 cons.innerText = dados.ultimo.consultorio;

 hist.innerHTML = "";

 dados.historico.forEach(p=>{
   const li = document.createElement("li");
   li.innerText = `${p.nome} - ${p.profissional}`;
   hist.appendChild(li);
 });

 painel.classList.add("piscar-amarelo");

 tocarBip(4);

 falar(`Paciente ${dados.ultimo.nome}, dirigir-se ao consultório ${dados.ultimo.consultorio}`);

 setTimeout(()=>{
   painel.classList.remove("piscar-amarelo");
 },3000);

});

function tocarBip(qtd){
 let i=0;
 const t=setInterval(()=>{
   bip.play();
   i++;
   if(i>=qtd) clearInterval(t);
 },500);
}

function falar(texto){
 const msg=new SpeechSynthesisUtterance(texto);
 msg.lang="pt-BR";
 speechSynthesis.speak(msg);
}
