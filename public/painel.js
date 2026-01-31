const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. GERENCIAR HISTÓRICO (CAPTURANDO NOME + LOCAL)
    const nomeAtual = document.getElementById("nome-paciente").innerText.trim();
    const localAtual = document.getElementById("consultorio").innerText.trim();
    const listaHistorico = document.getElementById("lista-historico");

    if (nomeAtual !== "AGUARDANDO..." && nomeAtual !== "" && nomeAtual !== "---") {
        const novoItem = document.createElement("li");
        // Adiciona Nome e Consultório no histórico
        novoItem.innerHTML = `<strong>${nomeAtual}</strong> <small>${localAtual}</small>`;
        
        listaHistorico.prepend(novoItem);
        
        while (listaHistorico.children.length > 5) {
            listaHistorico.lastChild.remove();
        }
    }

    // 2. ATUALIZAR A TELA
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. PISCAR E VOZ
    document.body.classList.remove("piscar-amarelo");
    void document.body.offsetWidth; 
    document.body.classList.add("piscar-amarelo");

    setTimeout(() => document.body.classList.remove("piscar-amarelo"), 15000);

    sintetizador.cancel();
    const frase = `Paciente ${dados.paciente}, comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.volume = 1;
        msg.rate = 0.9;
        sintetizador.speak(msg);
    };
    falar();
    setTimeout(falar, 7500);
});