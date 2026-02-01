const socket=io();

const nome=document.getElementById("nome-paciente");
const prof=document.getElementById("nome-profissional");
const cons=document.getElementById("consultorio");
const hist=document.getElementById("lista-historico");
const bip=document.getElementById("bip");
const painel=document.getElementById("painel");

socket.on("novoChamado",dados=>{

 if(!dados||!dados.ultimo) return;

 nome.innerText=dados.ultimo.nome;
 prof.innerText=dados.ultimo.profissional;
 cons.innerText=dados.ultimo.consultorio;

 hist.innerHTML="";

 dados.historico.forEach(p=>{
  const li=document.createElement("li");
  li.innerText=`${p.nome} - ${p.profissional}`;
  hist.appendChild(li);
 });

 painel.classList.add("piscar-amarelo");

 tocarBip();
 chamarVoz(dados.ultimo.nome,dados.ultimo.profissional,dados.ultimo.consultorio);

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

function chamarVoz(nome,profissional,local){

 const texto=`Paciente ${nome}, com ${profissional}, dirigir-se ao ${local}`;

 let v=0;

 const repetir=setInterval(()=>{

  const msg=new SpeechSynthesisUtterance(texto);
  msg.lang="pt-BR";
  msg.rate=0.9;
  speechSynthesis.speak(msg);

  v++;
  if(v>=2) clearInterval(repetir);

 },3500);
}

document.body.addEventListener("click",()=>{
 bip.play().catch(()=>{});
 speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
},{once:true});
