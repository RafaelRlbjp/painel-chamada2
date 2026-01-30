const socket = io();

socket.on("chamada", (dados) => {
    console.log("Chamada recebida:", dados);

    // 1. Atualiza os textos na tela
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 2. Inicia o alerta visual (Piscar Amarelo)
    const container = document.querySelector(".painel-container") || document.body;
    container.classList.add("piscar-amarelo");

    // 3. Função para o computador falar
    const falar = (texto) => {
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'pt-BR';
        msg.rate = 0.9; // Velocidade um pouco mais lenta para clareza
        window.speechSynthesis.speak(msg);
    };

    // 4. Executa a fala (2x o paciente e depois o profissional)
    // Falando o nome do paciente duas vezes
    falar(`Paciente, ${dados.paciente}`);
    falar(`Paciente, ${dados.paciente}`);
    
    // Falando o profissional e consultório
    falar(`Dirigir-se ao ${dados.consultorio} com ${dados.profissional}`);

    // 5. Para de piscar após a fala (aproximadamente 8 a 10 segundos)
    setTimeout(() => {
        container.classList.remove("piscar-amarelo");
    }, 10000);
});