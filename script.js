/* ── STARS ── */
(function(){
  const c = document.getElementById('env-stars');
  for(let i=0;i<90;i++){
    const s = document.createElement('div');
    s.className = 'env-star';
    const sz = Math.random()*2+0.5;
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${(Math.random()*3+1.5).toFixed(1)}s;--delay:-${(Math.random()*4).toFixed(1)}s;`;
    c.appendChild(s);
  }
})();

/* ── SEAL CLICK → open flap → auto-reveal website ── */
let sealClicked = false;

function playOpenSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  if (!window.__inviteAudioCtx) {
    window.__inviteAudioCtx = new AudioCtx();
  }

  const ctx = window.__inviteAudioCtx;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.04, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(960, now);
  osc.frequency.exponentialRampToValueAtTime(720, now + 0.12);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.16);
}

function onSealClick(e) {
  e.stopPropagation();
  if (sealClicked) return;
  sealClicked = true;

  playOpenSound();

  // Hide prompt
  document.getElementById('env-prompt').classList.add('hidden');

  // Open the envelope flap with a quick zoom transition
  const envelope = document.getElementById('env-wrap');
  envelope.classList.add('opened');
  envelope.classList.add('opening');
  setTimeout(() => envelope.classList.remove('opening'), 700);

  // After flap animation + card reveal, fade out overlay and start music
  setTimeout(() => {
    const overlay = document.getElementById('envelope-overlay');
    overlay.classList.add('hidden');

    // Show music toggle button
    document.getElementById('music-toggle').classList.add('visible');

    // Start music
    const audio = document.getElementById('bg-music');
    audio.volume = 0.22;
    audio.play().catch(()=>{});

    // Start the golden sparkle shower
    if (window.startSparkleShower) window.startSparkleShower();
  }, 1000);
}

document.getElementById('env-seal').addEventListener('click', onSealClick);
// Also allow tapping anywhere on envelope as fallback
document.getElementById('env-wrap').addEventListener('click', onSealClick);

/* ── MUSIC TOGGLE ── */
let musicPlaying = true;
function toggleMusic(){
  const audio = document.getElementById('bg-music');
  const on  = document.getElementById('music-icon-on');
  const off = document.getElementById('music-icon-off');
  if(musicPlaying){ audio.pause(); on.style.display='none'; off.style.display='block'; }
  else { audio.play().catch(()=>{}); on.style.display='block'; off.style.display='none'; }
  musicPlaying = !musicPlaying;
}



(function(){
  const canvas = document.getElementById('sparkle-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  let running = false;
  let rafId = null;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Gold/cream sparkle palette to match the royal theme
  const colors = ['#f4d989', '#e8c468', '#fff3d6', '#d4af37', '#ffe8a3'];

  function makeParticle(spawnAtTop){
    const size = Math.random() * 2.6 + 1;
    return {
      x: Math.random() * w,
      y: spawnAtTop ? -10 - Math.random() * h : Math.random() * h,
      size: size,
      baseSize: size,
      speedY: Math.random() * 0.5 + 0.25,
      drift: (Math.random() - 0.5) * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkleSpeed: Math.random() * 0.03 + 0.015,
      twinklePhase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.4
    };
  }

  // Density scales gently with screen size, capped for performance
  function targetCount(){
    return Math.min(70, Math.floor((w * h) / 18000));
  }

  function initParticles(){
    particles = [];
    const count = targetCount();
    for (let i = 0; i < count; i++){
      particles.push(makeParticle(false));
    }
  }

  function drawStar(p, twinkle){
    ctx.save();
    ctx.globalAlpha = p.opacity * twinkle;
    ctx.translate(p.x, p.y);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.size * 2.5;
    const r = p.size;
    ctx.beginPath();
    for (let i = 0; i < 4; i++){
      ctx.rotate(Math.PI / 2);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, r);
    }
    ctx.lineWidth = r * 0.5;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate(){
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    for (let p of particles){
      p.y += p.speedY;
      p.x += p.drift;
      p.twinklePhase += p.twinkleSpeed;

      if (p.y > h + 10){
        Object.assign(p, makeParticle(true), { y: -10 });
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const twinkle = 0.5 + 0.5 * Math.sin(p.twinklePhase);
      drawStar(p, twinkle);
    }

    rafId = requestAnimationFrame(animate);
  }

  function startSparkles(){
    if (running) return;
    running = true;
    initParticles();
    animate();
  }

  function stopSparkles(){
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, w, h);
  }

  // Respect users who prefer reduced motion
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Expose globally so the envelope-open handler can trigger it
  window.startSparkleShower = function(){
    if (!prefersReducedMotion) startSparkles();
  };
  window.stopSparkleShower = stopSparkles;
})();



  function toggleMap(id) {
    const el = document.getElementById(id);
    if (el.classList.contains('visible')) {
      el.classList.remove('visible');
    } else {
      el.classList.add('visible');
    }
  }

  const weddingDate = new Date('2026-09-13T11:20:00+05:30');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      const wrap = document.getElementById('scratch-wrap');
      if (wrap) wrap.style.display = 'none';
      document.getElementById('cd-done').style.display = 'block';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent    = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoo2_KLeDevK54-qVhzj8iDgxyyYSQ7HjJqeipqjmncxCk44SS9Np3I6_3X416sux7tg/exec';

  async function submitWish() {
    const name    = document.getElementById('wish-name').value.trim();
    const relation= document.getElementById('wish-relation').value.trim();
    const message = document.getElementById('wish-message').value.trim();
    const status  = document.getElementById('wish-status');
    const btn     = document.getElementById('wish-submit');

    if (!name) { status.textContent = '⚠️ Please enter your name.'; return; }
    if (!message) { status.textContent = '⚠️ Please write a wish.'; return; }

    btn.disabled = true;
    btn.style.opacity = '0.6';
    status.textContent = 'Sending…';

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, relation, message, timestamp: new Date().toLocaleString('en-IN') })
      });

      addWishCard({ name, relation, message, timestamp: new Date().toLocaleString('en-IN') }, true);

      document.getElementById('wish-name').value = '';
      document.getElementById('wish-relation').value = '';
      document.getElementById('wish-message').value = '';
      status.textContent = '💜 Your wish was sent! Thank you.';
      status.style.color = 'var(--gold-light)';
    } catch (e) {
      status.textContent = '❌ Something went wrong. Please try again.';
    } finally {
      btn.disabled = false;
      btn.style.opacity = '1';
      setTimeout(() => { status.textContent = ''; status.style.color = 'var(--text-on-dark-muted)'; }, 5000);
    }
  }

  function addWishCard(wish, prepend = false) {
    const wall = document.getElementById('wishes-wall');
    const placeholder = wall.querySelector('div[style*="grid-column"]');
    if (placeholder) placeholder.remove();

    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="wish-card-name">${escapeHtml(wish.name)}</div>
      <div class="wish-card-relation">${wish.relation ? escapeHtml(wish.relation) : 'Guest'}</div>
      <div class="wish-card-message">${escapeHtml(wish.message)}</div>
      <div class="wish-card-time">${wish.timestamp || ''}</div>
    `;
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    if (prepend) wall.prepend(card);
    else wall.appendChild(card);

    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function loadWishes() {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_APPS')) return;
    try {
      const res = await fetch(APPS_SCRIPT_URL + '?action=get');
      const data = await res.json();
      if (data && data.wishes && data.wishes.length > 0) {
        data.wishes.reverse().forEach(w => addWishCard(w));
      }
    } catch(e) {
      // Silently fail
    }
  }

  loadWishes();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ── SCRATCH CARD (reveal countdown) ── */
  (function initScratchCard() {
    const wrap = document.getElementById('scratch-wrap');
    const canvas = document.getElementById('scratch-canvas');
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');

    const REVEAL_THRESHOLD = 0.55; // fraction of the foil that must be scratched off
    const BRUSH_RADIUS = 22;
    let revealed = false;
    let scratching = false;
    let moveCount = 0;
    let lastPos = null;

    function getHintText() {
      return 'Scratch to reveal ✨';
    }

    function sizeCanvas() {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawFoil() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E6CA65');
      grad.addColorStop(0.5, '#D4AF37');
      grad.addColorStop(1, '#B8962A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle dotted texture, echoing the kolam motif used elsewhere on the page
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      const spacing = 16;
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = 'rgba(30,11,41,0.85)';
      ctx.font = '600 15px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(getHintText(), w / 2, h / 2);
    }

    function initCanvas() {
      sizeCanvas();
      drawFoil();
    }

    function scratchDot(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    function scratchLine(x0, y0, x1, y1) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = BRUSH_RADIUS * 2;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    function getScratchedFraction() {
      const w = canvas.width, h = canvas.height;
      if (!w || !h) return 0;
      const stride = 6; // sample every Nth pixel — plenty accurate, much cheaper
      let transparent = 0, total = 0;
      const data = ctx.getImageData(0, 0, w, h).data;
      for (let i = 3; i < data.length; i += 4 * stride) {
        total++;
        if (data[i] < 20) transparent++;
      }
      return total ? transparent / total : 0;
    }

    function spawnBurst() {
      const count = 22;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'scratch-particle';
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const dist = 90 + Math.random() * 70;
        p.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--by', Math.sin(angle) * dist + 'px');
        p.style.animationDelay = (Math.random() * 0.08) + 's';
        wrap.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
      }
    }

    function triggerReveal(withBurst) {
      if (revealed) return;
      revealed = true;
      try { localStorage.setItem('countdown_scratch_revealed', '1'); } catch (e) {}
      wrap.classList.add('revealed');
      if (withBurst) {
        wrap.classList.add('bursting');
        spawnBurst();
        setTimeout(() => wrap.classList.remove('bursting'), 700);
      }
      setTimeout(() => { canvas.style.display = 'none'; }, 650);
    }

    function pointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function handleMove(x, y) {
      if (lastPos) scratchLine(lastPos.x, lastPos.y, x, y);
      else scratchDot(x, y);
      lastPos = { x, y };

      moveCount++;
      if (moveCount % 4 === 0) {
        const frac = getScratchedFraction();
        if (frac >= REVEAL_THRESHOLD) triggerReveal(true);
      }
    }

    canvas.addEventListener('pointerdown', (e) => {
      if (revealed) return;
      scratching = true;
      lastPos = null;
      canvas.setPointerCapture(e.pointerId);
      const { x, y } = pointerPos(e);
      handleMove(x, y);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!scratching || revealed) return;
      const { x, y } = pointerPos(e);
      handleMove(x, y);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
      canvas.addEventListener(evt, () => { scratching = false; lastPos = null; });
    });

    // Returning guests who already scratched it once shouldn't have to again
    let alreadyRevealed = false;
    try { alreadyRevealed = localStorage.getItem('countdown_scratch_revealed') === '1'; } catch (e) {}

    if (alreadyRevealed) {
      revealed = true;
      wrap.classList.add('no-transition', 'revealed');
      canvas.style.display = 'none';
    } else {
      initCanvas();
      window.addEventListener('resize', () => { if (!revealed) initCanvas(); });
    }

    // Re-draw the foil's hint text if the guest switches language before scratching
    window.refreshScratchCardText = function () {
      if (!revealed) initCanvas();
    };
  })();