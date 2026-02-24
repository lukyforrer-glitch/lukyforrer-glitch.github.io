/* ============================================================
   app.js — Форрер Кирилл Portfolio · 2026
   ============================================================ */
'use strict';

/* ─── LOADER ─────────────────────────────────────────────────── */
const BOOT = [
  '[  OK  ] Booting Forrer Kirill OS v2.6...',
  '[  OK  ] Loading cybersecurity modules...',
  '[  OK  ] Mounting Kali Linux environment...',
  '[  OK  ] Initializing full-stack engine...',
  '[  OK  ] Compiling Python · JS · React · Django...',
  '[  OK  ] Establishing encrypted connection...',
  '[  OK  ] Loading 3D render pipeline...',
  '[  OK  ] Security protocols — ACTIVE',
  '',
  'root@kali:~# ./launch_portfolio.sh',
  'Launching...',
];

(function loader() {
  const ldText = document.getElementById('ldText');
  const ldFill = document.getElementById('ldFill');
  const ldPct  = document.getElementById('ldPct');
  const loader = document.getElementById('loader');

  document.body.style.overflow = 'hidden';

  let lineI = 0, charI = 0, prog = 0;

  function type() {
    if (lineI >= BOOT.length) {
      animBar(100, () => setTimeout(() => { loader.classList.add('out'); document.body.style.overflow = ''; boot(); }, 500));
      return;
    }
    const line = BOOT[lineI];
    if (charI === 0 && lineI > 0) ldText.textContent += '\n';
    if (charI < line.length) {
      ldText.textContent += line[charI++];
      animBar(Math.floor((lineI / BOOT.length) * 88));
      setTimeout(type, 16);
    } else { lineI++; charI = 0; setTimeout(type, 55); }
  }

  function animBar(target, cb) {
    if (prog >= target) { cb && cb(); return; }
    prog++;
    ldFill.style.width = prog + '%';
    ldPct.textContent  = prog + '%';
    if (prog < target) setTimeout(() => animBar(target, cb), 18);
    else if (cb) cb();
  }

  setTimeout(type, 280);
})();

/* ─── BOOT (runs after loader) ───────────────────────────────── */
function boot() {
  initCursor();
  initBg();
  initHero3D();
  initTypewriter();
  initReveal();
  initTilt();
  initNavbar();
  initCounters();
  initBars();
  initRadials();
  initTerminal();
  initLang();
  initSound();
}

/* ─── CURSOR ─────────────────────────────────────────────────── */
function initCursor() {
  const dot  = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loopRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loopRing);
  })();

  document.querySelectorAll('a, button, .tilt, .pcard, .scard, .ttag, .tchip, .ccard').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });
}

/* ─── BACKGROUND CANVAS ──────────────────────────────────────── */
function initBg() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, cols = [], pts = [];

  const CHARS = 'アイウエオカキクケコ01010011ｦｧｨｩｪ@#$%&101アｶｷｸｹｺsa01sv';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildCols();
  }

  function buildCols() {
    cols = [];
    const n = Math.ceil(W / 18);
    for (let i = 0; i < n; i++) {
      cols.push({ x: i * 18, y: Math.random() * -H, spd: 1 + Math.random() * 2.2, op: .08 + Math.random() * .18 });
    }
    pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38,
      r: 1 + Math.random() * 1.8,
      c: Math.random() > .5 ? [47,111,255] : [0,179,255],
    }));
  }

  resize();
  window.addEventListener('resize', resize);

  function frame() {
    ctx.fillStyle = 'rgba(4,6,15,.07)';
    ctx.fillRect(0, 0, W, H);

    // Matrix rain
    ctx.font = "12px 'JetBrains Mono', monospace";
    for (const c of cols) {
      ctx.fillStyle = `rgba(0,179,255,${c.op})`;
      ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], c.x, c.y);
      c.y += c.spd;
      if (c.y > H) { c.y = -20; c.spd = 1 + Math.random() * 2.2; c.op = .07 + Math.random() * .18; }
    }

    // Particle network
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},.55)`;
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(47,111,255,${.12 * (1 - d / 130)})`;
          ctx.lineWidth = .5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
}

