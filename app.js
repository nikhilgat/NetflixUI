/* ═══════════════════════════════════════════
   ALL IMAGES
═══════════════════════════════════════════ */
const ALL_IMAGES = Array.from({length: 46}, (_, i) => `images/${i + 1}.jpg`);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════
   SOUND TOGGLE
═══════════════════════════════════════════ */
function toggleSound() {
  const video = document.getElementById('heroVideo');
  const btn   = document.getElementById('playBtn');
  if (!video) return;
  video.muted = !video.muted;
  btn.textContent = video.muted ? '▶ Play' : '🔊 Mute';
}

/* ═══════════════════════════════════════════
   SWIPER
═══════════════════════════════════════════ */
let swipersInitialized = false;
function initSwipers() {
  if (swipersInitialized) return;
  swipersInitialized = true;
  const cfg = {
    spaceBetween: 12,
    breakpoints: {
      0:    { slidesPerView: 1.4 },
      640:  { slidesPerView: 2.3 },
      1024: { slidesPerView: 4.2 },
      1440: { slidesPerView: 5.2 }
    }
  };
  new Swiper('.mySwiper',  cfg);
  new Swiper('.mySwiper2', cfg);
}

/* ═══════════════════════════════════════════
   ANIMATED CARD SLIDESHOW
═══════════════════════════════════════════ */
function initCardSlideshow() {
  document.querySelectorAll('.card[data-slot]').forEach((card, cardIndex) => {
    const wrap  = card.querySelector('.card-img-wrap');
    if (!wrap) return;
    const front = wrap.querySelector('.slide-front');
    const back  = wrap.querySelector('.slide-back');
    if (!front || !back) return;

    let currentIdx = (cardIndex * 5) % ALL_IMAGES.length;
    front.src = ALL_IMAGES[currentIdx];
    back.src  = ALL_IMAGES[(currentIdx + 1) % ALL_IMAGES.length];

    const INTERVAL  = 3500 + cardIndex * 600;
    const FADE_TIME = 1300;

    setTimeout(() => {
      setInterval(() => {
        currentIdx = (currentIdx + 1) % ALL_IMAGES.length;
        wrap.classList.add('fading');
        setTimeout(() => {
          wrap.classList.remove('fading');
          front.src = ALL_IMAGES[currentIdx];
          back.src  = ALL_IMAGES[(currentIdx + 1) % ALL_IMAGES.length];
        }, FADE_TIME);
      }, INTERVAL);
    }, cardIndex * 700);
  });
}

/* ═══════════════════════════════════════════
   ENTER SITE
═══════════════════════════════════════════ */
function enterSite() {
  const profileScreen = document.getElementById('profileScreen');
  const mainSite      = document.getElementById('mainSite');

  profileScreen.style.opacity       = '0';
  profileScreen.style.pointerEvents = 'none';

  setTimeout(() => {
    profileScreen.style.display = 'none';
    mainSite.style.display      = 'block';

    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
      heroVideo.muted = true;
      heroVideo.loop  = true;
      heroVideo.src   = 'https://drive.google.com/uc?export=download&id=14rGLTd0C6UQANzaKSPnS65cschoK9nS8';
      heroVideo.load();
      heroVideo.play().catch(() => heroVideo.setAttribute('controls', ''));
    }

    initSwipers();

    requestAnimationFrame(() => {
      observeScrollElements();
      initCardSlideshow();
      initParticles();
      initFloatingObjects();
      initStarfield();
      initCursorTrail();
    });

    const music = document.getElementById('bgMusic');
    if (music) music.play().catch(() => {});

    setTimeout(typeText, 600);
  }, 900);
}

window.enterSite = enterSite;

/* ═══════════════════════════════════════════
   NAVBAR SCROLL
═══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ═══════════════════════════════════════════
   TYPING EFFECT
═══════════════════════════════════════════ */
const TYPING_TEXT = 'Every memory with you feels like a scene from a movie.';
function typeText() {
  const el = document.getElementById('typingText');
  if (!el) return;
  let i = 0;
  (function tick() {
    el.innerHTML = TYPING_TEXT.substring(0, i) + '<span class="typing-cursor"></span>';
    if (i < TYPING_TEXT.length) { i++; setTimeout(tick, 48); }
  })();
}

