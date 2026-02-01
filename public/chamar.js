const socket=io();

function chamarPaciente(){

 const nome=document.getElementById("paciente").value.trim();
 const profissional=document.getElementById("profissional").value;
 const consultorio=document.getElementById("consultorio").value;

 if(!nome||!profissional||!consultorio) return;

 socket.emit("chamar",{nome,profissional,consultorio});

 document.getElementById("paciente").value="";
 document.getElementById("paciente").focus();
}
