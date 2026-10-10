interface Streak {
  x: number;
  y: number;
  len: number;
  speed: number;
  color: string;
}

const COLORS = ['#ffb000', '#00e5ff', '#ff2d95'];

export function startRain(canvas: HTMLCanvasElement): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let width = 0;
  let height = 0;
  let dpr = 1;
  let streaks: Streak[] = [];
  let raf = 0;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(24, Math.floor(width / 34));
    streaks = Array.from({ length: count }, () => spawn(width, height, true));
  };

  const frame = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    for (const s of streaks) {
      const grad = ctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, s.color);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - s.len);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      s.y += s.speed;
      if (s.y - s.len > height) Object.assign(s, spawn(width, height, false));
    }
    raf = window.requestAnimationFrame(frame);
  };

  resize();
  window.addEventListener('resize', resize);
  raf = window.requestAnimationFrame(frame);

  return () => {
    window.cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}

function spawn(width: number, height: number, anywhere: boolean): Streak {
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : -20,
    len: 8 + Math.random() * 26,
    speed: 1.5 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}
