/* ═══════════════════════════════════════════
   WEDDING INVITATION — MAIN SCRIPT
   ═══════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─── 1. FLOATING PETALS — Canvas ─── */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let petals = [];
const PETAL_COUNT = window.innerWidth < 480 ? 12 : window.innerWidth < 768 ? 18 : 32;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Petal {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : -20;
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 1 + 0.3;
    this.speedX = Math.random() * 0.8 - 0.4;
    this.rotation = Math.random() * 360;
    this.rotSpeed = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.4 + 0.15;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    const colors = [
      'rgba(72,201,176,', 'rgba(46,139,122,',
      'rgba(197,165,90,', 'rgba(255,255,255,',
      'rgba(232,213,163,', 'rgba(138,154,123,'
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 0.5;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;
    if (this.y > canvas.height + 20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color + '1)';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = this.color + '0.3)';
    ctx.beginPath();
    ctx.ellipse(-this.size * 0.2, -this.size * 0.1, this.size * 0.4, this.size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());
let petalPaused = false;
document.addEventListener('visibilitychange', () => { petalPaused = document.hidden; });
function animatePetals() {
  if (!petalPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
  }
  requestAnimationFrame(animatePetals);
}
animatePetals();

/* ─── 2. CONFETTI / BLAST SYSTEM ─── */
const confettiCanvas = document.getElementById('confettiCanvas');
const cctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

class ConfettiPiece {
  constructor(x, y) {
    this.x = x || Math.random() * confettiCanvas.width;
    this.y = y || -10;
    this.size = Math.random() * 8 + 3;
    this.speedY = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 8;
    this.gravity = 0.12;
    this.rotation = Math.random() * 360;
    this.rotSpeed = Math.random() * 10 - 5;
    this.opacity = 1;
    this.decay = Math.random() * 0.008 + 0.003;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    const colors = [
      '#48C9B0', '#2E8B7A', '#1B5E3B', '#C5A55A',
      '#E8D5A3', '#8A9A7B', '#FFFFFF', '#F5F0E8',
      '#FFD700', '#1B6B5A', '#A3D9CC', '#D4EDDA'
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX *= 0.99;
    this.rotation += this.rotSpeed;
    this.opacity -= this.decay;
    return this.opacity > 0 && this.y < confettiCanvas.height + 20;
  }
  draw() {
    cctx.save();
    cctx.translate(this.x, this.y);
    cctx.rotate((this.rotation * Math.PI) / 180);
    cctx.globalAlpha = this.opacity;
    cctx.fillStyle = this.color;
    if (this.shape === 'rect') {
      cctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    } else {
      cctx.beginPath();
      cctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      cctx.fill();
    }
    cctx.restore();
  }
}

function fireConfetti(x, y, count = 80) {
  for (let i = 0; i < count; i++) {
    const piece = new ConfettiPiece(x, y);
    piece.speedY = -(Math.random() * 12 + 4);
    piece.speedX = (Math.random() - 0.5) * 16;
    confettiPieces.push(piece);
  }
  if (!confettiActive) {
    confettiActive = true;
    animateConfetti();
  }
}

function fireConfettiRain(count = 120) {
  for (let i = 0; i < count; i++) {
    const piece = new ConfettiPiece();
    piece.y = -Math.random() * 200;
    piece.speedY = Math.random() * 2 + 1;
    piece.speedX = (Math.random() - 0.5) * 3;
    piece.decay = Math.random() * 0.003 + 0.001;
    confettiPieces.push(piece);
  }
  if (!confettiActive) {
    confettiActive = true;
    animateConfetti();
  }
}

function animateConfetti() {
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces = confettiPieces.filter(p => {
    const alive = p.update();
    if (alive) p.draw();
    return alive;
  });
  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiActive = false;
  }
}

/* ─── 3. BLAST BUTTON ─── */
const blastBtn = document.getElementById('blastBtn');
blastBtn.addEventListener('click', () => {
  fireConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
  // Also fire from corners
  setTimeout(() => fireConfetti(0, 0, 40), 200);
  setTimeout(() => fireConfetti(window.innerWidth, 0, 40), 400);
});

/* ─── 4. BACKGROUND MUSIC ─── */
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
let musicPlaying = false;
musicBtn.classList.add('paused');

function startMusic() {
  bgMusic.volume = 0.4;
  bgMusic.play().then(() => {
    musicPlaying = true;
    musicBtn.classList.remove('paused');
    musicBtn.setAttribute('aria-pressed', 'true');
  }).catch(() => {
    musicPlaying = false;
    musicBtn.classList.add('paused');
    musicBtn.setAttribute('aria-pressed', 'false');
  });
}

function stopMusic() {
  bgMusic.pause();
  musicPlaying = false;
  musicBtn.classList.add('paused');
  musicBtn.setAttribute('aria-pressed', 'false');
}

musicBtn.addEventListener('click', () => {
  if (musicPlaying) { stopMusic(); } else { startMusic(); }
});

/* ─── 5. ENVELOPE OPENING ─── */
const envelopeScreen = document.getElementById('envelope');
const envelopeFlap = document.getElementById('envelopeFlap');
const openBtn = document.getElementById('openEnvelope');
const invitation = document.getElementById('invitation');

openBtn.addEventListener('click', () => {
  // Start music on user interaction
  startMusic();
  // Fire confetti blast on envelope open!
  fireConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);
  setTimeout(() => fireConfettiRain(80), 500);
  // Flap animation
  envelopeFlap.classList.add('open');
  setTimeout(() => {
    envelopeScreen.classList.add('opening');
    setTimeout(() => {
      envelopeScreen.style.display = 'none';
      invitation.classList.remove('hidden');
      // Show blast button
      blastBtn.classList.remove('hidden');
      initScrollAnimations();
      animateHeroEntrance();
    }, 800);
  }, 600);
});

/* ─── 6. HERO ENTRANCE ─── */
/* ─── FONT ANIMATION SYSTEM — letter by letter ─── */
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function splitTextToChars(element) {
  if (element.dataset.split === '1') {
    return element.querySelectorAll('.char');
  }
  // Walk child nodes so we preserve <br> line breaks (e.g. .hero-invite)
  const fragments = [];
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      fragments.push({ type: 'text', value: node.textContent });
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
      fragments.push({ type: 'br' });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      fragments.push({ type: 'text', value: node.textContent });
    }
  });
  element.innerHTML = '';
  fragments.forEach(frag => {
    if (frag.type === 'br') {
      element.appendChild(document.createElement('br'));
      return;
    }
    const words = frag.value.split(/(\s+)/);
    words.forEach(word => {
      if (word === '') return;
      if (/^\s+$/.test(word)) {
        element.appendChild(document.createTextNode(' '));
        return;
      }
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('word');
      word.split('').forEach(ch => {
        const span = document.createElement('span');
        span.classList.add('char');
        span.textContent = ch;
        wordSpan.appendChild(span);
      });
      element.appendChild(wordSpan);
    });
  });
  element.dataset.split = '1';
  return element.querySelectorAll('.char');
}

