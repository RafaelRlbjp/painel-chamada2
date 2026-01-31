const socket = io();

// Função que é disparada ao clicar no botão ou dar Submit no formulário
function realizarChamada(event) {
    // Se estiver usando dentro de um formulário <form>, isso evita o recarregamento da página
    if (event) event.preventDefault();

    // Captura os valores dos campos pelos IDs
    const inputPaciente = document.getElementById("input-paciente");
    const inputProfissional = document.getElementById("input-profissional");
    const inputConsultorio = document.getElementById("input-consultorio");

    const paciente = inputPaciente.value.trim();
    const profissional = inputProfissional.value;
    const consultorio = inputConsultorio.value;

    // Validação simples: não envia se o nome do paciente estiver vazio
    if (paciente === "") {
        console.warn("Tentativa de chamada com nome vazio negada.");
        return;
    }

    // Monta o objeto de dados exatamente como o servidor e o painel esperam
    const dados = {
        paciente: paciente,
        profissional: profissional,
        consultorio: consultorio
    };

    // Envia os dados para o servidor (que vai colocar na fila)
    socket.emit("chamar", dados);

    // LOG de confirmação no console (substitui o alert para não travar a tela)
    console.log("Chamada enviada com sucesso para a fila:", dados);

    // Limpa apenas o campo do nome do paciente para a próxima chamada
    inputPaciente.value = "";
    inputPaciente.focus(); // Coloca o cursor de volta no campo de nome
}

// Opcional: Permitir que o "Enter" no campo de nome também chame o paciente
document.getElementById("input-paciente").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        realizarChamada(e);
    }
});