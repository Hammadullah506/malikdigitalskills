/**
 * 3D GALAXY SIMULATOR & WEBGL ENGINE
 * Powered by Three.js
 * Generates an interactive spiral galaxy, celestial planets, shooting stars, and warp transitions.
 */

class GalaxyEngine {
  constructor() {
    this.container = document.getElementById('galaxy-canvas-container');
    this.canvas = document.getElementById('galaxy-canvas');
    if (!this.canvas || typeof THREE === 'undefined') return;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Galaxy Particle Parameters
    this.params = {
      count: 45000,
      size: 0.012,
      radius: 6.5,
      branches: 4,
      spin: 1.2,
      randomness: 0.4,
      power: 3.5,
      speedMultiplier: 1.0,
      insideColor: '#00f2fe',
      outsideColor: '#7928ca',
      coreColor: '#ffffff'
    };

    // Theme Palettes
    this.themes = {
      cyan: {
        insideColor: '#00f2fe',
        outsideColor: '#7928ca',
        coreColor: '#ffffff',
        accentCss: '#00f2fe'
      },
      magenta: {
        insideColor: '#ff007f',
        outsideColor: '#4facfe',
        coreColor: '#ffffff',
        accentCss: '#ff007f'
      },
      gold: {
        insideColor: '#ffb703',
        outsideColor: '#fb8500',
        coreColor: '#fff3b0',
        accentCss: '#ffb703'
      },
      emerald: {
        insideColor: '#00ffcc',
        outsideColor: '#0077b6',
        coreColor: '#e0fbfc',
        accentCss: '#00ffcc'
      }
    };

    // State & Interaction
    this.galaxyPoints = null;
    this.galaxyGeometry = null;
    this.galaxyMaterial = null;
    this.planets = [];
    this.shootingStars = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.isWarping = false;
    this.warpFactor = 0;
    this.targetWarpFactor = 0;
    this.scrollY = 0;
    this.targetScrollY = 0;

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030014, 0.08);

    // 2. Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    this.camera.position.set(0, 3.2, 5.5);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Generate Galaxy
    this.generateGalaxy();

    // 5. Generate Orbiting Planets
    this.generateCelestialPlanets();

    // 6. Generate Shooting Stars
    this.generateShootingStars();

    // 7. Event Listeners
    this.setupEvents();

