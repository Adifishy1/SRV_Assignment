/*!
 * PSE Landing Page — main.js
 * Dual-axis hero slider · Marquee pause · School card slider ·
 * Exhibition slider · Mobile nav · Form validation
 * WCAG 2.2 AA · prefers-reduced-motion respected
 */

(function () {
  "use strict";

  /* ============================================================
     UTILITY
  ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     HERO SLIDER — dual axis (horizontal pagination + vertical
     progress bar), auto-play, swipe, pause on hover, keyboard
  ============================================================ */
  function initHeroSlider() {
    const slider = $("#hero-slider");
    if (!slider) return;

    const slides = $$(".hero__slide", slider);
    const dots = $$(".hero__dot");
    const prevBtn = $("#hero-prev");
    const nextBtn = $("#hero-next");
    const pauseBtn = $("#hero-pause");
    const progressBar = $("#hero-progress");
    const iconPause = $(".icon-pause", pauseBtn);
    const iconPlay = $(".icon-play", pauseBtn);

    let current = 0;
    let paused = false;
    let timer = null;
    let progress = 0;
    let progTimer = null;
    const DURATION = 5000; // ms per slide
    const TICK = 50;

    function goTo(idx) {
      slides[current].classList.remove("hero__slide--active");
      slides[current].setAttribute("aria-hidden", "true");
      dots[current].classList.remove("hero__dot--active");
      dots[current].setAttribute("aria-selected", "false");

      current = (idx + slides.length) % slides.length;

      slides[current].classList.add("hero__slide--active");
      slides[current].setAttribute("aria-hidden", "false");
      dots[current].classList.add("hero__dot--active");
      dots[current].setAttribute("aria-selected", "true");

      slider.setAttribute(
        "aria-label",
        `Slide ${current + 1} of ${slides.length}`,
      );

      resetProgress();
    }

    function resetProgress() {
      progress = 0;
      if (progressBar) progressBar.style.height = "0%";
      clearInterval(progTimer);
      if (!paused && !prefersReducedMotion()) {
        progTimer = setInterval(() => {
          progress += (TICK / DURATION) * 100;
          if (progressBar)
            progressBar.style.height = Math.min(progress, 100) + "%";
        }, TICK);
      }
    }

    function startAutoplay() {
      clearInterval(timer);
      if (!paused && !prefersReducedMotion()) {
        timer = setInterval(() => goTo(current + 1), DURATION);
        resetProgress();
      }
    }

    function stopAutoplay() {
      clearInterval(timer);
      clearInterval(progTimer);
    }

    function togglePause() {
      paused = !paused;
      pauseBtn.setAttribute("aria-pressed", String(paused));
      if (paused) {
        stopAutoplay();
        iconPause.style.display = "none";
        iconPlay.style.display = "block";
      } else {
        iconPause.style.display = "block";
        iconPlay.style.display = "none";
        startAutoplay();
      }
    }

    // Controls
    prevBtn.addEventListener("click", () => {
      goTo(current - 1);
      startAutoplay();
    });
    nextBtn.addEventListener("click", () => {
      goTo(current + 1);
      startAutoplay();
    });
    pauseBtn.addEventListener("click", togglePause);

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        goTo(Number(dot.dataset.index));
        startAutoplay();
      });
    });

    // Pause on hover
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", () => {
      if (!paused) startAutoplay();
    });
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", () => {
      if (!paused) startAutoplay();
    });

    // Keyboard
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        goTo(current - 1);
        startAutoplay();
      }
      if (e.key === "ArrowRight") {
        goTo(current + 1);
        startAutoplay();
      }
    });

    // Touch/swipe
    let touchStartX = 0;
    let touchStartY = 0;
    slider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true },
    );
    slider.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx < 0) goTo(current + 1);
          else goTo(current - 1);
          startAutoplay();
        }
      },
      { passive: true },
    );

    // Init
    goTo(0);
    startAutoplay();
  }

  /* ============================================================
     SCHOOLS SLIDER — mobile swipe + pagination dots
  ============================================================ */
  function initSchoolsSlider() {
    const track = $("#schools-track");
    const dots = $$(".schools__dot");
    if (!track || !dots.length) return;

    function updateDots() {
      const cardWidth = track.firstElementChild.offsetWidth + 16; // gap
      const idx = Math.round(track.scrollLeft / cardWidth);
      dots.forEach((d, i) => {
        d.classList.toggle("schools__dot--active", i === idx);
        d.setAttribute("aria-selected", String(i === idx));
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const cardWidth = track.firstElementChild.offsetWidth + 16;
        track.scrollTo({
          left: Number(dot.dataset.index) * cardWidth,
          behavior: "smooth",
        });
      });
    });

    track.addEventListener("scroll", updateDots, { passive: true });
  }

  /* ============================================================
     EXHIBITION SLIDER — arrow nav + dots
  ============================================================ */
  function initExhibitionSlider() {
    const track = $("#exh-track");
    const prevBtn = $("#exh-prev");
    const nextBtn = $("#exh-next");
    const dots = $$(".exh-dot");
    if (!track) return;

    const CARDS_PER_VIEW = () =>
      window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;

    function scroll(dir) {
      const card = track.querySelector(".exh-card");
      if (!card) return;
      const cardW = card.offsetWidth + 20;
      track.scrollBy({
        left: dir * cardW * CARDS_PER_VIEW(),
        behavior: "smooth",
      });
    }

    function updateDots() {
      const totalScroll = track.scrollWidth - track.clientWidth;
      const dotCount = dots.length;
      const idx =
        dotCount <= 1
          ? 0
          : Math.round((track.scrollLeft / totalScroll) * (dotCount - 1));
      dots.forEach((d, i) => {
        d.classList.toggle("exh-dot--active", i === idx);
        d.setAttribute("aria-selected", String(i === idx));
      });
    }

    prevBtn.addEventListener("click", () => scroll(-1));
    nextBtn.addEventListener("click", () => scroll(1));
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        const totalScroll = track.scrollWidth - track.clientWidth;
        const frac = dots.length <= 1 ? 0 : i / (dots.length - 1);
        track.scrollTo({ left: frac * totalScroll, behavior: "smooth" });
      });
    });
    track.addEventListener("scroll", updateDots, { passive: true });

    // Auto-play exhibition slider (optional, gentle)
    if (!prefersReducedMotion()) {
      let exhTimer = setInterval(() => scroll(1), 4000);
      track.addEventListener("mouseenter", () => clearInterval(exhTimer));
      track.addEventListener("mouseleave", () => {
        exhTimer = setInterval(() => scroll(1), 4000);
      });
    }
  }

  /* ============================================================
     MOBILE NAV
  ============================================================ */
  function initMobileNav() {
    const hamburger = $(".hamburger");
    const mobileNav = $("#mobile-nav");
    if (!hamburger || !mobileNav) return;

    function toggle(open) {
      hamburger.setAttribute("aria-expanded", String(open));
      hamburger.classList.toggle("is-open", open);
      mobileNav.classList.toggle("is-open", open);
      mobileNav.setAttribute("aria-hidden", String(!open));
      if (open) {
        const firstLink = mobileNav.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    }

    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      toggle(!isOpen);
    });

    // Close on link click
    $$(".mobile-nav__link", mobileNav).forEach((link) => {
      link.addEventListener("click", () => toggle(false));
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        hamburger.getAttribute("aria-expanded") === "true"
      ) {
        toggle(false);
        hamburger.focus();
      }
    });
  }

  /* ============================================================
     SMOOTH SCROLL – close mobile nav on anchor click
  ============================================================ */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
        // Move focus to section for accessibility
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ============================================================
     STICKY HEADER shadow on scroll
  ============================================================ */
  function initStickyHeader() {
    const header = $(".site-header");
    if (!header) return;
    const ob = new IntersectionObserver(
      ([entry]) =>
        header.classList.toggle("site-header--scrolled", !entry.isIntersecting),
      { threshold: 0 },
    );
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    document.body.insertBefore(sentinel, document.body.firstChild);
    ob.observe(sentinel);
  }

  /* ============================================================
     FORM VALIDATION
  ============================================================ */
  function initForm() {
    const form = $(".cta-register__form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      const required = $$("[required]", form);
      required.forEach((field) => {
        const err = field.parentElement.querySelector(".form-error");
        if (err) err.remove();
        if (!field.value.trim()) {
          valid = false;
          const msg = document.createElement("span");
          msg.className = "form-error";
          msg.style.cssText =
            "color:#c0392b;font-size:0.78rem;margin-top:3px;display:block;";
          msg.setAttribute("role", "alert");
          msg.textContent = "This field is required.";
          field.parentElement.appendChild(msg);
          if (
            valid === false &&
            !form.querySelector(".form-error:first-of-type")
          )
            field.focus();
        }
      });
      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = "✓ You're Registered! Check your email.";
        btn.disabled = true;
        btn.style.background = "#2a7a4b";
      }
    });
  }

  /* ============================================================
     INTERSECTION OBSERVER – fade-in on scroll
  ============================================================ */
  function initScrollReveal() {
    if (prefersReducedMotion()) return;
    const style = document.createElement("style");
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .reveal.is-visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    const targets = $$(
      ".about__card, .school-card, .step, .highlight-card, .exh-card",
    );
    targets.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            ob.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    targets.forEach((el) => ob.observe(el));
  }

  /* ============================================================
     BOOT
  ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    initHeroSlider();
    initSchoolsSlider();
    initExhibitionSlider();
    initMobileNav();
    initSmoothScroll();
    initStickyHeader();
    initForm();
    initScrollReveal();
  });
})();
