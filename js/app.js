/**
 * 3D GALAXY PORTFOLIO - CORE APPLICATION LOGIC
 * Handles UI interactions, smooth navigation, project modal, filters, typing text, and contact uplink.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Components
  initCustomCursor();
  initTypingEffect();
  initNavbarScroll();
  initNavigationWarp();
  initAudioToggle();
  initSkillFilters();
  initStatsCounter();
  initWarpLabControls();
  initProjectModals();
  initContactForm();
  initScrollReveal();
  initPortrait3DTilt();
});

/* ==========================================================================
   1. CUSTOM CELESTIAL STARDUST CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');

  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth lerp for ring follower
  function updateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(updateRing);
  }
  updateRing();

  // Hover states on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, select, .interactive-hover');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      if (window.cosmicAudio) window.cosmicAudio.playHoverSound();
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
    el.addEventListener('click', () => {
      if (window.cosmicAudio) window.cosmicAudio.playClickSound();
    });
  });
}

/* ==========================================================================
   2. HERO TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const words = [
    'Full Stack Web Architect',
    'AI & Creative Tech Engineer',
    '3D Web & Three.js Specialist',
    'Cloud & Scalable Systems Builder'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400; // Pause before typing next word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   3. NAVBAR SCROLL & MOBILE DRAWER
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.hud-navbar');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }
}

/* ==========================================================================
   4. NAVIGATION WARP ACCELERATION
   ========================================================================== */
function initNavigationWarp() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();

        // Trigger Three.js Galaxy Warp & Audio Whoosh
        if (window.galaxyEngine) {
          window.galaxyEngine.triggerWarpEffect();
        }

        // Smooth Scroll
        targetEl.scrollIntoView({ behavior: 'smooth' });

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if (link.classList.contains('nav-link')) {
          link.classList.add('active');
        }
      }
    });
  });

  // Active section observer on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   5. AUDIO SOUNDSCAPE TOGGLE
   ========================================================================== */
function initAudioToggle() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (window.cosmicAudio) {
      const isUnmuted = window.cosmicAudio.toggleMute();
      audioBtn.classList.toggle('audio-playing', isUnmuted);
      audioBtn.title = isUnmuted ? 'Mute Deep Space Ambience' : 'Play Deep Space Ambience';
    }
  });
}

/* ==========================================================================
   6. SKILL CATEGORY FILTERS
   ========================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-orb-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   7. STATS NUMBER COUNTER ON SCROLL
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-counter');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statElements.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
          let current = 0;
          const duration = 1800;
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.about-stats-grid');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   8. WARP LAB CONTROLS (Speed & Themes)
   ========================================================================== */
function initWarpLabControls() {
  // Speed Slider
  const speedSlider = document.getElementById('warp-speed-slider');
  const speedReadout = document.getElementById('warp-speed-val');

  if (speedSlider && speedReadout) {
    speedSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      speedReadout.textContent = `${val.toFixed(1)}x Warp`;
      if (window.galaxyEngine) {
        window.galaxyEngine.setSpeedMultiplier(val);
      }
    });
  }

  // Theme Swatches
  const themeBtns = document.querySelectorAll('.swatch-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const theme = btn.getAttribute('data-theme');
      if (window.galaxyEngine && theme) {
        window.galaxyEngine.setTheme(theme);
      }
    });
  });
}

/* ==========================================================================
   9. PROJECT DEEP-DIVE MODALS
   ========================================================================== */
