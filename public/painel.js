const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. Move o que está na tela para o histórico antes de atualizar
    const nomeAnterior = document.getElementById("nome-paciente").innerText;
    if (nomeAnterior && nomeAnterior !== "Aguardando...") {
        const li = document.createElement("li");
        li.innerText = nomeAnterior;
        const lista = document.getElementById("lista-historico");
        lista.prepend(li);
        if (lista.children.length > 5) lista.lastChild.remove();
    }

    // 2. Atualiza a tela com o novo
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. Efeito de piscar Amarelo
    document.body.classList.add("piscar-amarelo");
    setTimeout(() => document.body.classList.remove("piscar-amarelo"), 8000);

    // 4. Chamada de Voz (Repete 2 vezes)
    sintetizador.cancel(); 
    const frase = `Paciente, ${dados.paciente}, comparecer ao ${dados.consultorio}`;
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        sintetizador.speak(msg);
    };

    falar(); // Primeira vez
    setTimeout(falar, 5000); // Segunda vez após 5 segundos
});