const socket = io();

socket.on("proxima-chamada", (dados) => {
    // 1. ANTES de mudar o nome atual, pegamos o que estava na tela para o histórico
    const nomeAtual = document.getElementById("nome-paciente").innerText;
    const listaHistorico = document.getElementById("lista-historico");

    if (nomeAtual && nomeAtual !== "Aguardando..." && nomeAtual !== "undefined") {
        const item = document.createElement("li");
        item.innerText = nomeAtual;
        // Adiciona no topo da lista de histórico
        listaHistorico.prepend(item);
        
        // Limita o histórico aos últimos 5 para não encher a tela
        if (listaHistorico.children.length > 5) {
            listaHistorico.removeChild(listaHistorico.lastChild);
        }
    }

    // 2. ATUALIZA A TELA COM O NOVO CHAMADO
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. REMOVE O POP-UP (Não usamos alert()) e FAZ PISCAR
    document.body.classList.add("piscar-tela");
    setTimeout(() => document.body.classList.remove("piscar-tela"), 5000);

    // 4. SINCRO DE VOZ (Fala exatamente o que está na tela)
    const textoParaFalar = `Paciente, ${dados.paciente}, comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    const sintetizador = window.speechSynthesis;
    
    // Cancela falas anteriores para não encavalar
    sintetizador.cancel(); 
    
    const enunciado = new SpeechSynthesisUtterance(textoParaFalar);
    enunciado.lang = 'pt-BR';
    enunciado.rate = 0.9; // Velocidade um pouco mais lenta para clareza
    sintetizador.speak(enunciado);
});