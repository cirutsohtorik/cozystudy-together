// ========================================================
// CozyStudy: Parçacık ve Yağmur Motoru (Particle System)
// ========================================================

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.rainDrops = [];
    this.rainSplashes = [];
  }

  initForRoom(room) {
    this.particles = [];
    if (room === 'garden') {
      const petalColors = ['#ffccd5', '#ffb3c6', '#f48fb1', '#ffe5ec'];
      for (let i = 0; i < 35; i++) {
        this.particles.push({
          x: Math.random() * 640,
          y: Math.random() * 400,
          speedX: 14 + Math.random() * 12,
          speedY: 18 + Math.random() * 14,
          size: 1.8 + Math.random() * 1.6,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 2.5,
          color: petalColors[i % petalColors.length]
        });
      }
    } else if (room === 'cafe') {
      const emberColors = ['rgba(255, 220, 140, 0.7)', 'rgba(255, 170, 70, 0.65)', 'rgba(255, 240, 190, 0.8)'];
      for (let i = 0; i < 28; i++) {
        this.particles.push({
          x: Math.random() * 640,
          y: Math.random() * 400,
          speedX: (Math.random() - 0.5) * 12,
          speedY: -(14 + Math.random() * 16),
          size: 1.2 + Math.random() * 1.8,
          color: emberColors[i % emberColors.length]
        });
      }
    } else if (room === 'campus_path') {
      const leafColors = ['#52b788', '#74c69d', '#40916c', '#d8f3dc'];
      for (let i = 0; i < 28; i++) {
        this.particles.push({
          x: Math.random() * 640,
          y: Math.random() * 400,
          speedX: 16 + Math.random() * 14,
          speedY: 10 + Math.random() * 10,
          size: 2.0 + Math.random() * 1.4,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 3,
          color: leafColors[i % leafColors.length]
        });
      }
    } else if (room === 'dorm') {
      for (let i = 0; i < 20; i++) {
        this.particles.push({
          x: Math.random() * 640,
          y: Math.random() * 400,
          speedX: (Math.random() - 0.5) * 6,
          speedY: (Math.random() - 0.5) * 4 - 2,
          size: 1.0 + Math.random() * 1.5,
          color: 'rgba(255, 230, 160, 0.45)'
        });
      }
    } else {
      for (let i = 0; i < 25; i++) {
        this.particles.push({
          x: Math.random() * 640,
          y: Math.random() * 400,
          speedX: (Math.random() - 0.5) * 8 + 3,
          speedY: (Math.random() - 0.5) * 6 + 2,
          size: 1.1 + Math.random() * 1.4,
          color: 'rgba(255, 235, 170, 0.55)'
        });
      }
    }
  }

  initRain() {
    this.rainDrops = [];
    this.rainSplashes = [];
    for (let i = 0; i < 80; i++) {
      this.rainDrops.push({
        x: Math.random() * 640,
        y: Math.random() * 400,
        speedY: 340 + Math.random() * 120,
        speedX: 25 + Math.random() * 15,
        length: 8 + Math.random() * 8,
        alpha: 0.45 + Math.random() * 0.45
      });
    }
  }

  update(dt, isRaining) {
    // Parçacıklar
    this.particles.forEach(p => {
      p.x += p.speedX * dt;
      p.y += p.speedY * dt;
      if (p.rotation !== undefined) {
        p.rotation += p.rotSpeed * dt;
      }
      if (p.x > 640) p.x = 0;
      if (p.x < 0) p.x = 640;
      if (p.y > 400) p.y = 0;
      if (p.y < 0) p.y = 400;
    });

    // Yağmur fiziği
    if (isRaining) {
      this.rainDrops.forEach(d => {
        d.x += d.speedX * dt;
        d.y += d.speedY * dt;
        if (d.y > 390) {
          if (Math.random() > 0.6) {
            this.rainSplashes.push({
              x: d.x,
              y: d.y,
              radius: 1,
              maxRadius: 4 + Math.random() * 3,
              alpha: 0.7
            });
          }
          d.y = -10;
          d.x = Math.random() * 640;
        }
      });

      this.rainSplashes.forEach((s, idx) => {
        s.radius += 12 * dt;
        s.alpha -= 3.5 * dt;
        if (s.alpha <= 0 || s.radius >= s.maxRadius) {
          this.rainSplashes.splice(idx, 1);
        }
      });
    }
  }

  renderRain(ctx) {
    ctx.save();
    ctx.lineWidth = 1;
    this.rainDrops.forEach(d => {
      ctx.strokeStyle = `rgba(180, 210, 240, ${d.alpha * 0.65})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 2, d.y + d.length);
      ctx.stroke();
    });

    this.rainSplashes.forEach(s => {
      ctx.strokeStyle = `rgba(200, 225, 255, ${s.alpha * 0.5})`;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.radius, s.radius * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }
}
