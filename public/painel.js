const socket = io();
const sintetizador = window.speechSynthesis;

// Desbloqueio de áudio (clique na TV uma vez ao carregar)
document.body.addEventListener('click', () => {
    sintetizador.speak(new SpeechSynthesisUtterance(""));
    console.log("Áudio desbloqueado");
}, { once: true });

socket.on("proxima-chamada", (dados) => {
    // Atualiza os textos na tela
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // Inicia animação visual
    document.body.classList.add("piscar-amarelo");
    setTimeout(() => document.body.classList.remove("piscar-amarelo"), 10000);

    // LÓGICA DE ÁUDIO (FALAR 2 VEZES E PARAR)
    sintetizador.cancel(); // Para qualquer fala anterior imediatamente
    
    const frase = `Paciente, ${dados.paciente}. Comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        sintetizador.speak(msg);
    };

    falar(); // Fala a 1ª vez
    setTimeout(falar, 6000); // Fala a 2ª vez após 6 segundos
});