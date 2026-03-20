(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const THEMES = {
    pirate: {
      id: "pirate",
      name: "Pirate Voyage",
      heroTitle: "Turn a gift reveal into a treasure-grade cinematic voyage.",
      heroLede:
        "A premium proof of concept with harbor light, scroll-led route drama, receiver anticipation, and a treasure-box reveal that feels made for sharing.",
      senderLabel: "Marcus in Dubai",
      receiverLabel: "Sarah in Nairobi",
      senderStageTitle: "The captain sets the promise",
      journeyStageTitle: "The treasure crosses impossible waters",
      receiverStageTitle: "A quiet cove waits for the signal",
      revealStageTitle: "The treasure rises in full light",
      chapter1Title: "Open inside the sender's harbor at golden hour.",
      chapter2Title: "Guide the treasure through storm lines and glowing routes.",
      chapter3Title: "Let the receiver feel the final seconds before impact.",
      chapter4Title: "Reveal the gift like a cinematic treasure unlock.",
      chapter1Hook: "A pirate-inspired opening with a harbor silhouette, captain energy, and the first promise of treasure.",
      chapter1Body:
        "The sender scene introduces character, location, and atmosphere immediately, replacing a flat QR destination with a dramatic first chapter.",
      chapter2Body:
        "The journey chapter uses pinned scroll, glowing route lines, and layered markers so distance becomes part of the story instead of dead space.",
      chapter3Body:
        "Receiver anticipation lands with warmer pacing, personalized story copy, and a beacon moment that makes the climax feel earned.",
      chapter4Body:
        "The reveal uses a treasure-lid motion, bloom-like glow, product rise, and burst particles to create a premium final beat.",
      storyMoment:
        "In a quiet Nairobi cove, Sarah watches the horizon glow as the last signal of Marcus's treasure cuts through the dusk.",
      revealHook:
        "A gold-finished treasure reveal with deep shadows, glow accents, and a product rise built for a final emotional hit.",
      revealMessage:
        "\"Your treasure has arrived, wrapped in story and carried across the sea just for you.\"",
      productName: "iPhone 15 Pro",
      featureScene: "Harbor fog, orbiting compasses, floating world cards",
      featureMotion: "Camera drift, route draw, beacon pulse, chest mechanics",
      route: ["Dubai Port", "Monsoon Rift", "Moonlit Current", "Nairobi Cove"],
    },
    valentine: {
      id: "valentine",
      name: "Valentine Bloom",
      heroTitle: "Make the reveal feel like a love story, not a landing page.",
      heroLede:
        "This direction softens the motion language into floating romance, luminous route beats, intimate pacing, and a reveal that feels written for one person.",
      senderLabel: "Amina in Kigali",
      receiverLabel: "Daniel in Nairobi",
      senderStageTitle: "The first note feels intimate",
      journeyStageTitle: "The gift drifts through a rose-lit path",
      receiverStageTitle: "Anticipation becomes tenderness",
      revealStageTitle: "The present blooms into view",
      chapter1Title: "Open in a romantic world with warmth and intention.",
      chapter2Title: "Use scroll to carry the gift through a soft cinematic bloom.",
      chapter3Title: "Pause in the receiver's world so the emotion can land.",
      chapter4Title: "Finish with a reveal that feels delicate, premium, and personal.",
      chapter1Hook: "A rose-lit opening frame with intimate copy, floating hearts, and elegant pacing.",
      chapter1Body:
        "The sender chapter becomes softer and closer, introducing the message through layered glow, petals, and refined motion rather than loud spectacle.",
      chapter2Body:
        "The journey becomes an emotional corridor, with route markers that feel more like memory beats than transit checkpoints.",
      chapter3Body:
        "Receiver anticipation slows down to make room for tenderness, names, and story fragments that feel custom-made.",
      chapter4Body:
        "The reveal shifts from explosive to blooming, using light, float, and glass-like depth for a luxury romantic finish.",
      storyMoment:
        "Daniel stands beneath a wash of evening rose light while Amina's message arrives like a final note in the air.",
      revealHook:
        "A romantic bloom reveal with soft depth, petal-like particles, and a product rise designed to feel intimate.",
      revealMessage:
        "\"Every scroll brings this closer to you, until the whole feeling opens in your hands.\"",
      productName: "Rose Gold Gift Set",
      featureScene: "Luminous bloom layers and floating heart geometry",
      featureMotion: "Soft drift, path shimmer, gentle reveal bloom",
      route: ["Kigali Garden", "Silk Airway", "Moonlight Canopy", "Nairobi Terrace"],
    },
    "mothers-day": {
      id: "mothers-day",
      name: "Mother's Day Glow",
      heroTitle: "Frame appreciation like a warm cinematic tribute.",
      heroLede:
        "This concept direction leans into gratitude, memory, and graceful pacing with a warmer palette and a reveal that feels celebratory instead of flashy.",
      senderLabel: "Brian in Mombasa",
      receiverLabel: "Grace in Nairobi",
      senderStageTitle: "The tribute begins with warmth",
      journeyStageTitle: "Memories and motion carry the gift forward",
      receiverStageTitle: "The moment of appreciation slows time",
      revealStageTitle: "The gift arrives with gratitude",
      chapter1Title: "Open in a world that feels warm, generous, and sincere.",
      chapter2Title: "Let the journey read like a memory-led progression.",
      chapter3Title: "Give the receiver space to feel honored before the reveal.",
      chapter4Title: "Reveal the gift with elegance, warmth, and light.",
      chapter1Hook: "A warm-toned opening with graceful atmosphere and a strong note of appreciation from the very first frame.",
      chapter1Body:
        "The sender world uses softer golds and memory-like ambient motion to make the experience feel heartfelt rather than purely dramatic.",
      chapter2Body:
        "The route section behaves like a timeline of care, letting the gift move through emotional beats instead of generic transit.",
      chapter3Body:
        "Receiver anticipation is anchored in gratitude and personal story, building a stronger emotional payoff at reveal.",
      chapter4Body:
        "The final beat pairs soft glow, refined depth, and a polished product rise so the whole experience feels premium and sincere.",
      storyMoment:
        "Grace watches warm light gather at the horizon as Brian's tribute reaches its final chapter in Nairobi.",
      revealHook:
        "A gratitude-first reveal with warm bloom, celebratory particles, and a polished finish suitable for a premium Mother's Day campaign.",
      revealMessage:
        "\"For every quiet thing you've carried, this moment is designed to shine back at you.\"",
      productName: "Luxury Appreciation Hamper",
      featureScene: "Warm light fields and memory-inspired layering",
      featureMotion: "Graceful drift, soft pulse, elegant product ascent",
      route: ["Mombasa Harbor", "Golden Passage", "Memory Current", "Nairobi Garden"],
    },
  };

  const chapterNames = {
    "#chapter-sender": "The Sender's World",
    "#chapter-journey": "The Journey Sequence",
    "#chapter-receiver": "The Receiver's World",
    "#chapter-reveal": "The Grand Reveal",
  };

  const dom = {
    body: document.body,
    activeThemeName: document.getElementById("activeThemeName"),
    activeChapterName: document.getElementById("activeChapterName"),
    senderWorld: document.querySelector(".sender-world"),
    journeyWorld: document.querySelector(".journey-world"),
    receiverWorld: document.querySelector(".receiver-world"),
    revealWorld: document.querySelector(".reveal-world"),
    themeButtons: Array.from(document.querySelectorAll("[data-theme-option]")),
    themeCards: Array.from(document.querySelectorAll("[data-theme-card]")),
    progressFill: document.querySelector(".progress-rail__fill"),
    revealTexts: Array.from(document.querySelectorAll(".reveal-text")),
    burst: document.getElementById("burst"),
    cursorGlow: document.querySelector(".cursor-glow"),
    fieldNodes: Array.from(document.querySelectorAll("[data-field]")),
    routeNodes: Array.from(document.querySelectorAll("[data-route-index]")),
  };

  let activeTheme = "pirate";
  let lenis = null;

  function splitRevealText() {
    dom.revealTexts.forEach((node) => {
      const text = node.textContent.trim();
      node.innerHTML = text
        .split(/\s+/)
        .map((word) => `<span class="word">${word}&nbsp;</span>`)
        .join("");
    });
  }

  function buildBurstPieces() {
    if (!dom.burst) return;

    const count = 28;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement("span");
      piece.className = "burst-piece";
      fragment.appendChild(piece);
    }

    dom.burst.appendChild(fragment);
  }

  function animateBurst() {
    const pieces = document.querySelectorAll(".burst-piece");
    if (!pieces.length || !window.gsap) return;

    gsap.killTweensOf(pieces);
    gsap.set(pieces, {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 0,
    });

    pieces.forEach((piece, index) => {
      const angle = (Math.PI * 2 * index) / pieces.length;
      const distance = 90 + Math.random() * 90;
      gsap.to(piece, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotate: gsap.utils.random(-180, 180),
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
        delay: index * 0.01,
      });
      gsap.to(piece, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.24 + index * 0.01,
      });
    });
  }

  function setThemeField(node, value) {
    if (!node) return;
    node.textContent = value;
  }

  function applyTheme(themeKey, options = {}) {
    const theme = THEMES[themeKey];
    if (!theme) return;

    const { initial = false } = options;
    const previousTheme = activeTheme;
    activeTheme = themeKey;
    dom.body.dataset.theme = theme.id;

    dom.fieldNodes.forEach((node) => {
      const key = node.dataset.field;
      if (key && theme[key]) {
        setThemeField(node, theme[key]);
      }
    });

    dom.routeNodes.forEach((node) => {
      const index = Number(node.dataset.routeIndex);
      if (!Number.isNaN(index) && theme.route[index]) {
        setThemeField(node, theme.route[index]);
      }
    });

    dom.activeThemeName.textContent = theme.name;

    dom.themeButtons.forEach((button) => {
      const isActive = button.dataset.themeOption === theme.id;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    dom.themeCards.forEach((card) => {
      card.classList.toggle("is-active", card.dataset.themeCard === theme.id);
    });

    splitRevealText();

    if (!initial && window.gsap && previousTheme !== themeKey) {
      const fields = [...dom.fieldNodes, ...dom.routeNodes, dom.activeThemeName];
      gsap.fromTo(
        fields,
        { opacity: 0.2, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.004,
          ease: "power2.out",
          overwrite: true,
        }
      );

      gsap.fromTo(
        [dom.senderWorld, dom.journeyWorld, dom.receiverWorld, dom.revealWorld],
        { filter: "blur(10px)", scale: 0.985 },
        {
          filter: "blur(0px)",
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          overwrite: true,
        }
      );
    }
  }

  function initCursorGlow() {
    if (prefersReducedMotion || !dom.cursorGlow || !window.gsap) return;

    window.addEventListener("pointermove", (event) => {
      gsap.to(dom.cursorGlow, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(".sender-world .world-card", {
        rotateY: gsap.utils.mapRange(0, window.innerWidth, -6, 6, event.clientX),
        rotateX: gsap.utils.mapRange(0, window.innerHeight, 5, -5, event.clientY),
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(".receiver-world .world-card", {
        x: gsap.utils.mapRange(0, window.innerWidth, -10, 10, event.clientX),
        y: gsap.utils.mapRange(0, window.innerHeight, -8, 8, event.clientY),
        duration: 1.1,
        ease: "power3.out",
      });
    });
  }

  function initLenis() {
    if (prefersReducedMotion || typeof window.Lenis !== "function" || !window.gsap || !window.ScrollTrigger) {
      return;
    }

    lenis = new window.Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      anchors: true,
    });

    lenis.on("scroll", window.ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(selector) {
    const target = document.querySelector(selector);
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2 });
      return;
    }

    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  }

  function initButtons() {
    dom.themeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyTheme(button.dataset.themeOption);
      });
    });

    document.querySelectorAll("[data-scroll-target]").forEach((button) => {
      button.addEventListener("click", () => {
        scrollToTarget(button.dataset.scrollTarget);
      });
    });

    const shareButton = document.querySelector("[data-share]");
    if (shareButton) {
      shareButton.addEventListener("click", async () => {
        const theme = THEMES[activeTheme];
        const title = `${theme.name} reveal concept`;
        const text = `Have a look at this cinematic gift reveal concept: ${theme.heroTitle}`;

        if (navigator.share) {
          try {
            await navigator.share({
              title,
              text,
              url: window.location.href,
            });
            return;
          } catch (error) {
            // Continue to clipboard fallback.
          }
        }

        try {
          await navigator.clipboard.writeText(window.location.href);
          shareButton.textContent = "Link Copied";
          window.setTimeout(() => {
            shareButton.textContent = "Share the Moment";
          }, 1600);
        } catch (error) {
          window.alert("Share is not available here, but the concept page is ready to present.");
        }
      });
    }
  }

  function initCounters() {
    if (!window.gsap || !window.ScrollTrigger) return;

    document.querySelectorAll("[data-counter]").forEach((node) => {
      const target = Number(node.dataset.counter);
      if (Number.isNaN(target)) return;

      ScrollTrigger.create({
        trigger: node,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: target,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              node.textContent = String(Math.round(counter.value));
            },
          });
        },
      });
    });
  }

  function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.set([dom.journeyWorld, dom.receiverWorld, dom.revealWorld], { opacity: 0 });
    gsap.set(".journey-path__base", { strokeDashoffset: 1200 });
    gsap.set(".gift-vault__lid", { rotateX: 0, transformOrigin: "center bottom", z: 0 });
    gsap.set(".gift-product", { y: 72, opacity: 0, scale: 0.76 });

    const stageTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience",
        start: "top top",
        end: "bottom bottom",
        scrub: prefersReducedMotion ? false : 1,
      },
    });

    stageTimeline
      .to(
        ".sender-world",
        {
          opacity: 0.12,
          scale: 0.8,
          yPercent: -18,
          z: -220,
          rotateY: 18,
          ease: "none",
        },
        0.18
      )
      .fromTo(
        ".journey-world",
        { opacity: 0, scale: 0.7, yPercent: 18, z: -260, rotateX: 32 },
        { opacity: 1, scale: 1, yPercent: 0, z: 0, rotateX: 0, ease: "none" },
        0.18
      )
      .to(
        ".journey-path__base",
        {
          strokeDashoffset: 0,
          ease: "none",
        },
        0.24
      )
      .to(
        ".traveler",
        {
          x: "68vw",
          y: "-26vh",
          ease: "none",
        },
        0.24
      )
      .to(
        ".journey-world",
        {
          opacity: 0.14,
          scale: 0.8,
          yPercent: -14,
          z: -200,
          ease: "none",
        },
        0.52
      )
      .fromTo(
        ".receiver-world",
        { opacity: 0, scale: 0.72, yPercent: 12, z: -220 },
        { opacity: 1, scale: 1, yPercent: 0, z: 0, ease: "none" },
        0.54
      )
      .to(
        ".receiver-world",
        {
          opacity: 0.18,
          scale: 0.82,
          yPercent: -18,
          z: -180,
          ease: "none",
        },
        0.78
      )
      .fromTo(
        ".reveal-world",
        { opacity: 0, scale: 0.7, yPercent: 18, z: -280 },
        { opacity: 1, scale: 1, yPercent: 0, z: 0, ease: "none" },
        0.78
      );

    gsap.to(".gift-vault__lid", {
      rotateX: -118,
      z: 120,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#chapter-reveal",
        start: "top 65%",
        end: "top 28%",
        scrub: prefersReducedMotion ? false : 0.9,
      },
    });

    gsap.to(".gift-product", {
      y: 0,
      opacity: 1,
      scale: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#chapter-reveal",
        start: "top 58%",
        end: "top 28%",
        scrub: prefersReducedMotion ? false : 0.8,
      },
    });

    ScrollTrigger.create({
      trigger: ".experience",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(dom.progressFill, { scaleX: self.progress });
      },
    });

    Object.keys(chapterNames).forEach((selector) => {
      ScrollTrigger.create({
        trigger: selector,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            dom.activeChapterName.textContent = chapterNames[selector];
          }
        },
      });
    });

    dom.revealTexts.forEach((node) => {
      ScrollTrigger.create({
        trigger: node,
        start: "top 78%",
        once: true,
        onEnter: () => {
          const words = node.querySelectorAll(".word");
          gsap.fromTo(
            words,
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.018,
              ease: "power3.out",
            }
          );
        },
      });
    });

    document.querySelectorAll(".feature-card, .route-card, .theme-card, .proof-card, .story-panel, .reveal-panel").forEach((node) => {
      ScrollTrigger.create({
        trigger: node,
        start: "top 86%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            node,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
          );
        },
      });
    });

    ScrollTrigger.create({
      trigger: "#chapter-reveal",
      start: "top 36%",
      once: true,
      onEnter: animateBurst,
    });
  }

  function initThemeCardHover() {
    if (!window.gsap || prefersReducedMotion) return;

    dom.themeCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -6, duration: 0.35, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, duration: 0.35, ease: "power2.out" });
      });
    });
  }

  function initThemeSelectionFromCards() {
    dom.themeCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("button")) return;
        applyTheme(card.dataset.themeCard);
      });
    });
  }

  function boot() {
    buildBurstPieces();
    applyTheme(activeTheme, { initial: true });
    initLenis();
    initButtons();
    initScrollAnimations();
    initCounters();
    initThemeCardHover();
    initThemeSelectionFromCards();
    initCursorGlow();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
