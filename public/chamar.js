const socket = io();

function chamarPaciente() {
    // Captura os elementos pelos IDs do seu HTML
    const selectProfissional = document.getElementById("profissional");
    const inputPaciente = document.getElementById("paciente");
    const selectConsultorio = document.getElementById("consultorio");

    const paciente = inputPaciente.value.trim();
    const profissional = selectProfissional.value;
    const consultorio = selectConsultorio.value;

    // Validação silenciosa (sem alert para não travar)
    if (paciente === "" || profissional === "" || consultorio === "") {
        console.warn("Preencha todos os campos!");
        return;
    }

    const dados = {
        paciente: paciente,
        profissional: profissional,
        consultorio: consultorio
    };

    // Envia para a fila do servidor
    socket.emit("chamar", dados);

    // Limpa o campo de nome e foca nele para o próximo
    inputPaciente.value = "";
    inputPaciente.focus();
    
    console.log("Chamada enviada para a fila:", dados);
}