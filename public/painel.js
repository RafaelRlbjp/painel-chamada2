const socket=io();

const nome=document.getElementById("nome-paciente");
const prof=document.getElementById("nome-profissional");
const cons=document.getElementById("consultorio");
const hist=document.getElementById("lista-historico");
const bip=document.getElementById("bip");
const painel=document.getElementById("painel");

let primeira=true;

socket.on("novoChamado",dados=>{

 if(!dados||!dados.ultimo) return;

 nome.innerText=dados.ultimo.nome.toUpperCase();
 prof.innerText=dados.ultimo.profissional.toUpperCase();
 cons.innerText=dados.ultimo.consultorio.toUpperCase();

 hist.innerHTML="";
 dados.historico.forEach(p=>{
  const li=document.createElement("li");
  li.innerText=`${p.nome} - ${p.profissional}`;
  hist.appendChild(li);
 });

 if(primeira){
   primeira=false;
   return;
 }

 painel.classList.add("piscar-amarelo");
 tocarBip();
 falar(dados.ultimo);

 setTimeout(()=>painel.classList.remove("piscar-amarelo"),3500);

});

function tocarBip(){

 let i=0;

 const t=setInterval(()=>{
  bip.currentTime=0;
  bip.play().catch(()=>{});
  i++;
  if(i>=4) clearInterval(t);
 },500);
}

function falar(d){

 const texto=`Paciente ${d.nome}, com ${d.profissional}, dirigir-se ao ${d.consultorio}`;

 const msg=new SpeechSynthesisUtterance(texto);
 msg.lang="pt-BR";
 msg.rate=0.9;

 speechSynthesis.cancel();
 speechSynthesis.speak(msg);
}

document.body.addEventListener("click",()=>{
 speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
},{once:true});
