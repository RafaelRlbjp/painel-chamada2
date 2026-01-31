const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. GERENCIAR HISTÓRICO (CAPTURAR NOME + CONSULTÓRIO)
    const nomeAtual = document.getElementById("nome-paciente").innerText.trim();
    const consultorioAtual = document.getElementById("consultorio").innerText.trim(); // Captura o local atual
    const listaHistorico = document.getElementById("lista-historico");

    // Só adiciona se houver um nome real na tela
    if (nomeAtual !== "AGUARDANDO..." && nomeAtual !== "" && nomeAtual !== "---") {
        const novoItem = document.createElement("li");
        
        // Monta o HTML do histórico com Nome em destaque e Consultório logo abaixo
        novoItem.innerHTML = `
            <strong>${nomeAtual}</strong>
            <small>${consultorioAtual}</small>
        `;
        
        listaHistorico.prepend(novoItem);
        
        // Mantém apenas os 5 últimos
        while (listaHistorico.children.length > 5) {
            listaHistorico.lastChild.remove();
        }
    }

    // 2. ATUALIZAR A TELA COM O NOVO CHAMADO
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. EFEITO VISUAL (PISCAR)
    document.body.classList.remove("piscar-amarelo");
    void document.body.offsetWidth; 
    document.body.classList.add("piscar-amarelo");

    setTimeout(() => {
        document.body.classList.remove("piscar-amarelo");
    }, 15000);

    // 4. VOZ
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