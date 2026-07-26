/* script.js — Interactions, animations, and accessibility helpers */
document.addEventListener('DOMContentLoaded', function(){
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll on internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('main-nav');
  if(hamburger && navLinks){
    hamburger.addEventListener('click', ()=>{
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }

  // Motion cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  if(cursorDot && cursorRing){
    const updateCursor = (x, y) => {
      mouseX = x;
      mouseY = y;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    };

    window.addEventListener('mousemove', e => updateCursor(e.clientX, e.clientY));
    window.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    document.querySelectorAll('a, button, .btn, .glass, .project-card, .skill-card, .achievement, .contact-card, .timeline-content').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-active'));
    });

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  // Hero word rotator
  const heroWords = document.getElementById('hero-words');
  if(heroWords){
    const words = ['Automation', 'Robotics', 'Mechatronics', 'Innovation'];
    let index = 0;
    setInterval(() => {
      heroWords.textContent = words[index];
      index = (index + 1) % words.length;
    }, 2200);
  }

  // Back to top
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', ()=>{
    if(btt){ if(window.scrollY>600) btt.style.display='block'; else btt.style.display='none'; }
    const pb = document.getElementById('progress-bar');
    if(pb){
      const pct = (window.scrollY/(document.body.scrollHeight - window.innerHeight))*100;
      pb.style.width = pct + '%';
    }
  });
  if(btt) btt.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

  // IntersectionObserver for reveal & timeline trigger
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('in-view');
    });
  },{threshold:0.15});
  document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));
  document.querySelectorAll('.timeline-item').forEach(el=>io.observe(el));

  // Animate skill bars when visible
  const skillObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.querySelectorAll('.progress span').forEach(s=>{
          const v = s.getAttribute('data-progress') || s.dataset.progress || 70;
          s.style.width = v + '%';
        });
      }
    });
  },{threshold:0.25});
  document.querySelectorAll('.skill-card').forEach(el=>skillObserver.observe(el));

  // Typing effect for hero role (small, simple)
  const career = document.querySelector('.career');
  if(career){
    const txt = career.textContent.trim();
    career.textContent = '';
    let i=0;
    const t = setInterval(()=>{
      career.textContent += txt[i++]||'';
      if(i>txt.length) clearInterval(t);
    },12);
  }

  // Simple ripple for buttons
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click',function(e){
      const r=document.createElement('span');
      r.className='ripple';
      const rect=this.getBoundingClientRect();
      r.style.left=(e.clientX-rect.left)+'px';
      r.style.top=(e.clientY-rect.top)+'px';
      this.appendChild(r);
      setTimeout(()=>r.remove(),600);
    });
  });

  // Particle background (lightweight)
  const canvas = document.getElementById('bg-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w=canvas.width=innerWidth, h=canvas.height=innerHeight;
    const particles=[];
    const count = Math.max(12, Math.floor((w*h)/90000));
    for(let i=0;i<count;i++) particles.push(createParticle());
    function createParticle(){
      return {x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.6+0.4}
    }
    function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight}
    window.addEventListener('resize',resize);
    function tick(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
        const g = ctx.createRadialGradient(p.x,p.y,p.r*0.2,p.x,p.y,p.r*6);
        g.addColorStop(0,'rgba(0,229,255,0.16)');
        g.addColorStop(1,'rgba(106,92,255,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  // Accessibility: allow Escape to close mobile nav
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ const mn=document.getElementById('main-nav'); const hb=document.getElementById('hamburger'); if(mn) mn.classList.remove('open'); if(hb) hb.classList.remove('open'); } });
});