/* ─── THREE.JS HERO ──────────────────────────────────────────── */
function initHero3D() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('hero3d');
  const wrap   = canvas.parentElement;
  const W = wrap.offsetWidth  || 380;
  const H = wrap.offsetHeight || 380;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, .1, 100);
  camera.position.z = 5.5;

  // Outer torus knot wireframe
  const tkGeo  = new THREE.TorusKnotGeometry(1.6, .42, 120, 14);
  const tkWire = new THREE.WireframeGeometry(tkGeo);
  const tkMat  = new THREE.LineBasicMaterial({ color: 0x00b3ff, transparent: true, opacity: .3 });
  const tk     = new THREE.LineSegments(tkWire, tkMat);
  scene.add(tk);

  // Inner icosahedron
  const icoGeo  = new THREE.IcosahedronGeometry(.95, 2);
  const icoMat  = new THREE.MeshPhongMaterial({ color: 0x091830, emissive: 0x003366, emissiveIntensity: .7, transparent: true, opacity: .75, shininess: 180 });
  const ico     = new THREE.Mesh(icoGeo, icoMat);
  const icoWire = new THREE.LineSegments(new THREE.WireframeGeometry(icoGeo), new THREE.LineBasicMaterial({ color: 0x2f6fff, transparent: true, opacity: .55 }));
  scene.add(ico);
  scene.add(icoWire);

  // Orbital ring
  const ringGeo = new THREE.TorusGeometry(2.3, .015, 8, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x2f6fff, transparent: true, opacity: .5 });
  const ring1   = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 2.4;
  scene.add(ring1);

  const ring2 = ring1.clone();
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.y = Math.PI / 4;
  ring2.material = new THREE.MeshBasicMaterial({ color: 0xff3b3b, transparent: true, opacity: .3 });
  scene.add(ring2);

  // Particle cloud
  const pN   = 280;
  const pPos = new Float32Array(pN * 3);
  for (let i = 0; i < pN; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const r  = 2.6 + Math.random() * 2;
    pPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
    pPos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    pPos[i*3+2] = r * Math.cos(ph);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x2f6fff, size: .045, transparent: true, opacity: .75 }));
  scene.add(pMesh);

  // Lights
  scene.add(new THREE.AmbientLight(0x001133, 2.5));
  const l1 = new THREE.DirectionalLight(0x00b3ff, 3.5); l1.position.set(5, 5, 5);   scene.add(l1);
  const l2 = new THREE.DirectionalLight(0xff3b3b, 1.8); l2.position.set(-5, -3, 2); scene.add(l2);

  let mX = 0, mY = 0;
  document.addEventListener('mousemove', e => {
    mX = (e.clientX / innerWidth  - .5) * 2;
    mY = (e.clientY / innerHeight - .5) * 2;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += .004;
    tk.rotation.x += .002 + mY * .006;
    tk.rotation.y += .005 + mX * .006;
    ico.rotation.x = -t * .65;
    ico.rotation.z =  t * .45;
    icoWire.rotation.x = ico.rotation.x;
    icoWire.rotation.z = ico.rotation.z;
    ring1.rotation.z += .006;
    ring2.rotation.z -= .004;
    pMesh.rotation.y += .0015;
    pMesh.rotation.x += .0008;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const W2 = wrap.offsetWidth; const H2 = wrap.offsetHeight;
    renderer.setSize(W2, H2);
    camera.aspect = W2 / H2; camera.updateProjectionMatrix();
  });
}

/* ─── TYPEWRITER ─────────────────────────────────────────────── */
let curLang = 'ru';

const ROLES = ['Cybersecurity Engineer', 'Full-Stack Developer', 'Ethical Hacker', 'Mobile Developer', 'Backend Architect', 'Kali Linux Expert'];

