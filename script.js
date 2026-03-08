<script>
/* ══ BG PARTICLES ══ */
const bgCanvas = document.getElementById('bg-canvas');
const bctx = bgCanvas.getContext('2d');
let W, H, particles = [];

function resizeBg() {
  W = bgCanvas.width = window.innerWidth;
  H = bgCanvas.height = window.innerHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * 2000,
    y: Math.random() * 2000,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    a: Math.random()
  });
}

function animBg() {
  bctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    p.a += 0.005;
    const alpha = (Math.sin(p.a) * 0.5 + 0.5) * 0.4;
    bctx.beginPath();
    bctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bctx.fillStyle = `rgba(201,169,110,${alpha})`;
    bctx.fill();
  });
  requestAnimationFrame(animBg);
}
animBg();

/* ══ INTRO ══ */
function startExperience() {
  document.getElementById('intro').classList.add('hide');
  document.getElementById('main').classList.add('show');
  launchPetals();
  setTimeout(initPoem, 1500);
  initPetalCanvas();
}

/* ══ FLOATING PETALS ══ */
const emojis = ['🌸','🌷','🌺','✿','❀','💐','🌹'];
function launchPetals() {
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'petal-float';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.bottom = '-10px';
      p.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
      p.style.animationDuration = (Math.random() * 4 + 4) + 's';
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }, i * 180);
  }
}

/* ══ POEM REVEAL ══ */
function initPoem() {
  const spans = document.querySelectorAll('#poem span');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const lines = e.target.parentElement.querySelectorAll('span');
        lines.forEach((l, i) => {
          setTimeout(() => l.classList.add('visible'), i * 200);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(document.getElementById('poem'));
}

/* ══ PETAL CANVAS (jardín interactivo) ══ */
function initPetalCanvas() {
  const canvas = document.getElementById('petal-canvas');
  const ctx = canvas.getContext('2d');
  let flowers = [];
  let mouse = { x: 250, y: 250 };

  const size = Math.min(window.innerWidth - 40, 500);
  canvas.width = size; canvas.height = size;

  class Flower {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.size = 0;
      this.maxSize = Math.random() * 25 + 10;
      this.petals = Math.floor(Math.random() * 3) + 5;
      this.angle = Math.random() * Math.PI * 2;
      this.color = [`#c2587a`,`#c9a96e`,`#c9a8c0`,`#f0c4d4`,`#8aab8a`][Math.floor(Math.random()*5)];
      this.born = Date.now();
      this.life = Math.random() * 4000 + 3000;
      this.alpha = 0;
      this.speed = Math.random() * 0.4 + 0.3;
    }
    update() {
      const age = Date.now() - this.born;
      const t = age / this.life;
      if (t < 0.2) { this.size = this.maxSize * (t / 0.2); this.alpha = t / 0.2; }
      else if (t < 0.7) { this.size = this.maxSize; this.alpha = 1; }
      else { this.alpha = 1 - (t - 0.7) / 0.3; }
      this.angle += 0.003 * this.speed;
      return t < 1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha * 0.85;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      for (let i = 0; i < this.petals; i++) {
        ctx.save();
        ctx.rotate((i / this.petals) * Math.PI * 2);
        ctx.beginPath();
        ctx.ellipse(0, -this.size * 0.7, this.size * 0.35, this.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#fdf6ee';
      ctx.fill();
      ctx.restore();
    }
  }

  let lastSpawn = 0;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    const now = Date.now();
    if (now - lastSpawn > 120) {
      flowers.push(new Flower(mouse.x + (Math.random()-0.5)*20, mouse.y + (Math.random()-0.5)*20));
      lastSpawn = now;
    }
  });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    const t = e.touches[0];
    mouse.x = t.clientX - r.left; mouse.y = t.clientY - r.top;
    const now = Date.now();
    if (now - lastSpawn > 100) {
      flowers.push(new Flower(mouse.x + (Math.random()-0.5)*20, mouse.y + (Math.random()-0.5)*20));
      lastSpawn = now;
    }
  }, { passive: false });

  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const angle = (i / 12) * Math.PI * 2;
      const r = 120 + Math.random() * 80;
      flowers.push(new Flower(size/2 + Math.cos(angle)*r, size/2 + Math.sin(angle)*r));
    }, i * 150);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flowers = flowers.filter(f => f.update());
    flowers.forEach(f => f.draw());
    requestAnimationFrame(loop);
  }
  loop();
}

/* ══ SCROLL OBSERVER (cards) ══ */
const cards = document.querySelectorAll('.quote-card');
const cardObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }, 100 * [...cards].indexOf(e.target));
    }
  });
}, { threshold: 0.1 });
cards.forEach(c => {
  c.style.opacity = '0';
  c.style.transform = 'translateY(30px)';
  c.style.transition = 'opacity 0.7s ease, transform 0.7s ease, border-color 0.4s ease, background 0.4s ease';
  cardObs.observe(c);
});
</script>

</body>
</html>