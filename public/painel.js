const socket = io();

const nomeElement = document.getElementById("nome-paciente");
const profElement = document.getElementById("nome-profissional");
const consElement = document.getElementById("consultorio");
const histElement = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let primeiraCarga = true;
let filaChamados = [];
let processandoFila = false;

socket.on("novoChamado", (dados) => {
    if (!dados || !dados.ultimo) return;

    // Se for a primeira carga, apenas mostra na tela sem alarde
    if (primeiraCarga) {
        atualizarInterface(dados);
        primeiraCarga = false;
        return;
    }

    // Adiciona o chamado na fila para evitar um atropelar o outro
    filaChamados.push(dados);
    
    if (!processandoFila) {
        executarFila();
    }
});

async function executarFila() {
    if (filaChamados.length === 0) {
        processandoFila = false;
        return;
    }

    processandoFila = true;
    const dados = filaChamados.shift();
    const { ultimo, historico } = dados;

    // 1. Atualiza a Interface
    atualizarInterface(dados);

    // 2. Inicia Alerta Visual e Sonoro
    painel.classList.add("piscar-amarelo");
    tocarBip();

    // 3. Chamada de Voz com garantia de término
    await chamarVozPromessa(ultimo.nome, ultimo.consultorio, ultimo.profissional);

    // 4. Finalização: Para de piscar e aguarda um pouco antes do próximo
    setTimeout(() => {
        painel.classList.remove("piscar-amarelo");
        setTimeout(() => {
            executarFila(); // Chama o próximo da fila, se houver
        }, 1500); 
    }, 1000);
}

function atualizarInterface(dados) {
    const { ultimo, historico } = dados;
    
    nomeElement.innerText = ultimo.nome.toUpperCase();
    profElement.innerText = ultimo.profissional.toUpperCase();
    consElement.innerText = ultimo.consultorio.toUpperCase();

    histElement.innerHTML = "";
    historico.forEach(p => {
        const li = document.createElement("li");
        li.innerText = `${p.nome} - ${p.profissional}`;
        histElement.appendChild(li);
    });
}

function tocarBip() {
    let i = 0;
    const t = setInterval(() => {
        bip.currentTime = 0;
        bip.play().catch(() => {});
        i++;
        if (i >= 4) clearInterval(t);
    }, 500);
}

// Transforma a fala em uma "Promessa" para o JS saber exatamente quando acabou
function chamarVozPromessa(nome, local, prof) {
    return new Promise((resolve) => {
        if (!window.speechSynthesis) return resolve();
        
        window.speechSynthesis.cancel();
        const frase = `Paciente ${nome}. Dirigir-se ao ${local}. Com ${prof}`;
        
        // Falamos apenas uma vez de forma clara, repetindo apenas se necessário
        const fala = new SpeechSynthesisUtterance(frase);
        fala.lang = "pt-BR";
        fala.rate = 0.9;

        fala.onend = () => resolve();
        fala.onerror = () => resolve(); // Garante que a fila não trave se der erro

        window.speechSynthesis.speak(fala);
    });
}

// Desbloqueio obrigatório (Clique uma vez na TV ao abrir a página)
document.addEventListener("click", () => {
    const msg = new SpeechSynthesisUtterance("Sistema de voz ativado");
    msg.volume = 0; // Silencioso, só para ativar o motor de voz
    window.speechSynthesis.speak(msg);
}, { once: true });