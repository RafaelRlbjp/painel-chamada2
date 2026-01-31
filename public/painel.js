const socket = io();

// Lista para armazenar o histórico (opcional, mas mantém o painel organizado)
let historicoChamadas = [];

socket.on("proxima-chamada", (dados) => {
    // 1. ATUALIZA OS TEXTOS NA TELA
    document.getElementById("nome-paciente").innerText = dados.paciente.toUpperCase();
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 2. REMOVIDO: alert(dados.paciente); <-- O pop-up foi apagado daqui

    // 3. ATIVA O PISCAR EM AMARELO
    document.body.classList.add("piscar-amarelo");

    // 4. LÓGICA DO HISTÓRICO (Para não bugar o PC)
    historicoChamadas.unshift(dados);
    if (historicoChamadas.length > 6) historicoChamadas.pop();
    atualizarInterfaceHistorico();

    // 5. REPRODUZ A VOZ
    const msg = new SpeechSynthesisUtterance(`Paciente, ${dados.paciente}. Comparecer ao, ${dados.consultorio}`);
    msg.lang = 'pt-BR';
    window.speechSynthesis.speak(msg);

    // 6. PARA DE PISCAR APÓS 8 SEGUNDOS
    setTimeout(() => {
        document.body.classList.remove("piscar-amarelo");
    }, 8000);
});

function atualizarInterfaceHistorico() {
    const lista = document.getElementById("lista-historico");
    if (!lista) return;
    lista.innerHTML = "";
    historicoChamadas.slice(1).forEach(item => {
        const div = document.createElement("div");
        div.className = "historico-item";
        div.innerHTML = `<strong>${item.paciente}</strong> <small>${item.consultorio}</small>`;
        lista.appendChild(div);
    });
}
