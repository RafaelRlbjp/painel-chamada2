const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. Atualizar Tela
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 2. Iniciar Pisca
    document.body.classList.add("piscar-amarelo");
    setTimeout(() => document.body.classList.remove("piscar-amarelo"), 15000);

    // 3. Voz com Volume Máximo
    sintetizador.cancel();
    const frase = `Paciente ${dados.paciente}, comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.volume = 1; // Volume no talo
        msg.rate = 0.9;
        sintetizador.speak(msg);
    };

    falar(); // 1ª Vez
    setTimeout(falar, 7500); // 2ª Vez
});