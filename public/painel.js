const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. Gerenciar Histórico (Antes de mudar o nome atual)
    const nomeAtual = document.getElementById("nome-paciente").innerText;
    if (nomeAtual && nomeAtual !== "Aguardando..." && nomeAtual !== "") {
        const lista = document.getElementById("lista-historico");
        const item = document.createElement("li");
        item.innerText = nomeAtual;
        lista.prepend(item);
        if (lista.children.length > 5) lista.lastChild.remove();
    }

    // 2. Atualizar a Tela
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. Alerta Amarelo (Duração de 15 segundos)
    document.body.classList.remove("piscar-amarelo");
    void document.body.offsetWidth; // Reinicia animação
    document.body.classList.add("piscar-amarelo");

    setTimeout(() => {
        document.body.classList.remove("piscar-amarelo");
    }, 15000);

    // 4. Chamada de Voz Dupla
    sintetizador.cancel(); 
    const frase = `Paciente, ${dados.paciente}, comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        sintetizador.speak(msg);
    };

    falar(); // 1ª Vez
    setTimeout(falar, 7500); // 2ª Vez após 7.5 segundos
});