const projectData = {
  malikdigital: {
    title: 'Malik Digital Skills - Online Training & EdTech Platform',
    category: 'EdTech & Full Stack Web App',
    status: 'Live Orbit • Production • 500+ Students',
    description: 'A comprehensive digital education & skills training platform featuring 11+ professional courses (Vibe Coding, AI, Full Stack Development, Prompt Engineering, Graphic Design), direct WhatsApp admission automation, dynamic course syllabi, and student review telemetry.',
    stack: ['React / Vite', 'Tailwind CSS', 'JavaScript (ES6+)', 'WhatsApp Business API', 'Responsive UI/UX', 'SEO Optimization'],
    highlights: [
      'Engineered a high-performance responsive web application serving 500+ aspiring tech students.',
      'Architected 11+ interactive course modules, pricing tier calculators, and admission flows.',
      'Integrated one-tap automated WhatsApp enrollment conduits with custom payload messaging.',
      'Achieved lightning-fast load times and seamless cross-platform mobile compatibility.'
    ],
    liveUrl: 'https://malikdigitalskill.lovable.app/',
    githubUrl: 'https://github.com/Hammadullah506'
  },
  nova: {
    title: 'NovaAI - Neural Intelligence Engine',
    category: 'AI / Full Stack Platform',
    status: 'Live Orbit • Production Ready',
    description: 'NovaAI is an advanced multimodal AI orchestration platform that enables users to query real-time data, execute automated workflows, generate custom code snippets, and visualize neural representations in real time.',
    stack: ['Next.js 14', 'TypeScript', 'OpenAI API', 'Tailwind CSS', 'PostgreSQL', 'Prisma', 'Redis'],
    highlights: [
      'Engineered a streaming response pipeline with sub-100ms first token latency.',
      'Implemented vector search memory using pgvector and embeddings.',
      'Integrated real-time usage telemetry and billing analytics dashboard.'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/Hammadullah506'
  },
  aetheria: {
    title: 'Aetheria 3D - Metaverse Web Experience',
    category: 'Creative Tech & WebGL',
    status: 'Mission Complete • Award Nominee',
    description: 'A 3D spatial web exploration platform with interactive celestial terrain, realistic physics simulation, spatial audio ambience, and custom GLTF planetary model shaders.',
    stack: ['Three.js', 'WebGL', 'GLSL Shaders', 'Web Audio API', 'GSAP', 'Vite'],
    highlights: [
      'Custom vertex and fragment shaders for atmospheric planetary scattering.',
      'Spatial 3D binaural sound engine using the Web Audio API.',
      'Ultra-optimized geometry instancing maintaining consistent 60 FPS on mobile.'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/Hammadullah506'
  },
  quantum: {
    title: 'QuantumCommerce - Next-Gen E-Commerce',
    category: 'Full Stack & Cloud Architecture',
    status: 'Active Deployment • Scale: 50k+ DAU',
    description: 'High-performance headless e-commerce ecosystem with lightning-fast instant checkout, real-time inventory telemetry, 3D product previews, and automated order fulfillment.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'Docker', 'AWS S3'],
    highlights: [
      'Achieved 99+ Lighthouse performance score with ISR and edge caching.',
      'Multi-currency payment processing with automated fraud screening.',
      'Interactive 3D model customizer directly within product pages.'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/Hammadullah506'
  },
  chronos: {
    title: 'Chronos Nexus - Cloud DevOps & Analytics',
    category: 'DevOps & Realtime Systems',
    status: 'Enterprise Deployment',
    description: 'Centralized observability hub providing distributed microservice health tracing, Kubernetes cluster telemetry, automated alerting, and predictive anomaly detection.',
    stack: ['Go (Golang)', 'React', 'GraphQL', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
    highlights: [
      'Processes 10,000+ metrics per second via high-throughput WebSocket streams.',
      'Custom interactive charts and node topology graphs with D3.js.',
      'Automated incident triggering with Slack/Discord webhook alerts.'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/Hammadullah506'
  },
  cyberpulse: {
    title: 'CyberPulse - Decentralized Web3 Portal',
    category: 'Web3 & Blockchain',
    status: 'Live on Testnet / Mainnet',
    description: 'A sleek cyberpunk decentralized asset management hub supporting multiple EVM chains, smart contract verification, decentralized identity authentication, and token swaps.',
    stack: ['Solidity', 'Ethers.js', 'Next.js', 'Wagmi / Viem', 'IPFS', 'Hardhat'],
    highlights: [
      'Gas-optimized smart contract architecture tested against zero-day exploits.',
      'Responsive multi-wallet connection modal with MetaMask & WalletConnect.',
      'Decentralized metadata hosting through IPFS and Pinata nodes.'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/Hammadullah506'
  },
  starlight: {
    title: 'Starlight Studio - Creative Digital Agency',
    category: 'Creative Web & Design System',
    status: 'Client Delivered • 100% Satisfaction',
    description: 'A dynamic, award-winning agency portfolio showcasing digital craftsmanship with magnetic cursor effects, smooth locomotive scrolling, and interactive canvas particle transitions.',
    stack: ['HTML5 / CSS3', 'JavaScript (ES6+)', 'GSAP ScrollTrigger', 'Canvas API', 'Webpack'],
    highlights: [
      'Fluid physics-based scroll animations and magnetic interactive buttons.',
      'Dynamic project gallery with seamless layout transitions.',
      'Zero external bloated frameworks for blistering 0.4s initial load time.'
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com/Hammadullah506'
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (!modalBackdrop || !modalBody) return;

  const inspectBtns = document.querySelectorAll('.project-inspect-btn');

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const data = projectData[projId];
      if (!data) return;

      modalBody.innerHTML = `
        <div class="modal-badge-row" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <span style="font-family:var(--font-display); font-size:0.8rem; color:var(--neon-cyan); letter-spacing:1px; background:rgba(0,242,254,0.1); padding:4px 12px; border-radius:var(--radius-full); border:1px solid rgba(0,242,254,0.3);">${data.category}</span>
          <span style="font-family:var(--font-sub); font-size:0.8rem; color:var(--neon-emerald);">${data.status}</span>
        </div>
        <h2 style="font-family:var(--font-display); font-size:1.8rem; color:#ffffff; margin-bottom:14px;">${data.title}</h2>
        <p style="font-size:1rem; color:var(--text-secondary); line-height:1.7; margin-bottom:24px;">${data.description}</p>
        
        <h4 style="font-family:var(--font-display); font-size:0.95rem; color:var(--neon-cyan); letter-spacing:1px; margin-bottom:12px; text-transform:uppercase;">Key Mission Telemetry</h4>
        <ul style="list-style:none; margin-bottom:24px; display:flex; flex-direction:column; gap:10px;">
          ${data.highlights.map(h => `<li style="font-size:0.95rem; color:var(--text-primary); display:flex; align-items:start; gap:10px;"><i class="fas fa-check-circle" style="color:var(--neon-cyan); margin-top:4px;"></i><span>${h}</span></li>`).join('')}
        </ul>

        <h4 style="font-family:var(--font-display); font-size:0.95rem; color:var(--neon-cyan); letter-spacing:1px; margin-bottom:12px; text-transform:uppercase;">Constellation Tech Stack</h4>
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:30px;">
          ${data.stack.map(s => `<span style="font-family:var(--font-sub); font-size:0.8rem; color:var(--text-highlight); background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.25); padding:4px 10px; border-radius:6px;">${s}</span>`).join('')}
        </div>

        <div style="display:flex; gap:16px; flex-wrap:wrap;">
          <a href="${data.liveUrl}" target="_blank" class="cosmic-btn-primary" style="padding:10px 24px; font-size:0.85rem;"><i class="fas fa-external-link-alt"></i> Launch Live Orbit</a>
          <a href="${data.githubUrl}" target="_blank" class="cosmic-btn-secondary" style="padding:10px 24px; font-size:0.85rem;"><i class="fab fa-github"></i> Inspect Source</a>
        </div>
      `;

      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  });
}

/* ==========================================================================
   10. TRANSMISSION FORM (CONTACT UPLINK)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('cosmic-transmission-form');
  const statusMsg = document.getElementById('transmission-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('comms-name').value.trim();
    const email = document.getElementById('comms-email').value.trim();
    const subject = document.getElementById('comms-subject').value.trim();
    const message = document.getElementById('comms-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required transmission coordinates!');
      return;
    }

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;

    // Simulate Holographic Transmission Sequence
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-satellite-dish fa-spin"></i> Transmitting Signal to Hammadullah...';

    if (window.galaxyEngine) {
      window.galaxyEngine.triggerWarpEffect();
    }

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (statusMsg) {
        statusMsg.innerHTML = '<i class="fas fa-check-circle"></i> Transmission Received! Hammadullah has logged your cosmic signal and will establish contact shortly.';
        statusMsg.className = 'transmission-status-msg success';
        statusMsg.style.display = 'block';

        setTimeout(() => {
          statusMsg.style.display = 'none';
        }, 8000);
      }
    }, 1600);
  });
}

/* ==========================================================================
   11. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.cosmic-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   12. 3D HOLOGRAPHIC PORTRAIT MOUSE TILT
   ========================================================================== */
function initPortrait3DTilt() {
  const card = document.getElementById('hero-portrait-card');
  const scene = document.querySelector('.hologram-3d-scene');
  if (!card || !scene) return;

  scene.addEventListener('mousemove', (e) => {
    const rect = scene.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    card.style.animation = 'none';
    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`;
  });

  scene.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setTimeout(() => {
      card.style.animation = 'float3DCircle 5s ease-in-out infinite alternate';
    }, 300);
  });
}

