const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. Gerenciar Histórico (Move o nome que já estava na tela para a lista abaixo)
    const nomeAnterior = document.getElementById("nome-paciente").innerText;
    if (nomeAnterior && nomeAnterior !== "Aguardando...") {
        const li = document.createElement("li");
        li.innerText = nomeAnterior;
        const lista = document.getElementById("lista-historico");
        lista.prepend(li);
        if (lista.children.length > 5) lista.lastChild.remove();
    }

    // 2. Atualizar a Tela com os novos dados
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. Efeito Visual: Piscar Amarelo (Duração de 14 segundos para cobrir as duas falas)
    document.body.classList.add("piscar-amarelo");
    setTimeout(() => {
        document.body.classList.remove("piscar-amarelo");
    }, 14000); 

    // 4. Lógica de Voz (Chamada Dupla com Nome do Profissional)
    sintetizador.cancel(); // Limpa chamadas anteriores
    
    // Frase personalizada incluindo o Profissional
    const frase = `Paciente, ${dados.paciente}, comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.rate = 0.85; // Velocidade ideal para clareza
        sintetizador.speak(msg);
    };

    // Primeira chamada imediata
    falar();

    // Segunda chamada após 6 segundos (tempo para a primeira frase terminar)
    setTimeout(() => {
        falar();
    }, 6500);
});