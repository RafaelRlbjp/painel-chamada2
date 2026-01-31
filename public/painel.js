const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. Histórico
    const nomeAnterior = document.getElementById("nome-paciente").innerText;
    if (nomeAnterior && nomeAnterior !== "Aguardando..." && nomeAnterior !== "") {
        const li = document.createElement("li");
        li.innerText = nomeAnterior;
        const lista = document.getElementById("lista-historico");
        lista.prepend(li);
        if (lista.children.length > 5) lista.lastChild.remove();
    }

    // 2. Atualizar Tela
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. PISCAR AMARELO - Forçando a aplicação da classe
    document.body.classList.remove("piscar-amarelo"); // Limpa se houver uma trava
    void document.body.offsetWidth; // Truque para reiniciar a animação
    document.body.classList.add("piscar-amarelo");

    // Remove o pisca após 15 segundos
    setTimeout(() => {
        document.body.classList.remove("piscar-amarelo");
    }, 15000);

    // 4. VOZ DUPLA
    sintetizador.cancel();
    const frase = `Paciente, ${dados.paciente}, comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.rate = 0.9;
        sintetizador.speak(msg);
    };

    falar(); // 1ª vez
    setTimeout(falar, 7000); // 2ª vez
});