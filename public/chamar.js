const socket = io();

// Função para disparar a chamada
function chamarPaciente() {
    // 1. Captura os valores digitados nos campos do seu HTML
    // Certifique-se de que os IDs ('paciente', 'profissional', 'consultorio') existem no seu HTML
    const nomePaciente = document.getElementById("paciente").value;
    const nomeProfissional = document.getElementById("profissional").value;
    const numConsultorio = document.getElementById("consultorio").value;

    // Validação simples para não enviar vazio
    if (!nomePaciente) {
        alert("Por favor, digite o nome do paciente!");
        return;
    }

    // 2. Monta o objeto com os nomes exatos que o painel.js espera receber
    const dados = {
        paciente: nomePaciente,
        profissional: nomeProfissional,
        consultorio: numConsultorio
    };

    // 3. Envia para o servidor via Socket.io
    socket.emit("chamar", dados);
    
    console.log("Chamada enviada com sucesso:", dados);
    
    // Opcional: Limpar o campo do paciente após chamar
    document.getElementById("paciente").value = "";
}

// Escuta confirmação do servidor (opcional para debug)
socket.on("connect", () => {
    console.log("Conectado ao servidor para realizar chamadas!");
});