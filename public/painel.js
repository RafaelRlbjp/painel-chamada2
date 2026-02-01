socket.on("novoChamado", dados => {
  // Se não houver último chamado (ex: servidor acabou de reiniciar), não faz nada
  if (!dados || !dados.ultimo || !dados.ultimo.nome) return;

  nome.innerText = dados.ultimo.nome;
  prof.innerText = dados.ultimo.profissional;
  cons.innerText = dados.ultimo.consultorio;

  hist.innerHTML = "";
  dados.historico.forEach(p => {
    if (p && p.nome) {
      const li = document.createElement("li");
      li.innerText = `${p.nome} - ${p.profissional}`;
      hist.appendChild(li);
    }
  });

  // Efeitos visuais e voz
  painel.classList.add("piscar-amarelo");
  tocarBip();
  chamarVoz(dados.ultimo.nome, dados.ultimo.profissional, dados.ultimo.consultorio);

  setTimeout(() => painel.classList.remove("piscar-amarelo"), 3500);
});