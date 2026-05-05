const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const contactForm = document.querySelector(".contact-form");
const progressAreas = document.querySelectorAll(".progress-area[data-progress]");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";

navLinks.forEach((link) => {
  const linkPage = link.getAttribute("href");

  if (linkPage === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const feedback = contactForm.querySelector(".form-feedback");

    if (feedback) {
      feedback.textContent = "Mensagem registrada para envio pelos canais oficiais.";
    }

    contactForm.reset();
  });
}

const animateProgress = (progressArea) => {
  const targetValue = Number(progressArea.dataset.progress) || 0;
  const safeValue = Math.max(0, Math.min(targetValue, 100));
  const bar = progressArea.querySelector(".progress-bar span");
  const value = progressArea.querySelector(".progress-value");
  const duration = 1400;
  const startTime = performance.now();

  if (!bar || !value) {
    return;
  }

  bar.style.width = `${safeValue}%`;

  const updateNumber = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const animatedValue = Math.round(safeValue * progress);

    value.textContent = `${animatedValue}%`;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  };

  requestAnimationFrame(updateNumber);
};

if (progressAreas.length) {
  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateProgress(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  progressAreas.forEach((progressArea) => {
    progressObserver.observe(progressArea);
  });
}