/* ═══════════════════════════════════════════
   SCROLL OBSERVER
═══════════════════════════════════════════ */
function observeScrollElements() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-in, .timeline-item').forEach(el => observer.observe(el));
}

if (document.querySelector('.timeline-item')) {
  document.addEventListener('DOMContentLoaded', () => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.timeline-item').forEach(el => obs.observe(el));
  });
}

/* ═══════════════════════════════════════════
   PARTICLE CANVAS — red drifting dots
═══════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const particles = Array.from({length: 70}, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.3,
    dx: (Math.random() - 0.5) * 0.35, dy: -(Math.random() * 0.5 + 0.1),
    alpha: Math.random() * 0.45 + 0.05, pulse: Math.random() * Math.PI * 2
  }));
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.pulse += 0.015;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229,9,20,${p.alpha * (0.6 + 0.4 * Math.sin(p.pulse))})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
    });
    requestAnimationFrame(draw);
  })();
}

/* ═══════════════════════════════════════════
   FLOATING OBJECTS
   Hearts, roses, stars, sparkles, kisses —
   all drift upward at varying speeds/sizes.
═══════════════════════════════════════════ */
function initFloatingObjects() {
  const layer = document.getElementById('floatLayer');
  if (!layer) return;

  // Richer emoji set — hearts, roses, sparkles, kisses, stars, petals
  const objects = [
    '❤️','💕','💖','💗','💓','💞','💝',
    '🌹','🌸','🌺','✨','⭐','🌟','💫',
    '😘','💋','🥰','🦋','🌙','💐'
  ];

  function spawn() {
    const el       = document.createElement('span');
    el.className   = 'float-obj';
    const emoji    = objects[Math.floor(Math.random() * objects.length)];
    el.textContent = emoji;

    const size     = Math.random() * 20 + 10;     // 10–30px
    const left     = Math.random() * 100;
    const dur      = Math.random() * 12 + 7;      // 7–19s
    const delay    = Math.random() * 3;
    const drift    = (Math.random() - 0.5) * 120; // horizontal wobble px
    const rotate   = (Math.random() - 0.5) * 40;  // rotation deg

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      --drift: ${drift}px;
      --rot: ${rotate}deg;
    `;

    layer.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay + 1) * 1000);
  }

  // Stagger initial burst
  for (let i = 0; i < 8; i++) setTimeout(spawn, i * 300);
  // Then steady stream
  setInterval(spawn, 900);
}

/* ═══════════════════════════════════════════
   STARFIELD CANVAS
   Tiny twinkling stars in the background
═══════════════════════════════════════════ */
function initStarfield() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({length: 120}, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    r:     Math.random() * 1.2 + 0.2,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2
  }));

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.phase += s.speed;
      const a = 0.15 + 0.6 * (0.5 + 0.5 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

/* ═══════════════════════════════════════════
   CURSOR TRAIL — tiny hearts follow the mouse
═══════════════════════════════════════════ */
function initCursorTrail() {
  const layer = document.getElementById('cursorTrail');
  if (!layer) return;

  const trailEmojis = ['❤️', '💕', '✨', '💖', '⭐'];
  let lastX = 0, lastY = 0, ticking = false;

  document.addEventListener('mousemove', e => {
    lastX = e.clientX; lastY = e.clientY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        spawnTrail(lastX, lastY);
        ticking = false;
      });
    }
  });

  let trailCount = 0;
  function spawnTrail(x, y) {
    trailCount++;
    if (trailCount % 4 !== 0) return; // throttle — every 4th move event

    const el = document.createElement('span');
    el.className   = 'cursor-heart';
    el.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
    const size = Math.random() * 10 + 8;
    el.style.cssText = `
      left: ${x}px; top: ${y}px;
      font-size: ${size}px;
    `;
    layer.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
}
