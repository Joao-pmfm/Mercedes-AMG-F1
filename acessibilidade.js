(function () {
    var CHAVE = "acessibilidadeMercedes";
    var NIVEIS = [100, 115, 130, 150];          // tamanhos da fonte em %
    var estado = { tema: "escuro", nivel: 0 };  // escuro é o padrão
  
    // Recupera a escolha salva
    try {
      var salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (salvo) {
        if (salvo.tema === "claro" || salvo.tema === "escuro") estado.tema = salvo.tema;
        if (salvo.nivel >= 0 && salvo.nivel < NIVEIS.length) estado.nivel = salvo.nivel;
      }
    } catch (e) {}
  
    var painel, botaoAbrir;
  
    function aplicar() {
      var raiz = document.documentElement;
      raiz.setAttribute("data-tema", estado.tema);
      raiz.style.fontSize = NIVEIS[estado.nivel] + "%";
  
      try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
      atualizarBotoes();
    }
  
    function atualizarBotoes() {
      if (!painel) return;
  
      painel.querySelector("#acess-escuro").setAttribute("aria-pressed", estado.tema === "escuro");
      painel.querySelector("#acess-claro").setAttribute("aria-pressed", estado.tema === "claro");
  
      painel.querySelector("#acess-menos").disabled = estado.nivel === 0;
      painel.querySelector("#acess-mais").disabled = estado.nivel === NIVEIS.length - 1;
      painel.querySelector("#acess-nivel").textContent = NIVEIS[estado.nivel] + "%";
    }
  
    function criarPainel() {
      botaoAbrir = document.createElement("button");
      botaoAbrir.type = "button";
      botaoAbrir.id = "acess-botao";
      botaoAbrir.setAttribute("aria-expanded", "false");
      botaoAbrir.setAttribute("aria-controls", "acess-painel");
      botaoAbrir.textContent = "♿ Acessibilidade";
  
      painel = document.createElement("div");
      painel.id = "acess-painel";
      painel.hidden = true;
      painel.setAttribute("role", "dialog");
      painel.setAttribute("aria-label", "Opções de acessibilidade");
      painel.innerHTML =
        '<h2>Acessibilidade</h2>' +
        '<div class="acess-grupo">' +
          '<p>Tamanho da fonte</p>' +
          '<div class="acess-linha">' +
            '<button type="button" id="acess-menos" aria-label="Diminuir fonte">A−</button>' +
            '<span id="acess-nivel" aria-live="polite">100%</span>' +
            '<button type="button" id="acess-mais" aria-label="Aumentar fonte">A+</button>' +
            '<button type="button" id="acess-reset">Padrão</button>' +
          '</div>' +
        '</div>' +
        '<div class="acess-grupo">' +
          '<p>Tema</p>' +
          '<div class="acess-linha">' +
            '<button type="button" id="acess-escuro" aria-pressed="true">🌙 Escuro</button>' +
            '<button type="button" id="acess-claro" aria-pressed="false">☀️ Claro</button>' +
          '</div>' +
        '</div>';
  
      document.body.appendChild(botaoAbrir);
      document.body.appendChild(painel);
  
      botaoAbrir.addEventListener("click", function () {
        var abrir = painel.hidden;
        painel.hidden = !abrir;
        botaoAbrir.setAttribute("aria-expanded", abrir);
        if (abrir) painel.querySelector("button").focus();
      });
  
      painel.querySelector("#acess-menos").addEventListener("click", function () {
        if (estado.nivel > 0) { estado.nivel--; aplicar(); }
      });
      painel.querySelector("#acess-mais").addEventListener("click", function () {
        if (estado.nivel < NIVEIS.length - 1) { estado.nivel++; aplicar(); }
      });
      painel.querySelector("#acess-reset").addEventListener("click", function () {
        estado.nivel = 0; aplicar();
      });
      painel.querySelector("#acess-escuro").addEventListener("click", function () {
        estado.tema = "escuro"; aplicar();
      });
      painel.querySelector("#acess-claro").addEventListener("click", function () {
        estado.tema = "claro"; aplicar();
      });
  
      // Esc fecha o painel
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !painel.hidden) {
          painel.hidden = true;
          botaoAbrir.setAttribute("aria-expanded", "false");
          botaoAbrir.focus();
        }
      });
  
      atualizarBotoes();
    }
  
    // Aplica tema e fonte já no carregamento (evita "piscar" de escuro para claro)
    aplicar();
  
    document.addEventListener("DOMContentLoaded", criarPainel);
  })();