import { WindowManager, type OpenWindowInfo } from './window-manager';
import { runCommand, type TerminalContext } from '../lib/terminal';
import { setMode } from './mode-controller';
import { pathForLocale } from '../lib/i18n';
import { iconSvg } from '../lib/icons';
import type { Mode } from '../lib/mode';

export interface GalleryImage {
  src: string;
  caption?: string;
}

export interface ContentLink {
  label: string;
  href: string;
}

export interface DesktopDetail {
  title: string;
  tagline?: string;
  bodyHtml: string;
  tags: string[];
  status?: 'live' | 'wip' | 'placeholder';
  links: ContentLink[];
  gallery: GalleryImage[];
  cover?: string;
  company?: string;
  period?: string;
}

export type NodeKind = 'folder' | 'document' | 'link' | 'terminal';

export interface DesktopNode {
  id: string;
  label: string;
  icon: string;
  kind: NodeKind;
  href?: string;
  external?: boolean;
  intro?: string;
  children?: DesktopNode[];
  detail?: DesktopDetail;
}

export interface DesktopPayload {
  locale: 'pt' | 'en';
  ui: {
    apps: { about: string; projects: string; experience: string; education: string; skills: string; contact: string; terminal: string; cv: string };
    actions: { powerOn: string; downloadCv: string; openApp: string };
    boot: string[];
    desktop: {
      welcome: string;
      hint: string;
      selectHint: string;
      fileManager: string;
      readme: string;
      noScreenshot: string;
      awards: string;
      certifications: string;
      location: string;
      statusLabels: { live: string; wip: string; placeholder: string };
    };
    terminal: TerminalContext & { inputLabel: string; promptLabel: string };
  };
  profile: {
    name: string;
    handle: string;
    role: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    cvPath: string;
    bioShort: string;
  };
  nodes: DesktopNode[];
}

