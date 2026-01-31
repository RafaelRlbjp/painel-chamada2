const socket = io();

// Lista para armazenar o histórico de chamadas
let historicoChamadas = [];

// Escuta o evento 'proxima-chamada' enviado pelo servidor
socket.on("proxima-chamada", (dados) => {
    console.log("Recebendo chamada:", dados);

    // 1. ATUALIZAÇÃO DO PAINEL PRINCIPAL
    // Garante que o texto fique em caixa alta para melhor visibilidade
    document.getElementById("nome-paciente").innerText = dados.paciente.toUpperCase();
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 2. LÓGICA DO HISTÓRICO
    // Adiciona a nova chamada ao início do array
    historicoChamadas.unshift(dados);

    // Mantém apenas as últimas 5 chamadas no histórico (ajustável)
    if (historicoChamadas.length > 6) {
        historicoChamadas.pop();
    }

    atualizarInterfaceHistorico();

    // 3. EFEITOS VISUAIS E SONOROS
    dispararAlerta(dados);
});

// Função para renderizar a lista de últimos chamados
function atualizarInterfaceHistorico() {
    const containerHistorico = document.getElementById("lista-historico");
    if (!containerHistorico) return;

    containerHistorico.innerHTML = ""; // Limpa a lista atual

    // Pulamos o índice 0 porque ele já é o destaque principal na tela
    const chamadosAnteriores = historicoChamadas.slice(1);

    chamadosAnteriores.forEach(item => {
        const div = document.createElement("div");
        div.className = "historico-item";
        div.innerHTML = `<strong>${item.paciente}</strong> <br> <small>${item.consultorio}</small>`;
        containerHistorico.appendChild(div);
    });
}

// Função para voz e efeito de piscar
function dispararAlerta(dados) {
    // Efeito Visual: Faz o fundo ou container piscar
    document.body.classList.add("piscar-tela");
    
    // Voz: Síntese de fala do navegador
    const mensagemVoz = new SpeechSynthesisUtterance();
    mensagemVoz.text = `Paciente, ${dados.paciente}. Comparecer ao, ${dados.consultorio}`;
    mensagemVoz.lang = 'pt-BR';
    mensagemVoz.rate = 0.9; // Velocidade um pouco mais lenta para clareza

    window.speechSynthesis.speak(mensagemVoz);

    // Remove o efeito de piscar após 5 segundos
    setTimeout(() => {
        document.body.classList.remove("piscar-tela");
    }, 5000);
}
