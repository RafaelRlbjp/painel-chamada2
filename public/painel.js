const socket = io();
const sintetizador = window.speechSynthesis;

socket.on("proxima-chamada", (dados) => {
    // 1. GERENCIAR HISTÓRICO
    // Captura o nome que está na tela antes de trocá-lo pelo novo
    const nomeAtual = document.getElementById("nome-paciente").innerText.trim();
    const listaHistorico = document.getElementById("lista-historico");

    // Só adiciona se houver um nome real e não for o texto inicial
    if (nomeAtual !== "AGUARDANDO..." && nomeAtual !== "" && nomeAtual !== "---") {
        const novoItem = document.createElement("li");
        novoItem.innerText = nomeAtual;
        
        // Insere no topo da lista (mais recente primeiro)
        listaHistorico.prepend(novoItem);
        
        // Garante que existam no máximo 5 itens
        while (listaHistorico.children.length > 5) {
            listaHistorico.lastChild.remove();
        }
    }

    // 2. ATUALIZAR A TELA COM OS NOVOS DADOS
    document.getElementById("nome-paciente").innerText = dados.paciente;
    document.getElementById("nome-profissional").innerText = dados.profissional;
    document.getElementById("consultorio").innerText = dados.consultorio;

    // 3. EFEITO VISUAL (PISCAR AMARELO)
    // Removemos e adicionamos a classe para garantir que a animação reinicie
    document.body.classList.remove("piscar-amarelo");
    void document.body.offsetWidth; // Truque para resetar animação CSS
    document.body.classList.add("piscar-amarelo");

    // O alerta dura 15 segundos
    setTimeout(() => {
        document.body.classList.remove("piscar-amarelo");
    }, 15000);

    // 4. SISTEMA DE VOZ (CHAMADA DUPLA)
    sintetizador.cancel(); // Para qualquer fala anterior
    
    const frase = `Paciente ${dados.paciente}, comparecer ao ${dados.consultorio} com ${dados.profissional}`;
    
    const falar = () => {
        const msg = new SpeechSynthesisUtterance(frase);
        msg.lang = 'pt-BR';
        msg.volume = 1; // Volume máximo
        msg.rate = 0.9;  // Velocidade levemente mais lenta para clareza
        sintetizador.speak(msg);
    };

    // Primeira chamada imediata
    falar();
    
    // Segunda chamada após 7,5 segundos
    setTimeout(falar, 7500);
});