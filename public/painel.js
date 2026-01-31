const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. Histórico
    const nomeAnterior = document.getElementById("nome-paciente").innerText;
    if (nomeAnterior && nomeAnterior !== "Aguardando...") {
        const li = document.createElement("li");
        li.innerText = nomeAnterior;
        const lista = document.getElementById("lista-historico");
        lista.prepend(li);
        if (lista.children.length > 5) lista.lastChild.remove();
    }

    // 2. Atualiza Tela
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. PISCAR AMARELO (Duração de 15 segundos)
    document.body.classList.add("piscar-amarelo");
    setTimeout(() => {
        document.body.classList.remove("piscar-amarelo");
    }, 15000); 

    // 4. CHAMADA DE VOZ DUPLA
    sintetizador.cancel(); 
    const frase = `Paciente, ${dados.paciente}, comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.rate = 0.85; 
        sintetizador.speak(msg);
    };

    falar(); // Primeira vez imediata

    // Segunda vez após 7 segundos (tempo para a primeira frase longa terminar)
    setTimeout(() => {
        falar();
    }, 7500);
});