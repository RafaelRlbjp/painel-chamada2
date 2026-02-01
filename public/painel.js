const socket = io();

const nomeElement = document.getElementById("nome-paciente");
const profElement = document.getElementById("nome-profissional");
const consElement = document.getElementById("consultorio");
const histElement = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

socket.on("novoChamado", (dados) => {
    if (!dados || !dados.ultimo) return;

    const { ultimo, historico } = dados;

    // 1. Atualiza Interface
    nomeElement.innerText = ultimo.nome.toUpperCase();
    profElement.innerText = ultimo.profissional.toUpperCase();
    consElement.innerText = ultimo.consultorio.toUpperCase();

    // 2. Atualiza Histórico
    histElement.innerHTML = "";
    historico.forEach(p => {
        const li = document.createElement("li");
        li.innerText = `${p.nome} - ${p.profissional}`;
        histElement.appendChild(li);
    });

    // 3. Inicia Alerta Visual (Piscada)
    painel.classList.add("piscar-amarelo");

    // 4. Inicia Alerta Sonoro (Bip) e Voz
    tocarBip();
    chamarVozSincronizada(ultimo.nome, ultimo.profissional, ultimo.consultorio);
});

function tocarBip() {
    let i = 0;
    const t = setInterval(() => {
        bip.currentTime = 0;
        bip.play().catch(() => {});
        i++;
        if (i >= 4) clearInterval(t);
    }, 500);
}

function chamarVozSincronizada(nome, prof, local) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Para vozes anteriores

    const frase = `Paciente ${nome}, com ${prof}, dirigir-se ao ${local}`;
    
    // Criamos duas instâncias para repetir a frase
    const fala1 = new SpeechSynthesisUtterance(frase);
    const fala2 = new SpeechSynthesisUtterance(frase);

    [fala1, fala2].forEach(f => {
        f.lang = "pt-BR";
        f.rate = 0.9;
    });

    // O PULO DO GATO: Quando a ÚLTIMA fala terminar, removemos a classe CSS
    fala2.onend = () => {
        painel.classList.remove("piscar-amarelo");
    };

    window.speechSynthesis.speak(fala1);
    window.speechSynthesis.speak(fala2);
}

// Desbloqueio de áudio (obrigatório em navegadores modernos)
document.addEventListener("click", () => {
    bip.play().catch(() => {});
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
}, { once: true });