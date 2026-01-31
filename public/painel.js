const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. Mover atual para o histórico antes de atualizar
    const nomeAtual = document.getElementById("nome-paciente").innerText;
    if (nomeAtual && nomeAtual !== "AGUARDANDO...") {
        const lista = document.getElementById("lista-historico");
        const novoItem = document.createElement("li");
        novoItem.innerText = nomeAtual;
        lista.prepend(novoItem);
        if (lista.children.length > 4) lista.lastChild.remove();
    }

    // 2. Atualizar tela com novo chamado
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. Alerta visual
    document.body.classList.add("piscar-amarelo");
    setTimeout(() => document.body.classList.remove("piscar-amarelo"), 12000);

    // 4. Áudio (Repetir 2x e PARAR)
    sintetizador.cancel();
    const frase = `Paciente, ${dados.paciente}. Comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        sintetizador.speak(msg);
    };

    falar(); // 1ª vez
    setTimeout(falar, 6000); // 2ª vez
});