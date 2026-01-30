const socket = io();
let somAtivado = false;

document.getElementById('ativarSom').onclick = () => {
    somAtivado = true;
    document.getElementById('ativarSom').style.backgroundColor = "#28a745";
    document.getElementById('ativarSom').innerText = "🔊 SOM ATIVADO";
    setTimeout(() => {
        document.getElementById('ativarSom').style.display = 'none';
    }, 1000);
};

socket.on("chamada", (dados) => {
    // Atualiza a tela com os dados vindos do chamar.js
    document.getElementById("nome").innerText = dados.paciente;
    document.getElementById("local").innerText = dados.local;
    document.getElementById("profissional").innerText = dados.profissional;

    if (somAtivado) {
        // 1. Toca um "Ding" de alerta
        const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3');
        audio.play();

        // 2. Fala o nome do paciente após 1 segundo
        setTimeout(() => {
            const mensagem = new SpeechSynthesisUtterance();
            mensagem.text = `Paciente, ${dados.paciente}. Comparecer ao, ${dados.local}`;
            mensagem.lang = 'pt-BR';
            mensagem.rate = 0.9; // Velocidade um pouco mais lenta
            window.speechSynthesis.speak(mensagem);
        }, 1200);
    }
});