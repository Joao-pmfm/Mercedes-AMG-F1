(function () {
  var raiz = document.getElementById("carrossel");
  if (!raiz) return;

  var trilho    = raiz.querySelector(".car-trilho");
  var slides    = raiz.querySelectorAll(".car-slide");
  var pontosBox = raiz.querySelector(".car-pontos");
  var btnPausa  = raiz.querySelector(".car-pausa");

  var INTERVALO = 6000;
  var atual = 0;
  var timer = null;

  var pausado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

 
  var pontos = [];
  slides.forEach(function (_, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Ir para a foto " + (i + 1));
    b.addEventListener("click", function () { ir(i); reiniciar(); });
    pontosBox.appendChild(b);
    pontos.push(b);
  });

  function ir(i) {
    atual = (i + slides.length) % slides.length;
    trilho.style.transform = "translateX(-" + (atual * 100) + "%)";

    slides.forEach(function (s, idx) {
      s.setAttribute("aria-hidden", idx !== atual);
    });
    pontos.forEach(function (p, idx) {
      if (idx === atual) p.setAttribute("aria-current", "true");
      else p.removeAttribute("aria-current");
    });
  }

  function parar() {
    clearInterval(timer);
    timer = null;
  }

  function iniciar() {
    parar();
    if (!pausado && slides.length > 1) {
      timer = setInterval(function () { ir(atual + 1); }, INTERVALO);
    }
  }

  function reiniciar() { iniciar(); }

  function atualizarBotaoPausa() {
    btnPausa.textContent = pausado ? "▶" : "⏸";
    btnPausa.setAttribute(
      "aria-label",
      pausado ? "Retomar troca automática" : "Pausar troca automática"
    );
  }

  // Setas
  raiz.querySelector(".car-anterior").addEventListener("click", function () {
    ir(atual - 1); reiniciar();
  });
  raiz.querySelector(".car-proximo").addEventListener("click", function () {
    ir(atual + 1); reiniciar();
  });

  // Pausar
  btnPausa.addEventListener("click", function () {
    pausado = !pausado;
    atualizarBotaoPausa();
    iniciar();
  });

  raiz.addEventListener("mouseenter", parar);
  raiz.addEventListener("mouseleave", iniciar);
  raiz.addEventListener("focusin", parar);
  raiz.addEventListener("focusout", iniciar);

  raiz.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft")  { ir(atual - 1); reiniciar(); }
    if (e.key === "ArrowRight") { ir(atual + 1); reiniciar(); }
  });

  // Arrastar com o dedo no celular
  var inicioX = null;
  raiz.addEventListener("touchstart", function (e) {
    inicioX = e.touches[0].clientX;
  }, { passive: true });

  raiz.addEventListener("touchend", function (e) {
    if (inicioX === null) return;
    var diferenca = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(diferenca) > 50) {
      ir(diferenca < 0 ? atual + 1 : atual - 1);
      reiniciar();
    }
    inicioX = null;
  }, { passive: true });

  atualizarBotaoPausa();
  ir(0);
  iniciar();
})();