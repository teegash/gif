(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const THEMES = {
    pirate: {
      id: "pirate",
      name: "Pirate Voyage",
      entryLabel: "Gift card opened from a hamper QR",
      companyName: "Noble Gift Co.",
      senderName: "Marcus",
      heroTitle: "Open a hamper link and step into a treasure-grade gift card.",
      heroLede:
        "The QR destination becomes the actual themed gift card: who it is from, where it came from, and the personal message inside a premium animated 3D webpage.",
      senderLabel: "Marcus in Dubai",
      receiverLabel: "Sarah in Nairobi",
      fromLine: "From Marcus in Dubai",
      toLine: "For Sarah in Nairobi",
      cardTitle: "A treasure has been sent",
      cardMessage:
        "Sarah, may this treasure remind you that you are deeply valued, thought about, and celebrated from Dubai all the way to Nairobi.",
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
      entryLabel: "Gift card opened from a hamper QR",
      companyName: "Noble Gift Co.",
      senderName: "Amina",
      heroTitle: "Open a hamper link and reveal a love note in motion.",
      heroLede:
        "The QR destination becomes a romantic themed card where the receiver opens a message, sees who sent it, and feels the reveal through hearts, balloons, and cinematic motion.",
      senderLabel: "Amina in Kigali",
      receiverLabel: "Daniel in Nairobi",
      fromLine: "From Amina in Kigali",
      toLine: "For Daniel in Nairobi",
      cardTitle: "A love note is waiting",
      cardMessage:
        "Daniel, every detail in this hamper was chosen to say what a simple card could never fully hold, that you are loved, seen, and celebrated.",
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
        "A romantic bloom reveal with heart confetti, balloons, soft depth, and a product rise designed to feel intimate.",
      revealMessage:
        "\"Every scroll brings this closer to you, until the whole feeling opens in your hands.\"",
      productName: "Rose Gold Gift Set",
      featureScene: "Heart arches, balloons, confetti ribbons, and bloom layering",
      featureMotion: "Soft drift, floating balloons, petal fall, and glow-driven reveal",
      route: ["Kigali Garden", "Silk Airway", "Moonlight Canopy", "Nairobi Terrace"],
    },
    "mothers-day": {
      id: "mothers-day",
      name: "Mother's Day Glow",
      entryLabel: "Gift card opened from a hamper QR",
      companyName: "Noble Gift Co.",
      senderName: "Brian",
      heroTitle: "Open a hamper link and unfold a gratitude-filled gift card.",
      heroLede:
        "The QR destination becomes a themed appreciation card where the receiver sees who sent the hamper, where it came from, and a heartfelt message inside a rich animated page.",
      senderLabel: "Brian in Mombasa",
      receiverLabel: "Grace in Nairobi",
      fromLine: "From Brian in Mombasa",
      toLine: "For Grace in Nairobi",
      cardTitle: "A tribute has been prepared",
      cardMessage:
        "Grace, this hamper carries more than gifts, it carries gratitude for every quiet act of care, strength, and love that has shaped the people around you.",
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
        "A gratitude-first reveal with warm bloom, floral bursts, joyful particles, and a polished finish suitable for a premium Mother's Day campaign.",
      revealMessage:
        "\"For every quiet thing you've carried, this moment is designed to shine back at you.\"",
      productName: "Luxury Appreciation Hamper",
      featureScene: "Bouquets, framed memories, glowing joy orbs, and gift stacks",
      featureMotion: "Graceful drift, floral bursts, framed motion, and elegant product ascent",
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
    skyParticles: document.getElementById("sky-particles"),
    sparkRain: document.getElementById("spark-rain"),
    revealConfetti: document.getElementById("reveal-confetti"),
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

  function getParticleVariants(themeKey, bucket) {
    if (bucket === "sky") {
      if (themeKey === "valentine") return ["heart", "petal", "spark"];
      if (themeKey === "mothers-day") return ["petal", "spark", "coin"];
      return ["coin", "ember", "spark"];
    }

    if (themeKey === "valentine") return ["heart", "petal", "spark"];
    if (themeKey === "mothers-day") return ["petal", "spark", "coin"];
    return ["coin", "ember", "spark"];
  }

  function buildFallingPieces(container, className, count, options = {}) {
    if (!container) return;

    const {
      minSize = 4,
      maxSize = 12,
      minDuration = 8,
      maxDuration = 16,
      themeKey = activeTheme,
      bucket = "sky",
    } = options;
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();
    const variants = getParticleVariants(themeKey, bucket);
    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement("span");
      const width = gsap ? gsap.utils.random(minSize, maxSize, 1) : Math.round(minSize + Math.random() * (maxSize - minSize));
      const height = gsap ? gsap.utils.random(minSize * 1.4, maxSize * 2.2, 1) : Math.round(minSize * 1.4 + Math.random() * (maxSize * 2.2 - minSize * 1.4));
      const duration = gsap ? gsap.utils.random(minDuration, maxDuration, 0.1) : minDuration + Math.random() * (maxDuration - minDuration);
      const delay = -(Math.random() * maxDuration);
      const drift = `${Math.round((Math.random() - 0.5) * 180)}px`;
      const variant = variants[Math.floor(Math.random() * variants.length)];

      piece.className = `${className} ${className}--${variant}`;
      piece.style.left = `${Math.round(Math.random() * 100)}%`;
      piece.style.width = `${width}px`;
      piece.style.height = `${height}px`;
      piece.style.animationDuration = `${duration}s`;
      piece.style.animationDelay = `${delay}s`;
      piece.style.setProperty("--drift", drift);
      piece.style.opacity = String(0.3 + Math.random() * 0.5);
      fragment.appendChild(piece);
    }

    container.appendChild(fragment);
  }

  function buildAmbientParticles() {
    buildFallingPieces(dom.skyParticles, "sky-particle", 34, {
      minSize: 3,
      maxSize: 8,
      minDuration: 10,
      maxDuration: 18,
      bucket: "sky",
    });

    buildFallingPieces(dom.sparkRain, "spark-piece", 22, {
      minSize: 3,
      maxSize: 7,
      minDuration: 6,
      maxDuration: 10,
      bucket: "reveal",
    });
  }

  function buildRevealConfetti() {
    if (!dom.revealConfetti) return;
    dom.revealConfetti.innerHTML = "";

    const variants = getParticleVariants(activeTheme, "reveal");
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 42; index += 1) {
      const piece = document.createElement("span");
      const variant = variants[Math.floor(Math.random() * variants.length)];
      piece.className = `reveal-confetti-piece reveal-confetti-piece--${variant}`;
      fragment.appendChild(piece);
    }

    dom.revealConfetti.appendChild(fragment);
  }

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

    buildAmbientParticles();
    buildRevealConfetti();
    splitRevealText();
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }

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

  function initHeroEntrance() {
    if (!window.gsap || prefersReducedMotion) return;

    gsap.from(".hero__content > *", {
      y: 26,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out",
    });

    gsap.from(".gift-card--hero", {
      y: 38,
      opacity: 0,
      rotateX: -16,
      scale: 0.88,
      duration: 1.1,
      ease: "power3.out",
      delay: 0.14,
    });

    gsap.from(".hero-story, .hero-route, .hero-proof", {
      y: 34,
      opacity: 0,
      duration: 1.1,
      stagger: 0.09,
      ease: "power3.out",
      delay: 0.18,
    });
  }

  function initIdleTimelines() {
    if (!window.gsap || prefersReducedMotion) return;

    gsap.to(".ship-float", {
      y: -12,
      rotate: -2,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3,
    });

    gsap.to(".flag-wave", {
      rotate: 6,
      skewY: -8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "left center",
    });

    gsap.to(".captain-float", {
      y: -8,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".parrot-bob", {
      y: -4,
      rotate: 6,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "center bottom",
    });

    gsap.to(".bloom-float, .tribute-float", {
      y: -10,
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".gift-card--hero", {
      y: -10,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".gift-card--hero .gift-card__inner", {
      rotateY: 8,
      rotateX: -3,
      duration: 4.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "center center",
    });

    gsap.to(".gift-card--stage", {
      y: -8,
      duration: 4.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".balloon-bunch", {
      y: -14,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2,
    });

    gsap.to(".balloon", {
      rotate: 4,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.08,
      transformOrigin: "center bottom",
    });

    gsap.to(".love-ribbon", {
      x: 16,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".memory-frame", {
      y: -8,
      rotate: "+=4",
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.12,
      transformOrigin: "center center",
    });

    gsap.to(".joy-orb", {
      scale: 1.08,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.16,
      transformOrigin: "center center",
    });

    gsap.to(".coin-ring, .heart-orbit", {
      rotate: 360,
      duration: 18,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });

    gsap.to(".journey-portal", {
      scale: 1.08,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2,
    });

    gsap.to(".journey-cloud", {
      x: 28,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3,
    });

    gsap.to(".map-point", {
      y: -6,
      scale: 1.04,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.16,
    });

    gsap.to(".journey-streak", {
      x: 50,
      opacity: 0.18,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.08,
    });

    gsap.to(".flower-burst, .confetti-cluster", {
      rotate: 12,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "center center",
    });

    gsap.to(".journey-compass__needle", {
      rotate: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
      transformOrigin: "center 85%",
    });

    gsap.to(".hero-scene__sea--front", {
      xPercent: -2,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".hero-scene__sea--back", {
      xPercent: 2,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
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

      gsap.to(".gift-card--hero .gift-card__inner", {
        rotateY: gsap.utils.mapRange(0, window.innerWidth, -12, 12, event.clientX),
        rotateX: gsap.utils.mapRange(0, window.innerHeight, 8, -8, event.clientY),
        duration: 1,
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
    gsap.set(".gift-card--stage .gift-card__inner", { rotateY: 0, rotateX: 10 });
    gsap.set(".journey-portal, .journey-cloud, .journey-streaks, .stage-transition__veil, .stage-transition__pulse", { opacity: 0 });
    gsap.set(".reveal-flash, .reveal-beam, .reveal-shockwave", { opacity: 0 });

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
        ".stage-transition__veil",
        {
          opacity: 1,
          ease: "none",
        },
        0.12
      )
      .to(
        ".stage-transition__pulse",
        {
          opacity: 0.72,
          scale: 1.18,
          ease: "none",
        },
        0.14
      )
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
      .fromTo(
        ".journey-portal",
        { opacity: 0, scale: 0.68 },
        { opacity: 0.72, scale: 1, ease: "none" },
        0.18
      )
      .fromTo(
        ".journey-streaks",
        { opacity: 0 },
        { opacity: 0.92, ease: "none" },
        0.2
      )
      .fromTo(
        ".journey-cloud",
        { opacity: 0, yPercent: 20 },
        { opacity: 0.88, yPercent: 0, ease: "none" },
        0.22
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
        ".gift-card--stage .gift-card__inner",
        {
          rotateY: 90,
          rotateX: 4,
          ease: "none",
        },
        0.32
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
      .to(
        ".journey-portal, .journey-cloud, .journey-streaks",
        {
          opacity: 0,
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
        ".gift-card--stage .gift-card__inner",
        {
          rotateY: 180,
          rotateX: 0,
          ease: "none",
        },
        0.58
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
      )
      .to(
        ".stage-transition__veil",
        {
          opacity: 0,
          ease: "none",
        },
        0.78
      )
      .to(
        ".stage-transition__pulse",
        {
          opacity: 0,
          scale: 1.46,
          ease: "none",
        },
        0.8
      );

    gsap.to(".gift-card--stage", {
      scale: 0.88,
      opacity: 0.32,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#chapter-reveal",
        start: "top 62%",
        end: "top 28%",
        scrub: prefersReducedMotion ? false : 0.8,
      },
    });

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
      onEnter: triggerExplosiveReveal,
      onEnterBack: triggerExplosiveReveal,
    });
  }

  let revealAnimating = false;

  function triggerExplosiveReveal() {
    if (!window.gsap || revealAnimating) return;
    revealAnimating = true;

    buildRevealConfetti();
    animateBurst();

    const confetti = document.querySelectorAll(".reveal-confetti-piece");
    const flashTargets = [".reveal-flash", ".reveal-beam", ".reveal-shockwave"];

    gsap.killTweensOf(flashTargets);
    gsap.set(".reveal-flash", { opacity: 0 });
    gsap.set(".reveal-beam", { opacity: 0, scaleY: 0.7 });
    gsap.set(".reveal-shockwave", { opacity: 0, scale: 0.2 });
    gsap.set(confetti, { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.4 });

    const tl = gsap.timeline({
      onComplete: () => {
        revealAnimating = false;
      },
    });

    tl.to(".reveal-flash", { opacity: 0.95, duration: 0.16, ease: "power2.out" })
      .to(".reveal-flash", { opacity: 0, duration: 0.52, ease: "power2.out" }, ">-0.02")
      .to(".reveal-beam", { opacity: 0.85, scaleY: 1.16, duration: 0.45, stagger: 0.04, ease: "power3.out" }, 0.05)
      .to(".reveal-beam", { opacity: 0, duration: 0.8, ease: "power2.out" }, 0.46)
      .to(".reveal-shockwave--one", { opacity: 0.92, scale: 2.7, duration: 0.72, ease: "power2.out" }, 0.08)
      .to(".reveal-shockwave--one", { opacity: 0, duration: 0.42, ease: "power2.out" }, 0.46)
      .to(".reveal-shockwave--two", { opacity: 0.78, scale: 2.1, duration: 0.92, ease: "power2.out" }, 0.14)
      .to(".reveal-shockwave--two", { opacity: 0, duration: 0.52, ease: "power2.out" }, 0.58)
      .to(".gift-vault", { scale: 1.08, y: -12, duration: 0.42, yoyo: true, repeat: 1, ease: "power2.out" }, 0.04)
      .to(".gift-product", { scale: 1.12, y: -12, duration: 0.42, yoyo: true, repeat: 1, ease: "back.out(1.5)" }, 0.14);

    confetti.forEach((piece, index) => {
      const angle = (Math.PI * 2 * index) / confetti.length;
      const distance = 140 + Math.random() * 160;
      const lift = -60 - Math.random() * 180;

      tl.to(
        piece,
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * 60 + lift,
          rotate: gsap.utils.random(-260, 260),
          opacity: 1,
          scale: 1,
          duration: 0.28,
          ease: "power2.out",
        },
        0.06 + index * 0.004
      );
      tl.to(
        piece,
        {
          y: `+=${160 + Math.random() * 120}`,
          opacity: 0,
          duration: 1.2,
          ease: "power2.in",
        },
        0.42 + index * 0.004
      );
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
    buildAmbientParticles();
    buildBurstPieces();
    applyTheme(activeTheme, { initial: true });
    initLenis();
    initButtons();
    initHeroEntrance();
    initIdleTimelines();
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
