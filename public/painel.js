const socket = io();

const nomeElement = document.getElementById("nome-paciente");
const profElement = document.getElementById("nome-profissional");
const consElement = document.getElementById("consultorio");
const histElement = document.getElementById("lista-historico");
const bip = document.getElementById("bip");
const painel = document.getElementById("painel");

let primeiraCarga = true;

socket.on("novoChamado", (dados) => {
    if (!dados || !dados.ultimo) return;

    const { ultimo, historico } = dados;

    // Atualiza Textos
    nomeElement.innerText = ultimo.nome.toUpperCase();
    profElement.innerText = ultimo.profissional.toUpperCase();
    consElement.innerText = ultimo.consultorio.toUpperCase();

    // Atualiza Histórico
    histElement.innerHTML = "";
    historico.forEach(p => {
        const li = document.createElement("li");
        li.innerText = `${p.nome} - ${p.profissional}`;
        histElement.appendChild(li);
    });

    // Só aciona alarme se não for o carregamento inicial da página
    if (!primeiraCarga) {
        painel.classList.add("piscar-amarelo");
        tocarBip();
        // Chamada na ordem solicitada: Paciente, Consultório, Profissional
        chamarVozSincronizada(ultimo.nome, ultimo.consultorio, ultimo.profissional);
    } else {
        primeiraCarga = false;
    }
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

function chamarVozSincronizada(nome, local, prof) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Nova Ordem: Paciente -> Consultório -> Profissional
    const frase = `Paciente ${nome}. Dirigir-se ao ${local}. Com ${prof}`;
    
    const fala1 = new SpeechSynthesisUtterance(frase);
    const fala2 = new SpeechSynthesisUtterance(frase);

    [fala1, fala2].forEach(f => {
        f.lang = "pt-BR";
        f.rate = 0.9;
    });

    // Para de piscar apenas quando a última fala terminar
    fala2.onend = () => {
        painel.classList.remove("piscar-amarelo");
    };

    window.speechSynthesis.speak(fala1);
    window.speechSynthesis.speak(fala2);
}

// Desbloqueio obrigatório de áudio
document.addEventListener("click", () => {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
}, { once: true });