export function bootDesktop(root: HTMLElement, payload: DesktopPayload): void {
  const power = root.querySelector<HTMLElement>('[data-power]');
  const boot = root.querySelector<HTMLElement>('[data-boot]');
  const desk = root.querySelector<HTMLElement>('[data-desk]');
  const layer = root.querySelector<HTMLElement>('[data-win-layer]');
  const taskbarApps = root.querySelector<HTMLElement>('[data-taskbar-apps]');
  const iconGrid = root.querySelector<HTMLElement>('[data-icon-grid]');
  const powerBtn = root.querySelector<HTMLButtonElement>('[data-power-on]');

  if (!desk || !layer || !taskbarApps || !boot || !iconGrid) return;

  const wm = new WindowManager(layer, syncTaskbar);
  const index = new Map<string, DesktopNode>();

  const register = (nodes: DesktopNode[]): void => {
    for (const node of nodes) {
      index.set(node.id, node);
      if (node.children) register(node.children);
    }
  };
  register(payload.nodes);

  let selected: HTMLElement | null = null;

  function openNode(node: DesktopNode): void {
    if (node.kind === 'folder') {
      wm.open({
        id: `folder-${node.id}`,
        title: node.label,
        content: renderFolder(node, payload),
        width: 40,
        height: 26,
        onOpen: (el) => wireFolder(el),
      });
      return;
    }
    if (node.kind === 'document') {
      wm.open({
        id: `doc-${node.id}`,
        title: node.label,
        content: renderDetail(node, payload),
        width: 44,
        height: 30,
      });
      return;
    }
    if (node.kind === 'terminal') {
      openTerminal();
      return;
    }
    if (node.kind === 'link' && node.href) {
      if (node.external) window.open(node.href, '_blank', 'noopener');
      else window.location.href = node.href;
    }
  }

  function openNodeById(id: string): void {
    const node = index.get(id);
    if (node) openNode(node);
  }

  function wireFolder(win: HTMLElement): void {
    win.querySelectorAll<HTMLElement>('[data-node]').forEach((row) => {
      const node = () => index.get(row.dataset.node ?? '');
      row.addEventListener('click', () => {
        win.querySelectorAll<HTMLElement>('[data-node]').forEach((r) => (r.dataset.selected = 'false'));
        row.dataset.selected = 'true';
      });
      row.addEventListener('dblclick', () => {
        const target = node();
        if (target) openNode(target);
      });
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          const target = node();
          if (target) openNode(target);
        }
      });
    });
  }

  function openTerminal(): void {
    wm.open({
      id: 'terminal',
      title: payload.ui.apps.terminal,
      content: renderTerminal(payload),
      width: 48,
      height: 24,
      onOpen: (el) => wireTerminal(el),
    });
  }

  function syncTaskbar(open: OpenWindowInfo[]): void {
    if (!taskbarApps) return;
    taskbarApps.innerHTML = '';
    for (const item of open) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'taskbar__task';
      btn.dataset.win = item.id;
      btn.dataset.active = item.minimized ? 'false' : 'true';
      btn.textContent = item.title;
      btn.addEventListener('click', () => wm.toggle(item.id));
      taskbarApps.appendChild(btn);
    }
  }

  function renderIcons(grid: HTMLElement): void {
    grid.innerHTML = '';
    const positions = loadPositions();
    const iconW = 136;
    const iconH = 88;
    const gapX = 8;
    const gapY = 8;
    const margin = 16;
    const availH = window.innerHeight - 2.75 * 16 - margin;
    const perCol = Math.max(1, Math.floor((availH + gapY) / (iconH + gapY)));
    const placed: HTMLButtonElement[] = [];

    payload.nodes.forEach((node, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'desk-icon';
      btn.dataset.node = node.id;
      btn.dataset.selected = 'false';
      btn.innerHTML = `<span class="desk-icon__img">${iconSvg(node.icon, 44)}</span><span class="desk-icon__label">${escapeHtml(node.label)}</span>`;

      const col = Math.floor(i / perCol);
      const row = i % perCol;
      const pos = positions[node.id] ?? { x: margin + col * (iconW + gapX), y: margin + row * (iconH + gapY) };
      btn.style.left = `${pos.x}px`;
      btn.style.top = `${pos.y}px`;

      btn.addEventListener('click', () => {
        if (selected) selected.dataset.selected = 'false';
        selected = btn;
        btn.dataset.selected = 'true';
      });
      btn.addEventListener('dblclick', () => openNode(node));
      btn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') openNode(node);
      });
      makeDraggable(btn, grid, (x, y) => {
        positions[node.id] = { x, y };
        savePositions(positions);
      });

      grid.appendChild(btn);
      placed.push(btn);
    });

    window.addEventListener('resize', () => {
      for (const btn of placed) {
        const x = clamp(Number.parseFloat(btn.style.left) || 0, 0, Math.max(0, grid.clientWidth - btn.offsetWidth));
        const y = clamp(Number.parseFloat(btn.style.top) || 0, 0, Math.max(0, grid.clientHeight - btn.offsetHeight));
        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;
        positions[btn.dataset.node ?? ''] = { x, y };
      }
      savePositions(positions);
    });
  }

  function wireTerminal(win: HTMLElement): void {
    const out = win.querySelector<HTMLElement>('[data-term-out]');
    const form = win.querySelector<HTMLFormElement>('[data-term-form]');
    const input = win.querySelector<HTMLInputElement>('[data-term-input]');
    if (!out || !form || !input) return;

    print(out, [`${payload.profile.handle} — ${payload.profile.role}`, payload.ui.terminal.helpTitle], 'term__line--dim');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const raw = input.value;
      input.value = '';
      echo(out, `${payload.ui.terminal.promptLabel} ${raw}`);
      const result = runCommand(raw, payload.ui.terminal);
      if (result.clear) {
        out.innerHTML = '';
        return;
      }
      if (result.action) {
        if (result.action.type === 'open') openNodeById(result.action.app);
        if (result.action.type === 'lang') window.location.assign(pathForLocale(result.action.locale));
        if (result.action.type === 'mode') setMode(result.action.mode as Mode);
      }
      if (result.lines?.length) print(out, result.lines);
    });

    window.setTimeout(() => input.focus(), 40);
    win.addEventListener('click', () => {
      if (!window.getSelection()?.toString()) input.focus();
    });
    wm.focus('terminal');
  }

  renderIcons(iconGrid);
  startClock(root);

  function start(): void {
    power?.remove();
    playBoot(boot!, payload.ui.boot, () => {
      desk!.hidden = false;
      boot!.remove();
    });
  }

  powerBtn?.addEventListener('click', start);
  powerBtn?.focus();
}

function renderFolder(node: DesktopNode, payload: DesktopPayload): string {
  const intro = node.intro ? `<div class="folder__intro">${node.intro}</div>` : '';
  const rows = (node.children ?? [])
    .map(
      (child) => `
      <li class="fm__item" data-node="${child.id}" data-selected="false" tabindex="0">
        <span class="fm__icon">${iconSvg(child.icon, 40)}</span>
        <span class="fm__name">${escapeHtml(child.label)}</span>
      </li>`,
    )
    .join('');
  const hint = `<p class="fm__hint">${escapeHtml(payload.ui.desktop.selectHint)}</p>`;
  return `<p class="fm__head">// ${escapeHtml(node.label)} — ${escapeHtml(payload.ui.desktop.fileManager)}</p>${intro}<ul class="fm">${rows}</ul>${hint}`;
}

