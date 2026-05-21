
(function() {
  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  hamburger.addEventListener('click', () => nav.classList.toggle('active'));

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.2 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Before/After sliders
  const sliders = document.querySelectorAll('.ba-slider');
  sliders.forEach(slider => {
    const container = slider.parentElement;
    const afterImg = container.querySelector('.ba-after');
    slider.addEventListener('input', () => {
      const val = slider.value;
      afterImg.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
    });
  });

  // Showroom modal
  const items = document.querySelectorAll('.showroom-item');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');

  const itemData = {
    brick: { img:'brick.jpg', desc:'High‑strength clay bricks, locally sourced, perfect for load‑bearing walls.' },
    wood: { img:'wood1.jpg', desc:'Sustainably harvested timber, treated for durability and termite resistance.' },
    concrete: { img:'concrete1.jpg', desc:'Ready‑mix concrete with certified compressive strength for all structural needs.' },
    gravel: { img:'gravel1.jpg', desc:'Clean crushed stone for driveways, drainage, and hardscape foundations.' },
    turf: { img:'turf1.jpg', desc:'Premium instant lawn rolls that establish quickly and stay green longer.' },
    trees: { img:'trees1.jpg', desc:'Mature ornamental and fruit trees, transplanted with root‑ball integrity.' }
  };

  items.forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.item;
      const data = itemData[key];
      modalTitle.textContent = item.querySelector('span').textContent;
      modalImg.src = data.img;
      modalImg.alt = key;
      modalDesc.textContent = data.desc;
      modal.style.display = 'flex';
    });
  });

  modalClose.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  // Canvas: animated geometric waves + fast falling squares
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; }
  window.addEventListener('resize', resize); resize();

  let phase = 0;
  const squares = [];
  for (let i=0;i<40;i++) {
    squares.push({
      x: Math.random()*w, y: Math.random()*h, size: 10+Math.random()*15,
      speed: 2+Math.random()*3, color: ['#B91C1C','#111111','#1E3A8A'][Math.floor(Math.random()*3)]
    });
  }

  function drawWaves() {
    ctx.clearRect(0,0,w,h);
    // Draw two wave layers
    for (let layer=0; layer<2; layer++) {
      ctx.beginPath();
      const amp = 50 + layer*20;
      const freq = 0.01 + layer*0.005;
      const offY = h/2 + layer*60;
      for (let x=0; x<=w; x+=5) {
        const y = offY + Math.sin(x*freq + phase*(layer+1)*0.5) * amp;
        ctx.lineTo(x,y);
      }
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      const grad = ctx.createLinearGradient(0,0,w,0);
      if (layer===0) { grad.addColorStop(0,'rgba(185,28,28,0.15)'); grad.addColorStop(1,'rgba(30,58,138,0.15)'); }
      else { grad.addColorStop(0,'rgba(17,17,17,0.2)'); grad.addColorStop(1,'rgba(30,58,138,0.2)'); }
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Falling squares (fast)
    squares.forEach(s => {
      s.y += s.speed;
      if (s.y > h + s.size) { s.y = -s.size; s.x = Math.random()*w; }
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1;
    phase += 0.02;
    requestAnimationFrame(drawWaves);
  }
  drawWaves();

  // Tilt/mouse
  const tiltShape = document.querySelector('.tilt-shape');
  function mouseMove(e) {
    const x = (e.clientX/w -0.5)*2, y = (e.clientY/h -0.5)*2;
    tiltShape.style.transform = `translate(-50%,-50%) translate(${x*40}px,${y*40}px) rotate(${x*12}deg)`;
  }
  function orientation(e) {
    const g = e.gamma||0, b = e.beta||0;
    tiltShape.style.transform = `translate(-50%,-50%) translate(${(g/90)*40}px,${(b/90)*40}px) rotate(${(g/90)*12}deg)`;
  }
  window.addEventListener('mousemove', mouseMove);
  if (window.DeviceOrientationEvent) window.addEventListener('deviceorientation', orientation);
})();