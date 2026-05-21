
(function() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');
  hamburger.addEventListener('click', () => nav.classList.toggle('active'));

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold:0.2 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Booking form -> WhatsApp
  const form = document.getElementById('booking-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service-booking').value;
    const date = document.getElementById('date').value;
    const message = document.getElementById('message').value.trim();

    let text = `Hello AMISTY Construction, here is my booking request:\n`;
    text += `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nPreferred Date: ${date}\nMessage: ${message}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/254705455312?text=${encoded}`, '_blank');
  });

  // Call modal
  const callBtn = document.getElementById('call-btn');
  const callModal = document.getElementById('call-modal');
  const callClose = document.getElementById('call-modal-close');
  callBtn.addEventListener('click', () => callModal.style.display = 'flex');
  callClose.addEventListener('click', () => callModal.style.display = 'none');
  window.addEventListener('click', e => { if(e.target === callModal) callModal.style.display = 'none'; });

  // Particle network canvas
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; }
  window.addEventListener('resize', resize); resize();

  const particles = [];
  const colors = ['#B91C1C','#111111','#1E3A8A'];
  for (let i=0;i<80;i++) {
    particles.push({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*1.2, vy: (Math.random()-0.5)*1.2,
      color: colors[Math.floor(Math.random()*3)],
      radius: 2+Math.random()*2
    });
  }

  function drawNetwork() {
    ctx.clearRect(0,0,w,h);
    // Update & draw particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx *= -1;
      if(p.y<0||p.y>h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    });
    // Draw lines between close particles
    for (let i=0; i<particles.length; i++) {
      for (let j=i+1; j<particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#F8F8F8';
          ctx.globalAlpha = 0.1 * (1 - dist/120);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawNetwork);
  }
  drawNetwork();

  // Tilt / mouse interaction (subtle)
  const tiltShape = document.querySelector('.tilt-shape');
  let targetX = 0, targetY = 0, rotateTarget = 0;
  function mouseMove(e) {
    const x = (e.clientX/w -0.5)*2, y = (e.clientY/h -0.5)*2;
    targetX = x*30; targetY = y*30; rotateTarget = x*8;
  }
  function orientation(e) {
    const g = e.gamma||0, b = e.beta||0;
    targetX = (g/90)*30; targetY = (b/90)*30; rotateTarget = (g/90)*8;
  }
  window.addEventListener('mousemove', mouseMove);
  if (window.DeviceOrientationEvent) window.addEventListener('deviceorientation', orientation);

  function smoothTilt() {
    const cur = tiltShape.style.transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/) || ['','0','0'];
    const curX = parseFloat(cur[1])||0, curY = parseFloat(cur[2])||0;
    const curRot = parseFloat(tiltShape.style.transform.match(/rotate\(([^d]+)deg\)/)?.[1]) || 0;
    const newX = curX + (targetX - curX)*0.1;
    const newY = curY + (targetY - curY)*0.1;
    const newRot = curRot + (rotateTarget - curRot)*0.1;
    tiltShape.style.transform = `translate(-50%,-50%) translate(${newX}px,${newY}px) rotate(${newRot}deg)`;
    requestAnimationFrame(smoothTilt);
  }
  smoothTilt();
})();