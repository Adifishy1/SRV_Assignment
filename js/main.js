/* ═══════════════════════════════════════════════════════
   Premier Schools Exhibition – main.js
   Accessible sliders · Form validation · Marquee · Motion
   ═══════════════════════════════════════════════════════ */
"use strict";

(function () {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ─────────────────────────────────────────────────────
     UTILITY: debounce
  ───────────────────────────────────────────────────── */
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /* ─────────────────────────────────────────────────────
     FORM VALIDATION – Enquire Now
  ───────────────────────────────────────────────────── */
  const form = document.getElementById("enquireForm");
  const toast = document.getElementById("formToast");

  if (form) {
    const parentInput = document.getElementById("parentName");
    const phoneInput = document.getElementById("phoneNumber");
    const parentErr = document.getElementById("parentNameErr");
    const phoneErr = document.getElementById("phoneErr");

    function validateParent() {
      const v = parentInput.value.trim();
      if (!v) {
        parentErr.textContent = "Please enter your name.";
        parentInput.setAttribute("aria-invalid", "true");
        return false;
      }
      parentErr.textContent = "";
      parentInput.removeAttribute("aria-invalid");
      return true;
    }

    function validatePhone() {
      const v = phoneInput.value.trim().replace(/\s/g, "");
      if (!v) {
        phoneErr.textContent = "Please enter your phone number.";
        phoneInput.setAttribute("aria-invalid", "true");
        return false;
      }
      if (!/^[0-9]{10}$/.test(v)) {
        phoneErr.textContent = "Enter a valid 10-digit number.";
        phoneInput.setAttribute("aria-invalid", "true");
        return false;
      }
      phoneErr.textContent = "";
      phoneInput.removeAttribute("aria-invalid");
      return true;
    }

    parentInput.addEventListener("blur", validateParent);
    phoneInput.addEventListener("blur", validatePhone);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const ok = validateParent() & validatePhone();
      if (!ok) {
        const firstErr = form.querySelector('[aria-invalid="true"]');
        if (firstErr) firstErr.focus();
        return;
      }
      // Success
      form.reset();
      showToast();
    });
  }

  function showToast() {
    if (!toast) return;
    toast.hidden = false;
    setTimeout(() => {
      toast.hidden = true;
    }, 4000);
  }

  /* ─────────────────────────────────────────────────────
     HIGHLIGHTS SLIDER (Exhibition must-visit cards)
     Shows 4 cards on desktop, scrolls 1 at a time
  ───────────────────────────────────────────────────── */
  const hlTrack = document.getElementById("highlightsTrack");
  const hlPrev = document.getElementById("highlightsPrev");
  const hlNext = document.getElementById("highlightsNext");

  if (hlTrack && hlPrev && hlNext) {
    const hlCards = Array.from(
      hlTrack.querySelectorAll(".pse-highlights__card"),
    );
    let hlIndex = 0;
    let hlAuto;

    function getVisibleCount() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      if (window.innerWidth < 1200) return 3;
      return 4;
    }

    function updateHighlights() {
      const vis = getVisibleCount();
      const max = Math.max(0, hlCards.length - vis);
      hlIndex = Math.min(hlIndex, max);

      const cardW = hlCards[0].offsetWidth + 20; // gap = 20px
      hlTrack.style.transform = `translateX(-${hlIndex * cardW}px)`;
      hlTrack.style.transition = reducedMotion
        ? "none"
        : "transform 0.45s cubic-bezier(.4,0,.2,1)";

      hlPrev.disabled = hlIndex === 0;
      hlNext.disabled = hlIndex >= max;

      // Update aria-labels
      hlCards.forEach((c, i) => {
        const visible = i >= hlIndex && i < hlIndex + vis;
        c.setAttribute("aria-hidden", String(!visible));
      });
    }

    hlPrev.addEventListener("click", () => {
      hlIndex = Math.max(0, hlIndex - 1);
      updateHighlights();
      resetAuto();
    });
    hlNext.addEventListener("click", () => {
      const max = Math.max(0, hlCards.length - getVisibleCount());
      hlIndex = Math.min(hlIndex + 1, max);
      updateHighlights();
      resetAuto();
    });

    // Keyboard navigation
    hlTrack.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        hlPrev.click();
      }
      if (e.key === "ArrowRight") {
        hlNext.click();
      }
    });

    // Touch swipe
    let hlTouchX = null;
    hlTrack.addEventListener(
      "touchstart",
      (e) => {
        hlTouchX = e.touches[0].clientX;
      },
      { passive: true },
    );
    hlTrack.addEventListener(
      "touchend",
      (e) => {
        if (hlTouchX === null) return;
        const diff = hlTouchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? hlNext.click() : hlPrev.click();
        }
        hlTouchX = null;
      },
      { passive: true },
    );

    // Auto-play
    function startAuto() {
      if (reducedMotion) return;
      hlAuto = setInterval(() => {
        const max = Math.max(0, hlCards.length - getVisibleCount());
        if (hlIndex >= max) hlIndex = 0;
        else hlIndex++;
        updateHighlights();
      }, 4000);
    }
    function resetAuto() {
      clearInterval(hlAuto);
      startAuto();
    }

    // Pause on hover/focus
    const hlSection = document.querySelector(".pse-highlights__slider");
    if (hlSection) {
      hlSection.addEventListener("mouseenter", () => clearInterval(hlAuto));
      hlSection.addEventListener("focusin", () => clearInterval(hlAuto));
      hlSection.addEventListener("mouseleave", startAuto);
      hlSection.addEventListener("focusout", debounce(startAuto, 100));
    }

    window.addEventListener("resize", debounce(updateHighlights, 200));
    updateHighlights();
    startAuto();
  }

  /* ─────────────────────────────────────────────────────
     CHOOSE THE SCHOOL – mobile slider
  ───────────────────────────────────────────────────── */
  const chooseTrack = document.getElementById("chooseTrack");
  const chooseDots = document.getElementById("chooseDots");
  const choosePrev = document.getElementById("choosePrev");
  const chooseNext = document.getElementById("chooseNext");

  if (chooseTrack && chooseDots && choosePrev && chooseNext) {
    const cards = Array.from(chooseTrack.querySelectorAll(".pse-choose__card"));
    const dots = Array.from(chooseDots.querySelectorAll(".pse-choose__dot"));
    let idx = 0;

    function isMobile() {
      return window.innerWidth < 1024;
    }

    function showChooseMobileControls(show) {
      choosePrev.hidden = !show;
      chooseNext.hidden = !show;
      chooseDots.style.display = show ? "flex" : "none";
    }

    function updateChoose() {
      if (!isMobile()) {
        showChooseMobileControls(false);
        return;
      }
      showChooseMobileControls(true);

      const cardW = chooseTrack.parentElement.offsetWidth * 0.85 + 16;
      chooseTrack.scrollLeft = idx * cardW;

      dots.forEach((d, i) => {
        d.classList.toggle("pse-choose__dot--active", i === idx);
        d.setAttribute("aria-selected", String(i === idx));
      });
      choosePrev.disabled = idx === 0;
      chooseNext.disabled = idx === cards.length - 1;
    }

    choosePrev.addEventListener("click", () => {
      idx = Math.max(0, idx - 1);
      updateChoose();
    });
    chooseNext.addEventListener("click", () => {
      idx = Math.min(cards.length - 1, idx + 1);
      updateChoose();
    });
    dots.forEach((d, i) =>
      d.addEventListener("click", () => {
        idx = i;
        updateChoose();
      }),
    );

    // Touch swipe on track
    let cTouchX = null;
    chooseTrack.addEventListener(
      "touchstart",
      (e) => {
        cTouchX = e.touches[0].clientX;
      },
      { passive: true },
    );
    chooseTrack.addEventListener(
      "touchend",
      (e) => {
        if (cTouchX === null) return;
        const diff = cTouchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? chooseNext.click() : choosePrev.click();
        }
        cTouchX = null;
      },
      { passive: true },
    );

    // Sync dots on native scroll
    chooseTrack.addEventListener(
      "scroll",
      debounce(() => {
        if (!isMobile()) return;
        const cardW = chooseTrack.offsetWidth;
        idx = Math.round(chooseTrack.scrollLeft / cardW);
        dots.forEach((d, i) => {
          d.classList.toggle("pse-choose__dot--active", i === idx);
          d.setAttribute("aria-selected", String(i === idx));
        });
      }, 60),
      { passive: true },
    );

    window.addEventListener("resize", debounce(updateChoose, 200));
    updateChoose();
  }

  /* ─────────────────────────────────────────────────────
   MARQUEE – pause on hover AND focus inside
───────────────────────────────────────────────────── */
  document.querySelectorAll(".pse-schools__track-wrap").forEach((wrap) => {
    const tracks = wrap.querySelectorAll(".pse-schools__track");

    wrap.addEventListener("mouseenter", () => {
      tracks.forEach((t) => (t.style.animationPlayState = "paused"));
    });
    wrap.addEventListener("mouseleave", () => {
      tracks.forEach((t) => (t.style.animationPlayState = "running"));
    });
    wrap.addEventListener("focusin", () => {
      tracks.forEach((t) => (t.style.animationPlayState = "paused"));
    });
    wrap.addEventListener(
      "focusout",
      debounce(() => {
        tracks.forEach((t) => (t.style.animationPlayState = "running"));
      }, 100),
    );
  });

  /* ─────────────────────────────────────────────────────
     NAVBAR – shrink on scroll
  ───────────────────────────────────────────────────── */
  const navbar = document.querySelector(".pse-navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      debounce(() => {
        navbar.classList.toggle("pse-navbar--scrolled", window.scrollY > 40);
      }, 50),
      { passive: true },
    );
  }

  /* ─────────────────────────────────────────────────────
     SCROLL REVEAL – animate stats & cards on enter
  ───────────────────────────────────────────────────── */
  if (!reducedMotion && "IntersectionObserver" in window) {
    const revealEls = document.querySelectorAll(
      ".pse-stats__item, .pse-choose__card, .pse-highlights__card, .pse-footer__office",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
      observer.observe(el);
    });
  }
  /* ─────────────────────────────────────────────────────
   NAVBAR – transparent on load, solid on scroll
───────────────────────────────────────────────────── */
  const navbar = document.querySelector(".pse-navbar");
  if (navbar) {
    function updateNavbar() {
      if (window.scrollY > 40) {
        navbar.classList.add("pse-navbar--scrolled");
      } else {
        navbar.classList.remove("pse-navbar--scrolled");
      }
    }
    // Set correct state immediately on load
    updateNavbar();
    window.addEventListener("scroll", debounce(updateNavbar, 50), {
      passive: true,
    });
  }
})();
