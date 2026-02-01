const socket = io();

// Seleção de elementos do DOM
const nomeElement = document.getElementById("nome-paciente");
const profElement = document.getElementById("nome-profissional");
const consElement = document.getElementById("consultorio");
const histElement = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

// Evento disparado quando o servidor envia um novo chamado
socket.on("novoChamado", (dados) => {
    console.log("Dados recebidos do servidor:", dados);

    // Verifica se os dados são válidos
    if (!dados || !dados.ultimo) {
        console.log("Aguardando o primeiro chamado...");
        return;
    }

    const ultimo = dados.ultimo;

    // Atualiza os campos principais (com fallback para evitar undefined)
    nomeElement.innerText = (ultimo.nome || ultimo.paciente || "---").toUpperCase();
    profElement.innerText = (ultimo.profissional || "---").toUpperCase();
    consElement.innerText = (ultimo.consultorio || "---").toUpperCase();

    // Atualiza a lista do histórico
    histElement.innerHTML = "";
    if (dados.historico && dados.historico.length > 0) {
        dados.historico.forEach((item) => {
            const li = document.createElement("li");
            li.innerText = `${item.nome} - ${item.profissional}`;
            histElement.appendChild(li);
        });
    }

    // Aciona os efeitos visuais
    painel.classList.add("piscar-amarelo");
    
    // Tocar alerta sonoro
    tocarBip();
    
    // Chamar por voz sintetizada
    chamarVoz(ultimo.nome, ultimo.profissional, ultimo.consultorio);

    // Remove o efeito de piscar após 3.5 segundos
    setTimeout(() => {
        painel.classList.remove("piscar-amarelo");
    }, 3500);
});

/**
 * Função para tocar o bip 4 vezes
 */
function tocarBip() {
    let i = 0;
    const t = setInterval(() => {
        bip.currentTime = 0;
        bip.play().catch(e => console.log("Erro ao tocar áudio (clique na tela primeiro):", e));
        i++;
        if (i >= 4) clearInterval(t);
    }, 500);
}

/**
 * Função para chamada de voz sintetizada
 */
function chamarVoz(paciente, profissional, local) {
    if (!window.speechSynthesis) return;

    const texto = `Paciente ${paciente}, com ${profissional}, dirigir-se ao ${local}`;
    
    // Limpa chamadas pendentes para não acumular
    window.speechSynthesis.cancel();

    let v = 0;
    const repetir = setInterval(() => {
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = "pt-BR";
        msg.rate = 0.9; // Velocidade um pouco mais lenta para clareza
        window.speechSynthesis.speak(msg);

        v++;
        if (v >= 2) clearInterval(repetir);
    }, 3500);
}

// O navegador bloqueia sons automáticos. 
// O usuário PRECISA clicar uma vez na página para "liberar" o áudio.
document.body.addEventListener("click", () => {
    console.log("Áudio e Voz desbloqueados pelo usuário.");
    bip.play().catch(() => {});
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
}, { once: true });