    // 8. Start Animation Loop
    this.animate();
  }

  // Procedural Star Sprite Texture
  createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(240, 248, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(0, 242, 254, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  // Generate Spiral Galaxy
  generateGalaxy() {
    // Clean up existing if regenerating
    if (this.galaxyPoints !== null) {
      this.galaxyGeometry.dispose();
      this.galaxyMaterial.dispose();
      this.scene.remove(this.galaxyPoints);
    }

    const { count, radius, branches, spin, randomness, power } = this.params;

    this.galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const colorInside = new THREE.Color(this.params.insideColor);
    const colorOutside = new THREE.Color(this.params.outsideColor);
    const colorCore = new THREE.Color(this.params.coreColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Position along spiral arms
      const r = Math.random() * radius;
      const spinAngle = r * spin;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      // Exponential dispersion from center
      const randomX = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * (r * 0.6);
      const randomZ = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Color Gradient from Core to Outer Edge
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, r / radius);

      // Core brightest concentration
      if (r < radius * 0.18) {
        mixedColor.lerp(colorCore, 1 - (r / (radius * 0.18)));
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Individual particle scale variance
      scales[i] = Math.random() * 1.4 + 0.6;
    }

    this.galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.galaxyGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle Shader / Material
    this.galaxyMaterial = new THREE.PointsMaterial({
      size: this.params.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: this.createStarTexture(),
      transparent: true,
      opacity: 0.95
    });

    this.galaxyPoints = new THREE.Points(this.galaxyGeometry, this.galaxyMaterial);
    this.scene.add(this.galaxyPoints);
  }

  // Celestial Orbiting Planets & Ring Objects
  generateCelestialPlanets() {
    const planetConfigs = [
      { radius: 0.45, dist: 3.8, speed: 0.18, color: 0x00f2fe, ring: true, yOffset: 0.4 },
      { radius: 0.65, dist: 5.2, speed: 0.12, color: 0x7928ca, ring: true, yOffset: -0.5 },
      { radius: 0.35, dist: 2.6, speed: 0.25, color: 0xff007f, ring: false, yOffset: 0.2 },
      { radius: 0.5, dist: 6.8, speed: 0.08, color: 0x00ffcc, ring: true, yOffset: -0.3 }
    ];

    planetConfigs.forEach((cfg) => {
      const group = new THREE.Group();

      // Planet Sphere
      const sphereGeo = new THREE.SphereGeometry(cfg.radius, 32, 32);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.45
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Glowing Inner Core
      const coreGeo = new THREE.SphereGeometry(cfg.radius * 0.75, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.7
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      // Orbital Ring if enabled
      if (cfg.ring) {
        const ringGeo = new THREE.RingGeometry(cfg.radius * 1.3, cfg.radius * 1.8, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: cfg.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5;
        group.add(ring);
      }

      this.scene.add(group);
      this.planets.push({
        group,
        dist: cfg.dist,
        speed: cfg.speed,
        angle: Math.random() * Math.PI * 2,
        yOffset: cfg.yOffset
      });
    });
  }

  // Shooting Stars Particle Pool
  generateShootingStars() {
    for (let i = 0; i < 4; i++) {
      const lineGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(6);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(lineGeo, lineMat);
      this.scene.add(line);

      this.shootingStars.push({
        line,
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 1.2
      });
    }
  }

  spawnShootingStar() {
    const star = this.shootingStars.find(s => !s.active);
    if (!star) return;

    star.active = true;
    star.life = 0;
    star.maxLife = 0.8 + Math.random() * 0.6;

    // Random start position in upper space
    star.pos.set(
      (Math.random() - 0.5) * 12,
      2.5 + Math.random() * 3,
      (Math.random() - 0.5) * 6
    );

    // Diagonal high speed velocity
    star.vel.set(
      -4 - Math.random() * 4,
      -2 - Math.random() * 2,
      -1 - Math.random() * 2
    );

    star.line.material.opacity = 1;
  }

  // Warp Drive Jump Animation (called on navigation click)
  triggerWarpEffect() {
    this.targetWarpFactor = 1.0;
    if (window.cosmicAudio) {
      window.cosmicAudio.playWarpSound();
    }
    setTimeout(() => {
      this.targetWarpFactor = 0;
    }, 850);
  }

  // Theme Switcher
  setTheme(themeKey) {
    const theme = this.themes[themeKey];
    if (!theme) return;

    this.params.insideColor = theme.insideColor;
    this.params.outsideColor = theme.outsideColor;
    this.params.coreColor = theme.coreColor;

    // Re-generate particle colors smoothly
    this.generateGalaxy();

    // Update CSS Variable
    document.documentElement.style.setProperty('--neon-cyan', theme.insideColor);
    document.documentElement.style.setProperty('--theme-primary', theme.insideColor);
    document.documentElement.style.setProperty('--theme-secondary', theme.outsideColor);
  }

  // Speed Multiplier (Warp Core Slider)
  setSpeedMultiplier(multiplier) {
    this.params.speedMultiplier = parseFloat(multiplier);
  }

  setupEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Mouse Parallax
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Mobile Device Orientation
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        this.targetMouseX = (e.gamma / 45);
        this.targetMouseY = (e.beta / 45);
      }
    });

    // Scroll Camera Angle
    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetScrollY = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });
  }

  // Main Render Loop
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock.getElapsedTime();
    const delta = this.clock.getDelta();

    // Smooth Lerp Mouse & Scroll
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.06;
    this.warpFactor += (this.targetWarpFactor - this.warpFactor) * 0.12;

    // Rotate Galaxy Core with speed multiplier & warp factor
    if (this.galaxyPoints) {
      const baseRotationSpeed = 0.04 * this.params.speedMultiplier;
      const warpSpeed = this.warpFactor * 1.2;
      this.galaxyPoints.rotation.y = elapsedTime * (baseRotationSpeed + warpSpeed);

      // Subtle breathing scale
      const breath = Math.sin(elapsedTime * 0.8) * 0.02;
      this.galaxyPoints.scale.set(1 + breath, 1 + breath, 1 + breath);
    }

    // Orbit Planets
    this.planets.forEach((p) => {
      p.angle += p.speed * 0.015 * this.params.speedMultiplier;
      p.group.position.x = Math.cos(p.angle) * p.dist;
      p.group.position.z = Math.sin(p.angle) * p.dist;
      p.group.position.y = Math.sin(elapsedTime * 1.5 + p.dist) * 0.3 + p.yOffset;
      p.group.rotation.y += 0.01;
      p.group.rotation.x += 0.005;
    });

    // Shooting Stars Update
    if (Math.random() < 0.02) {
      this.spawnShootingStar();
    }

    this.shootingStars.forEach((s) => {
      if (!s.active) return;
      s.life += 0.016;

      s.pos.addScaledVector(s.vel, 0.035);

      const positions = s.line.geometry.attributes.position.array;
      // Head
      positions[0] = s.pos.x;
      positions[1] = s.pos.y;
      positions[2] = s.pos.z;
      // Tail
      positions[3] = s.pos.x - s.vel.x * 0.08;
      positions[4] = s.pos.y - s.vel.y * 0.08;
      positions[5] = s.pos.z - s.vel.z * 0.08;

      s.line.geometry.attributes.position.needsUpdate = true;

      // Fade out
      const progress = s.life / s.maxLife;
      s.line.material.opacity = Math.max(0, 1 - progress);

      if (progress >= 1) {
        s.active = false;
        s.line.material.opacity = 0;
      }
    });

    // Camera Dynamic Positioning & Warp Acceleration
    const defaultCamY = 3.2 - this.scrollY * 1.5;
    const defaultCamZ = 5.5 - this.scrollY * 2.0;

    // Warp pulls camera in fast
    const warpCamZOffset = -this.warpFactor * 2.5;

    this.camera.position.x = this.mouseX * 0.8;
    this.camera.position.y = defaultCamY + this.mouseY * 0.5;
    this.camera.position.z = defaultCamZ + warpCamZOffset;

    // Camera Look Target
    const targetY = -this.scrollY * 1.2;
    this.camera.lookAt(0, targetY, 0);

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Safe Global Galaxy Instance Initialization
function initGalaxyEngine() {
  if (!window.galaxyEngine || !window.galaxyEngine.renderer) {
    window.galaxyEngine = new GalaxyEngine();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGalaxyEngine);
} else {
  initGalaxyEngine();
}
window.addEventListener('load', initGalaxyEngine);

