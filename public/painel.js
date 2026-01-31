const socket = io();
const sintetizador = window.speechSynthesis;

// Desbloqueio de som (obrigatório clicar na tela da TV uma vez)
document.body.addEventListener('click', () => {
    const wakeup = new SpeechSynthesisUtterance("");
    sintetizador.speak(wakeup);
}, { once: true });

socket.on("proxima-chamada", (dados) => {
    // 1. Atualizar a Interface
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 2. Efeito Visual (Pisca Amarelo)
    document.body.classList.remove("piscar-amarelo");
    void document.body.offsetWidth; 
    document.body.classList.add("piscar-amarelo");
    setTimeout(() => document.body.classList.remove("piscar-amarelo"), 15000);

    // 3. Lógica de Voz (Repetir apenas 2 vezes)
    sintetizador.cancel(); // Para qualquer fala anterior
    
    const frase = `Paciente, ${dados.paciente}. Comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        sintetizador.speak(msg);
    };

    falar(); // Primeira vez
    setTimeout(falar, 7000); // Segunda vez após 7 segundos (sem loop infinito)
});