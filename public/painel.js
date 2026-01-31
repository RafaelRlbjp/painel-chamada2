const socket = io();
const sintetizador = window.speechSynthesis;

// Função para garantir que a voz está carregada (ajuda em TVs)
function carregarVozes() {
    sintetizador.getVoices();
}
carregarVozes();
if (sintetizador.onvoiceschanged !== undefined) {
    sintetizador.onvoiceschanged = carregarVozes;
}

socket.on("proxima-chamada", (dados) => {
    // 1. GERENCIAR HISTÓRICO
    const nomeAtual = document.getElementById("nome-paciente").innerText;
    if (nomeAtual && nomeAtual !== "Aguardando..." && nomeAtual !== "") {
        const lista = document.getElementById("lista-historico");
        const item = document.createElement("li");
        item.innerText = nomeAtual;
        lista.prepend(item);
        
        // Mantém apenas os últimos 5 no histórico para não poluir a tela
        if (lista.children.length > 5) {
            lista.lastChild.remove();
        }
    }

    // 2. ATUALIZAR INTERFACE (TV)
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. EFEITO VISUAL (PISCAR AMARELO)
    // Remove e reinicia a classe para garantir que a animação rode toda vez
    document.body.classList.remove("piscar-amarelo");
    void document.body.offsetWidth; // Truque para resetar animação CSS
    document.body.classList.add("piscar-amarelo");

    // Mantém piscando por 15 segundos (tempo das 2 chamadas)
    setTimeout(() => {
        document.body.classList.remove("piscar-amarelo");
    }, 15000);

    // 4. LÓGICA DE ÁUDIO (CHAMAR 2 VEZES)
    sintetizador.cancel(); // Para qualquer fala que esteja ocorrendo

    const frase = `Paciente, ${dados.paciente}, comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.rate = 0.8;    // Velocidade levemente reduzida para clareza na TV
        msg.pitch = 1;     // Tom de voz
        msg.volume = 1;    // Volume máximo do navegador
        
        sintetizador.speak(msg);
    };

    // Primeira chamada imediata
    falar();

    // Segunda chamada após 7.5 segundos
    setTimeout(() => {
        falar();
    }, 7500);
});

// Aviso no console para o técnico
console.log("Painel ativo. Lembre-se de CLICAR na tela para habilitar o som.");