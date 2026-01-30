const socket = io();

// Função disparada pelo botão "CHAMAR" no seu HTML
function chamarPaciente() {
    console.log("Iniciando chamada...");

    // 1. Captura os elementos do seu HTML pelos IDs corretos
    const selectProfissional = document.getElementById("profissional");
    const inputPaciente = document.getElementById("paciente");
    const selectConsultorio = document.getElementById("consultorio");

    // 2. Extrai os valores digitados/selecionados
    const nomeProfissional = selectProfissional.value;
    const nomePaciente = inputPaciente.value;
    const nomeConsultorio = selectConsultorio.value;

    // 3. Validações básicas para evitar chamadas vazias
    if (!nomeProfissional) {
        alert("Por favor, selecione um Profissional.");
        return;
    }
    if (!nomePaciente.trim()) {
        alert("Por favor, digite o nome do Paciente.");
        return;
    }
    if (!nomeConsultorio) {
        alert("Por favor, selecione o Consultório.");
        return;
    }

    // 4. Monta o objeto de dados exatamente como o painel.js espera
    const dados = {
        paciente: nomePaciente,
        profissional: nomeProfissional,
        consultorio: nomeConsultorio
    };

    // 5. Envia para o servidor via Socket.io
    socket.emit("chamar", dados);

    // 6. Feedback visual e limpeza do campo paciente
    console.log("Dados enviados ao servidor:", dados);
    alert("Chamando: " + nomePaciente);
    
    // Limpa apenas o nome do paciente para a próxima chamada
    inputPaciente.value = "";
}

// Log para confirmar que o dispositivo de chamada conectou
socket.on("connect", () => {
    console.log("Controle conectado ao servidor!");
});