function renderDetail(node: DesktopNode, payload: DesktopPayload): string {
  const detail = node.detail;
  if (!detail) return '';
  const cover = detail.cover
    ? `<img class="detail__cover" src="${detail.cover}" alt="${escapeHtml(detail.title)}" loading="lazy" />`
    : '';
  const gallery = detail.gallery.length
    ? `<ul class="detail__gallery">${detail.gallery
        .map(
          (img) => `<li><figure><img src="${img.src}" alt="${escapeHtml(img.caption ?? detail.title)}" loading="lazy" />${
            img.caption ? `<figcaption>${escapeHtml(img.caption)}</figcaption>` : ''
          }</figure></li>`,
        )
        .join('')}</ul>`
    : '';
  const meta = [detail.company, detail.period].filter(Boolean).map((v) => escapeHtml(String(v))).join(' · ');
  const tags = detail.tags.length ? `<ul class="tags">${detail.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>` : '';
  const status = detail.status
    ? `<span class="status" data-status="${detail.status}">${escapeHtml(payload.ui.desktop.statusLabels[detail.status])}</span>`
    : '';
  const links = detail.links.length
    ? detail.links
        .map((l) => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">[${escapeHtml(l.label)}]</a>`)
        .join(' ')
    : '';
  const body = detail.bodyHtml ? `<div class="detail__body">${detail.bodyHtml}</div>` : '';
  return `
    ${cover}
    <h2 class="detail__title">${escapeHtml(detail.title)}</h2>
    ${detail.tagline ? `<p class="detail__tagline">${escapeHtml(detail.tagline)}</p>` : ''}
    ${meta ? `<p class="detail__meta">${meta}</p>` : ''}
    ${gallery}
    ${body}
    ${tags}
    <div class="detail__footer">${status} ${links}</div>`;
}

function renderTerminal(payload: DesktopPayload): string {
  return `
    <div class="term" data-term>
      <div class="term__out" data-term-out></div>
      <form class="term__form" data-term-form>
        <label class="term__prompt" for="term-input">${escapeHtml(payload.ui.terminal.promptLabel)}</label>
        <input id="term-input" class="term__input" data-term-input autocomplete="off" spellcheck="false"
          aria-label="${escapeHtml(payload.ui.terminal.inputLabel)}" />
      </form>
    </div>`;
}

function playBoot(boot: HTMLElement, lines: string[], done: () => void): void {
  boot.hidden = false;
  boot.innerHTML = '';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    boot.innerHTML = lines.map((line) => `<p class="boot__line">${escapeHtml(line)}</p>`).join('');
    window.setTimeout(done, 250);
    return;
  }
  let i = 0;
  const tick = () => {
    if (i >= lines.length) {
      window.setTimeout(done, 320);
      return;
    }
    const p = document.createElement('p');
    p.className = 'boot__line';
    p.textContent = lines[i];
    boot.appendChild(p);
    i += 1;
    window.setTimeout(tick, 260);
  };
  tick();
}

function echo(out: HTMLElement, line: string): void {
  print(out, [line], 'term__line--echo');
}

function print(out: HTMLElement, lines: string[], className = ''): void {
  for (const line of lines) {
    const p = document.createElement('div');
    p.className = `term__line ${className}`.trim();
    p.textContent = line;
    out.appendChild(p);
  }
  out.scrollTop = out.scrollHeight;
}

function startClock(root: HTMLElement): void {
  const clock = root.querySelector<HTMLElement>('[data-clock]');
  if (!clock) return;
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  tick();
  window.setInterval(tick, 1000);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface IconPosition {
  x: number;
  y: number;
}

const POSITIONS_KEY = 'retroos:desk-icons:v1';

function loadPositions(): Record<string, IconPosition> {
  try {
    const raw = localStorage.getItem(POSITIONS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, IconPosition>) : {};
  } catch {
    return {};
  }
}

function savePositions(positions: Record<string, IconPosition>): void {
  try {
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
  } catch {
    /* storage unavailable */
  }
}

function makeDraggable(el: HTMLElement, bounds: HTMLElement, onEnd: (x: number, y: number) => void): void {
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  const onMove = (event: PointerEvent) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!moved && Math.hypot(dx, dy) > 4) {
      moved = true;
      el.dataset.dragging = 'true';
    }
    if (!moved) return;
    const maxX = Math.max(0, bounds.clientWidth - el.offsetWidth);
    const maxY = Math.max(0, bounds.clientHeight - el.offsetHeight);
    el.style.left = `${clamp(originX + dx, 0, maxX)}px`;
    el.style.top = `${clamp(originY + dy, 0, maxY)}px`;
  };

  const onUp = (event: PointerEvent) => {
    el.releasePointerCapture?.(event.pointerId);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    if (dragging && moved) {
      onEnd(Number.parseFloat(el.style.left) || 0, Number.parseFloat(el.style.top) || 0);
    }
    dragging = false;
    delete el.dataset.dragging;
  };

  el.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragging = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    originX = Number.parseFloat(el.style.left) || 0;
    originY = Number.parseFloat(el.style.top) || 0;
    el.setPointerCapture?.(event.pointerId);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
