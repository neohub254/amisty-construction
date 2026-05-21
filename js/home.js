















(function() {
  // ---------- Toggle mobile menu ----------
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  // ---------- Scroll animations (Intersection Observer) ----------
  const animatedElements = document.querySelectorAll('.fade-in, .zoom-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  animatedElements.forEach(el => observer.observe(el));

  // ---------- Estimate Calculator ----------
  const serviceSelect = document.getElementById('service');
  const sqmInput = document.getElementById('sqm');
  const sqmValue = document.getElementById('sqm-value');
  const complexityRadios = document.getElementsByName('complexity');
  const resultDiv = document.getElementById('estimate-result');

  // rate tables: [low_min, low_max, med_min, med_max, high_min, high_max] per service (per sqm)
  const rates = {
    building: [15000, 20000, 20000, 28000, 28000, 35000],
    landscaping: [5000, 8000, 8000, 12000, 12000, 18000],
    both_add: [0,0,0,0,0,0] // will compute combined
  };

  function updateEstimate() {
    const sqm = parseInt(sqmInput.value);
    sqmValue.textContent = sqm;
    const complexity = [...complexityRadios].find(r => r.checked).value;
    const service = serviceSelect.value;

    let min, max;
    if (service === 'building' || service === 'landscaping') {
      const r = rates[service];
      if (complexity === 'low') { min = r[0]; max = r[1]; }
      else if (complexity === 'med') { min = r[2]; max = r[3]; }
      else { min = r[4]; max = r[5]; }
    } else if (service === 'both') {
      const br = rates.building;
      const lr = rates.landscaping;
      if (complexity === 'low') {
        min = br[0] + lr[0];
        max = br[1] + lr[1];
      } else if (complexity === 'med') {
        min = br[2] + lr[2];
        max = br[3] + lr[3];
      } else {
        min = br[4] + lr[4];
        max = br[5] + lr[5];
      }
    }
    const totalMin = sqm * min;
    const totalMax = sqm * max;
    resultDiv.textContent = `KES ${totalMin.toLocaleString()} - ${totalMax.toLocaleString()}`;
  }

  serviceSelect.addEventListener('change', updateEstimate);
  sqmInput.addEventListener('input', updateEstimate);
  complexityRadios.forEach(r => r.addEventListener('change', updateEstimate));
  updateEstimate();

  // ---------- Canvas: Falling Tetris blocks ----------
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const blocks = [];
  const blockColors = ['#00f870','#ffffff','#295529','#f548ca','#B91C1C', '#111111', '#1E3A8A'];
  const blockOpacity = 0.5;
  const blockWidth = 40;
  const blockHeight = 60;

  function createBlock() {
    return {
      x: Math.random() * width,
      y: -blockHeight,
      speed: 0.5 + Math.random() * 1.5,
      color: blockColors[Math.floor(Math.random() * blockColors.length)],
      w: blockWidth,
      h: blockHeight
    };
  }

  // pre-populate blocks
  for (let i = 0; i < 30; i++) {
    blocks.push(createBlock());
    blocks[blocks.length-1].y = Math.random() * height; // random starting y
  }

  function animateBlocks() {
    ctx.clearRect(0, 0, width, height);
    blocks.forEach(b => {
      b.y += b.speed;
      if (b.y > height + b.h) {
        b.y = -b.h;
        b.x = Math.random() * width;
      }
      ctx.globalAlpha = blockOpacity;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateBlocks);
  }
  animateBlocks();

  // ---------- Gyroscope / Tilt interaction ----------
  const tiltShape = document.querySelector('.tilt-shape');
  function handleOrientation(e) {
    const gamma = e.gamma || 0; // -90 to 90
    const beta = e.beta || 0;   // -180 to 180
    const moveX = (gamma / 90) * 40;   // max 40px
    const moveY = (beta / 90) * 40;
    const rotateDeg = (gamma / 90) * 15;
    tiltShape.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px) rotate(${rotateDeg}deg)`;
  }
  function handleMouseMove(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    const moveX = x * 50;
    const moveY = y * 50;
    const rotateDeg = x * 15;
    tiltShape.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px) rotate(${rotateDeg}deg)`;
  }

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
  } else {
    window.addEventListener('mousemove', handleMouseMove);
  }
  // fallback: also use mousemove if no orientation (desktop)
  window.addEventListener('mousemove', handleMouseMove);
})();