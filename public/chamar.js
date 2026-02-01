const socket = io();

function chamarPaciente(){

 const paciente=document.getElementById("paciente").value.trim();
 const profissional=document.getElementById("profissional").value;
 const consultorio=document.getElementById("consultorio").value;

 if(!paciente||!profissional||!consultorio) return;

 socket.emit("chamar",{
   nome:paciente,
   profissional,
   consultorio
 });

 document.getElementById("paciente").value="";
 document.getElementById("paciente").focus();
}
