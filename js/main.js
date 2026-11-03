(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preloader = document.getElementById("preloader");
  const bar = document.getElementById("preloader-bar");
  const progress = document.getElementById("progress");
  const toggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const clock = document.getElementById("clock");

  function setClock() {
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date());
    clock.textContent = "PKT " + time;
  }

  setClock();
  setInterval(setClock, 30000);

  function finishIntro() {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    if (preloader) {
      preloader.classList.add("is-done");
      setTimeout(function () { preloader.remove(); }, 1000);
    }
  }

  if (reduced) {
    finishIntro();
  } else {
    document.body.classList.add("is-loading");
    let value = 0;
    const timer = setInterval(function () {
      value += Math.random() * 18 + 8;
      if (value >= 100) {
        value = 100;
        clearInterval(timer);
        if (bar) bar.style.width = "100%";
        setTimeout(finishIntro, 280);
      } else if (bar) {
        bar.style.width = value + "%";
      }
    }, 80);
  }

  function closeMenu() {
    mobileNav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", function () {
    const open = mobileNav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  });

  function onScroll() {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? scrolled / height : 0;
    if (progress) progress.style.transform = "scaleX(" + ratio + ")";
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (reduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".case, .job, .principles article, .skill-board div, .contact-card, .catalog__card").forEach(function (el) {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%"
      }
    });
  });

  gsap.utils.toArray(".case__media").forEach(function (media) {
    const word = media.querySelector(".poster__word");
    const layer = media.querySelector(".poster__layer--mid, .poster__sheet, .sun, .poster__arc");
    if (!word) return;
    gsap.to(word, {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: media,
        scrub: true,
        start: "top bottom",
        end: "bottom top"
      }
    });
    if (layer) {
      gsap.to(layer, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: media,
          scrub: true,
          start: "top bottom",
          end: "bottom top"
        }
      });
    }
  });
})();
