const socket = io();
const sintetizador = window.speechSynthesis;

// FUNÇÃO PARA "ACORDAR" O SOM NA TV
document.body.addEventListener('click', () => {
    const wakeup = new SpeechSynthesisUtterance("Som ativado");
    wakeup.volume = 0; // Toca em silêncio só para liberar o navegador
    sintetizador.speak(wakeup);
    console.log("Áudio desbloqueado na TV");
}, { once: true });

socket.on("proxima-chamada", (dados) => {
    // ... (mantenha sua lógica de atualização de texto aqui)

    // LÓGICA DE VOZ REPETIDA 2X
    sintetizador.cancel();
    
    const frase = `Paciente, ${dados.paciente}. Comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const msg = new SpeechSynthesisUtterance(frase);
    msg.lang = 'pt-BR';
    msg.rate = 0.9;
    msg.volume = 1; // Volume máximo

    // Fala a primeira vez
    sintetizador.speak(msg);

    // Fala a segunda vez após um pequeno intervalo
    msg.onend = () => {
        setTimeout(() => {
            sintetizador.speak(msg);
        }, 1000);
    };
});