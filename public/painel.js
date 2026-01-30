const socket = io();

socket.on("chamada", (dados) => {
    document.getElementById("nome-paciente").innerText = dados.paciente.toUpperCase();
    document.getElementById("consultorio").innerText = dados.consultorio;
    document.getElementById("nome-profissional").innerText = dados.profissional;

    document.body.classList.add("piscar-amarelo");

    const falar = (texto) => {
        return new Promise((resolve) => {
            const msg = new SpeechSynthesisUtterance(texto);
            msg.lang = 'pt-BR';
            msg.rate = 0.9;
            msg.onend = resolve; // Só resolve quando termina de falar
            window.speechSynthesis.speak(msg);
        });
    };

    async function executarChamada() {
        await falar(`Paciente, ${dados.paciente}`);
        await falar(`Paciente, ${dados.paciente}`);
        await falar(`Dirigir-se ao ${dados.consultorio} com ${dados.profissional}`);
        
        document.body.classList.remove("piscar-amarelo");
        // Avisa o servidor que terminou e pode vir o próximo
        socket.emit("proximoDaFila");
    }

    executarChamada();
});

socket.on("atualizarHistorico", (historico) => {
    const lista = document.getElementById("lista-historico");
    lista.innerHTML = historico.map((item, index) => 
        `<li class="${index === 0 ? 'atual' : ''}">
            <strong>${item.paciente}</strong> - ${item.consultorio}
        </li>`
    ).join("");
});