function animateFontElement(el, options = {}) {
  const chars = splitTextToChars(el);
  if (PREFERS_REDUCED_MOTION) {
    gsap.set(chars, { opacity: 1, y: 0, scale: 1 });
    return;
  }
  const delay = options.delay || 0;
  const stagger = options.stagger || (IS_MOBILE ? 0.025 : 0.04);
  // NOTE: filter: blur() per-character is very GPU-expensive on mobile and
  // causes the stuttering you saw in the hero. Drop it on mobile and skip
  // the trailing text-shadow yoyo entirely (it triggers a second pass over
  // every char). Use simple transforms which the browser can composite.
  gsap.fromTo(chars,
    { opacity: 0, y: IS_MOBILE ? 10 : 15, scale: IS_MOBILE ? 0.96 : 0.9 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: IS_MOBILE ? 0.4 : 0.5,
      stagger: stagger,
      delay: delay,
      ease: 'power2.out',
      force3D: true,
      onComplete: () => {
        gsap.set(chars, { clearProps: 'transform,willChange' });
      }
    }
  );
}

function animateHeroEntrance() {
  if (PREFERS_REDUCED_MOTION) {
    document.querySelectorAll('.hero-content .reveal-up, .hero-content .font-animate')
      .forEach(el => gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 }));
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', force3D: true } });
  // Lighter bg zoom on mobile (smaller image area = less work)
  tl.from('.hero-bg-img', { scale: IS_MOBILE ? 1.15 : 1.3, duration: IS_MOBILE ? 1.4 : 2 })
    .add(() => {
      const label = document.querySelector('.hero-label.font-animate');
      if (label) animateFontElement(label, { delay: 0, stagger: IS_MOBILE ? 0.03 : 0.05 });
    }, '-=1.2')
    // The per-char split handles the entrance — no separate y:50 slide that
    // fights with it. This was the main source of perceived "stuck" jumps.
    .add(() => {
      const firstName = document.querySelector('.hero-name-first.font-animate');
      if (firstName) animateFontElement(firstName, { delay: 0, stagger: IS_MOBILE ? 0.04 : 0.06 });
    }, '-=0.8')
    .from('.hero-amp', { scale: 0, opacity: 0, duration: 0.5 }, '-=0.3')
    .add(() => {
      const lastName = document.querySelector('.hero-name-last.font-animate');
      if (lastName) animateFontElement(lastName, { delay: 0, stagger: IS_MOBILE ? 0.04 : 0.06 });
    }, '-=0.3')
    .add(() => {
      const honor = document.querySelector('.hero-honor.font-animate');
      if (honor) animateFontElement(honor, { delay: 0.1, stagger: 0.04 });
    }, '+=0.1')
    .from('.hero-divider-line', { scaleX: 0, opacity: 0, duration: 0.6 }, '-=0.2')
    .add(() => {
      const invite = document.querySelector('.hero-invite.font-animate');
      if (invite) animateFontElement(invite, { delay: 0, stagger: 0.02 });
    }, '-=0.2')
    .add(() => {
      const date = document.querySelector('.hero-date.font-animate');
      if (date) animateFontElement(date, { delay: 0, stagger: 0.03 });
    }, '-=0.2')
    .from('.hero-venue', { y: 15, opacity: 0, duration: 0.6 }, '-=0.2')
    .from('.scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.1');
}

