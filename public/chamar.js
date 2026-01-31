const socket = io();

// Função principal disparada pelo botão do formulário
function realizarChamada() {
    // 1. CAPTURA DOS DADOS DO FORMULÁRIO
    // Certifique-se de que os IDs abaixo existem no seu chamar.html
    const pacienteInput = document.getElementById("paciente");
    const profissionalInput = document.getElementById("profissional");
    const consultorioInput = document.getElementById("consultorio");

    // Validação básica para não enviar campos vazios
    if (!pacienteInput.value) {
        console.warn("Nome do paciente é obrigatório.");
        return;
    }

    const dados = {
        paciente: pacienteInput.value,
        profissional: profissionalInput.value || "Não informado",
        consultorio: consultorioInput.value || "Geral"
    };

    // 2. ENVIO PARA O SERVIDOR
    // O servidor recebe e repassa para o painel.js
    socket.emit("chamar", dados);

    // 3. LOG DE CONFIRMAÇÃO NO TERMINAL DO NAVEGADOR (SEM POP-UP)
    console.log("Chamada enviada com sucesso:", dados);

    // 4. LIMPAR O CAMPO DO PACIENTE PARA A PRÓXIMA CHAMADA
    pacienteInput.value = "";
    pacienteInput.focus(); // Coloca o cursor de volta no campo de texto
}

// Opcional: Permitir chamar ao apertar "Enter" no campo do paciente
document.getElementById("paciente").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        realizarChamada();
    }
});
