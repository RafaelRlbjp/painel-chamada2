const socket = io();

socket.on("chamada", (dados) => {
    console.log("Recebido:", dados);

    // 1. Atualiza os textos (verifica se existem antes para não dar erro)
    const elPaciente = document.getElementById("nome-paciente");
    const elConsultorio = document.getElementById("consultorio");
    const elProfissional = document.getElementById("nome-profissional");

    if(elPaciente) elPaciente.innerText = dados.paciente;
    if(elConsultorio) elConsultorio.innerText = dados.consultorio;
    if(elProfissional) elProfissional.innerText = dados.profissional;

    // 2. Alerta Visual (Piscar Amarelo)
    const container = document.querySelector(".painel-container");
    if (container) {
        container.classList.add("piscar-amarelo");
    }

    // 3. Função de Voz
    const falar = (texto) => {
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    };

    // 4. Sequência de fala
    falar(`Paciente, ${dados.paciente}`);
    falar(`Paciente, ${dados.paciente}`);
    falar(`Dirigir-se ao ${dados.consultorio} com ${dados.profissional}`);

    // 5. Remove o pisca após 10 segundos
    setTimeout(() => {
        if (container) container.classList.remove("piscar-amarelo");
    }, 10000);
});