/* ─── 7. CORNER FLOWER ANIMATIONS ─── */
function animateCornerFlowers() {
  // Entrance animation for corner flowers
  gsap.from('.corner-flower-tl', { x: -100, y: -100, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.5 });
  gsap.from('.corner-flower-br', { x: 100, y: 100, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.8 });
  // Gentle breathing animation
  gsap.to('.corner-flower-tl img', {
    scale: 1.05, rotation: 2, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1
  });
  gsap.to('.corner-flower-br img', {
    scale: 1.05, rotation: -2, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1
  });
}
animateCornerFlowers();

/* ─── 8. SCROLL-TRIGGERED ANIMATIONS ─── */
function initScrollAnimations() {
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });
  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.to(el, {
      x: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
      x: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });
  gsap.utils.toArray('.reveal-scale').forEach((el, i) => {
    gsap.to(el, {
      scale: 1, opacity: 1, duration: 0.8, delay: i * 0.08, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' }
    });
  });
  // Font animations for section titles
  gsap.utils.toArray('.font-animate:not(.hero-label):not(.hero-name-first):not(.hero-name-last):not(.hero-honor)').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => animateFontElement(el, { delay: 0.1, stagger: 0.035 })
    });
  });
  // Parallax
  gsap.to('.hero-parallax-bg', {
    yPercent: 30, ease: 'none',
    scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.details-bg-img', {
    yPercent: 20, ease: 'none',
    scrollTrigger: { trigger: '.details-section', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  // Timeline line grows
  gsap.from('.timeline-line', {
    scaleY: 0, transformOrigin: 'top center',
    scrollTrigger: { trigger: '.story-timeline', start: 'top 80%', end: 'bottom 60%', scrub: true }
  });
  gsap.utils.toArray('.timeline-dot').forEach(dot => {
    gsap.fromTo(dot, { scale: 0 }, {
      scale: 1, duration: 0.5, ease: 'back.out(3)',
      scrollTrigger: { trigger: dot, start: 'top 90%' }
    });
  });
  // Countdown & glass cards stagger
  gsap.from('.countdown-card', {
    y: 50, opacity: 0, scale: 0.8, stagger: 0.12, duration: 0.8, ease: 'back.out(1.5)',
    scrollTrigger: { trigger: '.countdown-grid', start: 'top 85%' }
  });
  gsap.from('.glass-card', {
    y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.details-grid', start: 'top 85%' }
  });
  // Corner flowers react to scroll — subtle scale pulse at each section
  gsap.utils.toArray('section').forEach(section => {
    ScrollTrigger.create({
      trigger: section, start: 'top 70%',
      onEnter: () => {
        gsap.to('.corner-flower', { scale: 1.08, duration: 0.3, yoyo: true, repeat: 1 });
      }
    });
  });
  // Fade scroll indicator
  gsap.to('.scroll-indicator', {
    opacity: 0,
    scrollTrigger: { trigger: '.hero-section', start: '20% top', end: '40% top', scrub: true }
  });
}

/* ─── 9. COUNTDOWN TIMER ─── */
const weddingDate = new Date('2026-06-11T08:00:00');

function setCountdownText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    setCountdownText('cdDays', '🎉');
    setCountdownText('cdHours', '🥂');
    setCountdownText('cdMinutes', '💒');
    setCountdownText('cdSeconds', '💕');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  setCountdownText('cdDays', days.toString().padStart(3, '0'));
  setCountdownText('cdHours', hours.toString().padStart(2, '0'));
  setCountdownText('cdMinutes', minutes.toString().padStart(2, '0'));
  setCountdownText('cdSeconds', seconds.toString().padStart(2, '0'));
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ─── 10. RSVP FORM ─── */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('rsvpSubmit');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    rsvpForm.classList.add('hidden');
    rsvpSuccess.classList.remove('hidden');
    gsap.from(rsvpSuccess, { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.5)' });
    // Celebration blast!
    fireConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
    fireConfettiRain(60);
    // Petal burst
    for (let i = 0; i < 20; i++) {
      const p = new Petal();
      p.x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
      p.y = window.innerHeight / 2;
      p.speedY = -(Math.random() * 3 + 1);
      p.speedX = (Math.random() - 0.5) * 4;
      p.opacity = 0.6;
      petals.push(p);
    }
  }, 1200);
});

/* ─── 11. BACK TO TOP ───
   Use GSAP's ScrollToPlugin — it's the canonical way to animate scroll position
   when ScrollTrigger (with scrub) is active on the page. Falls back to a plain
   instant scroll if GSAP isn't loaded for any reason. */
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const startY = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop
      || 0;
    if (startY <= 0) return;

    if (typeof gsap !== 'undefined' && gsap.to) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: 0, autoKill: false },
        ease: 'power2.inOut',
        overwrite: 'auto'
      });
    } else {
      window.scrollTo(0, 0);
    }
  });
}

/* ─── 12. SPARKLE TRAIL (desktop only) ─── */
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.88) {
      const sparkle = document.createElement('div');
      sparkle.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:6px;height:6px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(197,165,90,.8),transparent);z-index:10000;`;
      document.body.appendChild(sparkle);
      gsap.to(sparkle, {
        y: -30 + Math.random() * -20, x: (Math.random() - 0.5) * 40,
        opacity: 0, scale: 0, duration: 0.8, ease: 'power2.out',
        onComplete: () => sparkle.remove()
      });
    }
  });
}
