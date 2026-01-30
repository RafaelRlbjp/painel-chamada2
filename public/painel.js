const socket = io();

socket.on("chamada", (dados) => {
    console.log("Nova chamada recebida:", dados);

    // 1. Atualiza os textos na tela
    // Certifique-se que esses IDs existam no seu painel.html
    const elementoPaciente = document.getElementById("nome-paciente");
    const elementoProfissional = document.getElementById("nome-profissional");
    const elementoConsultorio = document.getElementById("consultorio");

    if (elementoPaciente) elementoPaciente.innerText = dados.paciente;
    if (elementoProfissional) elementoProfissional.innerText = dados.profissional;
    if (elementoConsultorio) elementoConsultorio.innerText = dados.consultorio;

    // 2. Efeito de piscar a tela
    // Procure pela div principal ou use o corpo da página (body)
    const container = document.querySelector(".painel-container") || document.body;
    
    container.classList.add("piscar-tela");

    // 3. Toca o alerta sonoro (opcional)
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audio.play().catch(e => console.log("Erro ao tocar som, aguardando interação do usuário."));

    // 4. Remove o efeito de piscar após 5 segundos
    setTimeout(() => {
        container.classList.remove("piscar-tela");
    }, 5000);
});