function initTypewriter() {
  const el = document.getElementById('tw');
  let idx = 0, ci = 0, del = false;

  function tick() {
    const word = ROLES[idx % ROLES.length];
    if (!del) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { del = true; setTimeout(tick, 2400); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { del = false; idx++; }
    }
    setTimeout(tick, del ? 48 : 78);
  }
  tick();
}

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = getComputedStyle(e.target).getPropertyValue('--d') || '0ms';
      e.target.style.transitionDelay = delay;
      e.target.classList.add('vis');
    });
  }, { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ─── TILT ───────────────────────────────────────────────────── */
function initTilt() {
  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r   = el.getBoundingClientRect();
      const rx  = (e.clientX - r.left) / r.width  - .5;
      const ry  = (e.clientY - r.top)  / r.height - .5;
      el.style.transform = `perspective(600px) rotateX(${ry * -12}deg) rotateY(${rx * 12}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ─── NAVBAR ─────────────────────────────────────────────────── */
function initNavbar() {
  const nav    = document.getElementById('nav');
  const links  = document.querySelectorAll('.nav-links a');
  const secs   = document.querySelectorAll('section[id]');
  const burger = document.getElementById('burger');
  const nl     = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    let cur = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 180) cur = s.id; });
    links.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + cur));
  }, { passive: true });

  burger?.addEventListener('click', () => nl.classList.toggle('open'));
  links.forEach(a => a.addEventListener('click', () => nl.classList.remove('open')));
}

/* ─── COUNTERS ───────────────────────────────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const tgt = +e.target.dataset.t;
      let v = 0;
      const step = tgt / 38;
      const id = setInterval(() => {
        v = Math.min(v + step, tgt);
        e.target.textContent = Math.floor(v);
        if (v >= tgt) clearInterval(id);
      }, 40);
      obs.unobserve(e.target);
    });
  }, { threshold: .5 });
  document.querySelectorAll('.ctr').forEach(el => obs.observe(el));
}

/* ─── SKILL BARS ─────────────────────────────────────────────── */
function initBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill = e.target.querySelector('.bf');
      if (fill) setTimeout(() => { fill.style.width = e.target.dataset.w + '%'; }, 150);
      obs.unobserve(e.target);
    });
  }, { threshold: .3 });
  document.querySelectorAll('.bar-item').forEach(el => obs.observe(el));
}

/* ─── RADIAL PROGRESS ────────────────────────────────────────── */
function initRadials() {
  const CIRC = 2 * Math.PI * 42; // r=42
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fg  = e.target.querySelector('.rfg');
      const val = +e.target.dataset.v;
      if (fg) setTimeout(() => { fg.style.strokeDashoffset = CIRC * (1 - val / 100); }, 250);
      obs.unobserve(e.target);
    });
  }, { threshold: .3 });
  document.querySelectorAll('.rad-svg').forEach(s => obs.observe(s));
}

/* ─── SECURITY TERMINAL ──────────────────────────────────────── */
function initTerminal() {
  const out = document.getElementById('termOut');
  if (!out) return;

  const CMDS = [
    { cmd: 'nmap -sV -Pn -T4 10.0.0.0/24',             out: 'Scanning 256 hosts... Found 14 open ports.' },
    { cmd: 'sqlmap -u "https://target.com/api?id=1" --risk=3', out: '[CRITICAL] Boolean-based blind SQLi detected: parameter "id"' },
    { cmd: 'python3 exploit.py --target 10.0.0.42 --port 445', out: '[+] Shell opened! meterpreter > sysinfo' },
    { cmd: 'hashcat -m 1000 hashes.txt rockyou.txt',    out: '[+] Cracked 3/5: admin:P@ssw0rd · root:toor123' },
    { cmd: 'gobuster dir -u https://target.com -w common.txt', out: '/admin (200) | /backup (301) | /.git (403)' },
    { cmd: 'nikto -h https://target.com',               out: '+ OSVDB-3233: Apache default README found' },
    { cmd: 'wireshark -k -i eth0 -Y "http.request"',    out: 'Capturing on "eth0"... 128 packets captured.' },
    { cmd: 'aircrack-ng -b AA:BB:CC:DD:EE:FF dump.cap', out: 'KEY FOUND! [ WPA2: hunter2 ]' },
    { cmd: 'hydra -l admin -P pass.txt ssh://10.0.0.1', out: '[22][ssh] host: 10.0.0.1 login: admin pass: admin123' },
    { cmd: 'msfconsole -x "use exploit/ms17_010_eternalblue; run"', out: '[*] Sending stage... Meterpreter session 1 opened' },
  ];

  let idx = 0;
  let started = false;

  function addLine(html) {
    const d = document.createElement('div');
    d.className = 'tl';
    d.innerHTML = html;
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
    while (out.children.length > 22) out.removeChild(out.firstChild);
  }

  function run() {
    const { cmd, out: res } = CMDS[idx % CMDS.length];
    idx++;

    const promptDiv = document.createElement('div');
    promptDiv.className = 'tl';
    promptDiv.innerHTML = `<span class="tp">└─#</span> <span class="tc" id="tc_cur"></span><span class="bcur">▌</span>`;
    out.appendChild(promptDiv);
    out.scrollTop = out.scrollHeight;

    const tc = promptDiv.querySelector('#tc_cur');
    tc.removeAttribute('id');
    let i = 0;

    function typeChar() {
      if (tc) tc.textContent = cmd.slice(0, ++i);
      if (i < cmd.length) { setTimeout(typeChar, 42 + Math.random() * 18); return; }
      const bc = promptDiv.querySelector('.bcur');
      if (bc) bc.remove();
      setTimeout(() => {
        addLine(`<span class="to">${res}</span>`);
        setTimeout(run, 2200 + Math.random() * 1400);
      }, 250);
    }
    typeChar();
  }

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    setTimeout(run, 800);
    obs.disconnect();
  }, { threshold: .2 });
  obs.observe(out);
}

/* ─── LANGUAGE TOGGLE ────────────────────────────────────────── */
function initLang() {
  const btn = document.getElementById('langBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    curLang = curLang === 'ru' ? 'en' : 'ru';
    btn.textContent = curLang === 'ru' ? 'EN' : 'RU';
    document.querySelectorAll('[data-ru][data-en]').forEach(el => {
      el.textContent = el.dataset[curLang] || el.textContent;
      // sync glitch data-text if present
      const dtKey = 'data-text-' + curLang;
      if (el.dataset['textRu'] || el.dataset['textEn']) {
        const dt = curLang === 'ru' ? el.dataset.textRu : el.dataset.textEn;
        if (dt) el.setAttribute('data-text', dt);
      }
    });
  });
}

/* ─── HOVER SOUND (optional subtle) ─────────────────────────── */
function initSound() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    function ping(f = 540, vol = .012) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.value = vol;
      g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .12);
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + .12);
    }
    document.querySelectorAll('.btn, .pcard, .ccard, .btn-dl').forEach(el => {
      el.addEventListener('mouseenter', () => ping(520, .01));
    });
  } catch (_) {}
}

/* ─── SMOOTH ANCHOR SCROLL ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
