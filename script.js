// Carrusel funcional
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".carousel-container");
  if (!container) return;

  const carousel = container.querySelector("#carousel");
  const items = Array.from(carousel.querySelectorAll(".carousel-item"));
  const prevBtn = container.querySelector("#prevBtn");
  const nextBtn = container.querySelector("#nextBtn");
  const indicatorsContainer = container.querySelector("#indicators");

  let index = 0;
  const total = items.length;
  const intervalMs = 3000;
  let autoTimer = null;
  let isPaused = false;

  // Crea los indicadores (los pequeños puntos)
  function buildIndicators() {
    indicatorsContainer.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "indicator" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Ir a la imagen ${i + 1}`);
      dot.addEventListener("click", () => {
        goTo(i);
        resetAuto();
      });
      indicatorsContainer.appendChild(dot);
    }
  }

  // Actualiza la clase 'active' en la imagen y el indicador actual
  function updateActiveStates() {
    items.forEach((it, idx) => {
      it.classList.toggle("active", idx === index);
    });
    const dots = Array.from(indicatorsContainer.children);
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  // Mueve el carrusel con la propiedad translateX de CSS
  function render() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
    updateActiveStates();
  }

  function goTo(i) {
    index = ((i % total) + total) % total;
    render();
  }

  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  // Funciones para el carrusel automático
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      if (!isPaused) next();
    }, intervalMs);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  // Eventos para los botones de navegación
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      next();
      resetAuto();
    });
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prev();
      resetAuto();
    });

  // Pausa el carrusel con el mouse o el teclado
  container.addEventListener("mouseenter", () => {
    isPaused = true;
  });
  container.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  carousel.addEventListener("focusin", () => {
    isPaused = true;
  });
  carousel.addEventListener("focusout", () => {
    isPaused = false;
  });

  // Navegación con el teclado
  container.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prev();
      resetAuto();
    }
    if (e.key === "ArrowRight") {
      next();
      resetAuto();
    }
  });

  // Control de deslizamiento (swipe) para dispositivos móviles
  let touchStartX = 0;
  let touchDx = 0;
  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchDx = 0;
      isPaused = true;
      stopAuto();
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchmove",
    (e) => {
      touchDx = e.touches[0].clientX - touchStartX;
    },
    { passive: true }
  );

  carousel.addEventListener("touchend", () => {
    if (touchDx > 50) {
      prev();
    } else if (touchDx < -50) {
      next();
    }
    touchStartX = 0;
    touchDx = 0;
    isPaused = false;
    startAuto();
  });

  // Inicia el carrusel cuando la página se carga
  buildIndicators();
  goTo(0);
  startAuto();

  // Expone funciones para posibles pruebas en la consola del navegador
  container.carouselAPI = { goTo, next, prev, startAuto, stopAuto };
});