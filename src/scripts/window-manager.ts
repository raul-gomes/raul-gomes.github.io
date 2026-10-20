export interface OpenWindowOptions {
  id: string;
  title: string;
  content: string;
  width?: number;
  height?: number;
  onOpen?: (window: HTMLElement) => void;
}

export interface OpenWindowInfo {
  id: string;
  title: string;
  minimized: boolean;
}

interface WinRecord {
  id: string;
  title: string;
  el: HTMLElement;
  minimized: boolean;
}

const DEFAULT_W = 30;
const DEFAULT_H = 20;

export class WindowManager {
  private readonly layer: HTMLElement;
  private readonly onChange: (open: OpenWindowInfo[]) => void;
  private readonly wins = new Map<string, WinRecord>();
  private z = 10;
  private cascade = 0;

  constructor(layer: HTMLElement, onChange: (open: OpenWindowInfo[]) => void) {
    this.layer = layer;
    this.onChange = onChange;
    this.layer.addEventListener('pointerdown', (event) => {
      const win = (event.target as HTMLElement).closest<HTMLElement>('.app-window');
      if (win?.dataset.winId) this.focus(win.dataset.winId);
    });
  }

  list(): OpenWindowInfo[] {
    return [...this.wins.values()].map((w) => ({ id: w.id, title: w.title, minimized: w.minimized }));
  }

  isOpen(id: string): boolean {
    return this.wins.has(id);
  }

  open(options: OpenWindowOptions): void {
    const existing = this.wins.get(options.id);
    if (existing) {
      this.restore(options.id);
      this.focus(options.id);
      return;
    }

    const width = (options.width ?? DEFAULT_W) * 16;
    const height = (options.height ?? DEFAULT_H) * 16;
    const offset = (this.cascade++ % 6) * 28;

    const el = document.createElement('section');
    el.className = 'app-window';
    el.dataset.winId = options.id;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', options.title);
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    const left = clamp(300 + offset, 8, Math.max(8, this.layer.clientWidth - width - 8));
    const top = clamp(32 + offset, 8, Math.max(8, this.layer.clientHeight - height - 8));
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    el.innerHTML = `
      <div class="app-window__bar" data-drag>
        <span class="app-window__title">${escapeHtml(options.title)}</span>
        <span class="app-window__controls">
          <button type="button" data-act="minimize" aria-label="Minimizar">_</button>
          <button type="button" data-act="close" aria-label="Fechar">×</button>
        </span>
      </div>
      <div class="app-window__body" data-window-body></div>
    `;

    const body = el.querySelector<HTMLElement>('[data-window-body]');
    if (body) body.innerHTML = options.content;

    el.querySelector('[data-act="minimize"]')?.addEventListener('click', (event) => {
      event.stopPropagation();
      this.minimize(options.id);
    });
    el.querySelector('[data-act="close"]')?.addEventListener('click', (event) => {
      event.stopPropagation();
      this.close(options.id);
    });

    this.bindDrag(el, el.querySelector<HTMLElement>('[data-drag]'));

    this.layer.appendChild(el);
    this.wins.set(options.id, { id: options.id, title: options.title, el, minimized: false });
    this.focus(options.id);
    options.onOpen?.(el);
    this.emit();
  }

  focus(id: string): void {
    const win = this.wins.get(id);
    if (!win || win.minimized) return;
    for (const other of this.wins.values()) other.el.dataset.focused = 'false';
    win.el.dataset.focused = 'true';
    win.el.style.zIndex = String(++this.z);
  }

  minimize(id: string): void {
    const win = this.wins.get(id);
    if (!win) return;
    win.minimized = true;
    win.el.hidden = true;
    win.el.dataset.focused = 'false';
    this.emit();
  }

  restore(id: string): void {
    const win = this.wins.get(id);
    if (!win) return;
    win.minimized = false;
    win.el.hidden = false;
    this.emit();
  }

  toggle(id: string): void {
    const win = this.wins.get(id);
    if (!win) return;
    if (win.minimized) {
      this.restore(id);
      this.focus(id);
    } else {
      this.minimize(id);
    }
  }

  close(id: string): void {
    const win = this.wins.get(id);
    if (!win) return;
    win.el.remove();
    this.wins.delete(id);
    const remaining = [...this.wins.values()].filter((w) => !w.minimized);
    const top = remaining[remaining.length - 1];
    if (top) this.focus(top.id);
    this.emit();
  }

  closeAll(): void {
    for (const win of this.wins.values()) win.el.remove();
    this.wins.clear();
    this.emit();
  }

  private emit(): void {
    this.onChange(this.list());
  }

  private bindDrag(el: HTMLElement, handle: HTMLElement | null): void {
    if (!handle) return;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;
    let dragging = false;

    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const maxLeft = this.layer.clientWidth - el.offsetWidth;
      const maxTop = this.layer.clientHeight - el.offsetHeight;
      const left = clamp(originLeft + (event.clientX - startX), 0, Math.max(0, maxLeft));
      const top = clamp(originTop + (event.clientY - startY), 0, Math.max(0, maxTop));
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    };

    const onUp = (event: PointerEvent) => {
      dragging = false;
      handle.releasePointerCapture?.(event.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    handle.addEventListener('pointerdown', (event) => {
      if ((event.target as HTMLElement).closest('button')) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      originLeft = el.offsetLeft;
      originTop = el.offsetTop;
      handle.setPointerCapture?.(event.pointerId);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
