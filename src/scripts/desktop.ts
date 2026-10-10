import { WindowManager, type OpenWindowInfo } from './window-manager';
import { runCommand, type TerminalContext } from '../lib/terminal';
import { setMode } from './mode-controller';
import { pathForLocale } from '../lib/i18n';
import type { Mode } from '../lib/mode';

export interface DesktopPayload {
  locale: 'pt' | 'en';
  ui: {
    apps: { about: string; projects: string; stack: string; terminal: string; contact: string; cv: string };
    actions: { powerOn: string; downloadCv: string; openApp: string };
    boot: string[];
    desktop: {
      welcome: string;
      hint: string;
      fileManager: string;
      readme: string;
      noScreenshot: string;
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
    bioLong: string;
  };
  projects: {
    id: string;
    title: string;
    tagline: string;
    readme: string;
    stack: string[];
    status: 'live' | 'wip' | 'placeholder';
    links?: { repo?: string; demo?: string };
    screenshot?: string;
  }[];
  stack: { label: string; items: string[] }[];
}

export function bootDesktop(root: HTMLElement, payload: DesktopPayload): void {
  const power = root.querySelector<HTMLElement>('[data-power]');
  const boot = root.querySelector<HTMLElement>('[data-boot]');
  const desk = root.querySelector<HTMLElement>('[data-desk]');
  const layer = root.querySelector<HTMLElement>('[data-win-layer]');
  const taskbarApps = root.querySelector<HTMLElement>('[data-taskbar-apps]');
  const powerBtn = root.querySelector<HTMLButtonElement>('[data-power-on]');

  if (!desk || !layer || !taskbarApps || !boot) return;

  const wm = new WindowManager(layer, (open) => syncTaskbar(open));

  const launchers: { app: string; label: string }[] = [
    { app: 'about', label: payload.ui.apps.about },
    { app: 'projects', label: payload.ui.apps.projects },
    { app: 'stack', label: payload.ui.apps.stack },
    { app: 'terminal', label: payload.ui.apps.terminal },
    { app: 'contact', label: payload.ui.apps.contact },
    { app: 'cv', label: payload.ui.apps.cv },
  ];

  function openApp(app: string): void {
    switch (app) {
      case 'about':
        wm.open({ id: 'about', title: payload.ui.apps.about, content: renderAbout(payload), width: 44, height: 22 });
        break;
      case 'projects':
        wm.open({
          id: 'projects',
          title: payload.ui.apps.projects,
          content: renderProjects(payload),
          width: 46,
          height: 24,
          onOpen: wireProjects,
        });
        break;
      case 'stack':
        wm.open({ id: 'stack', title: payload.ui.apps.stack, content: renderStack(payload), width: 44, height: 24 });
        break;
      case 'contact':
        wm.open({ id: 'contact', title: payload.ui.apps.contact, content: renderContact(payload), width: 38, height: 18 });
        break;
      case 'terminal':
        wm.open({
          id: 'terminal',
          title: payload.ui.apps.terminal,
          content: renderTerminal(payload),
          width: 48,
          height: 22,
          onOpen: (el) => wireTerminal(el, payload, openApp, wm),
        });
        break;
      case 'cv':
        window.location.href = payload.profile.cvPath;
        break;
    }
  }

  function wireProjects(win: HTMLElement): void {
    win.querySelectorAll<HTMLElement>('[data-project]').forEach((row) => {
      row.addEventListener('click', () => {
        const project = payload.projects.find((p) => p.id === row.dataset.project);
        if (!project) return;
        wm.open({
          id: `project-${project.id}`,
          title: project.title,
          content: renderProjectDetail(project, payload),
          width: 46,
          height: 24,
        });
      });
    });
  }

  function syncTaskbar(open: OpenWindowInfo[]): void {
    const active = new Set(open.filter((w) => !w.minimized).map((w) => w.id));
    taskbarApps?.querySelectorAll<HTMLElement>('[data-app]').forEach((btn) => {
      btn.dataset.active = active.has(btn.dataset.app ?? '') ? 'true' : 'false';
    });
  }

  for (const launcher of launchers) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'taskbar__app';
    btn.dataset.app = launcher.app;
    btn.dataset.active = 'false';
    btn.textContent = `[ ${launcher.label} ]`;
    btn.addEventListener('click', () => {
      if (wm.isOpen(launcher.app)) wm.toggle(launcher.app);
      else openApp(launcher.app);
    });
    taskbarApps.appendChild(btn);
  }

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

function renderAbout(payload: DesktopPayload): string {
  const paragraphs = payload.profile.bioLong.split(/\n{2,}/).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  return `<p>${escapeHtml(payload.profile.bioShort)}</p>${paragraphs}`;
}

function renderProjects(payload: DesktopPayload): string {
  const rows = payload.projects
    .map(
      (p) => `
      <li data-project="${p.id}" tabindex="0">
        <span class="fm__icon">[ ]</span>
        <span class="fm__name">${escapeHtml(p.title)}</span>
        <span class="fm__status status" data-status="${p.status}">${escapeHtml(
          payload.ui.desktop.statusLabels[p.status],
        )}</span>
      </li>`,
    )
    .join('');
  return `<p class="fm__head">// ${escapeHtml(payload.ui.desktop.fileManager)}</p><ul class="fm">${rows}</ul>`;
}

function renderProjectDetail(project: DesktopPayload['projects'][number], payload: DesktopPayload): string {
  const readme = project.readme.split(/\n{2,}/).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  const tags = project.stack.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
  const shot = project.screenshot
    ? `<img class="project__shot" src="${project.screenshot}" alt="${escapeHtml(project.title)}" loading="lazy" />`
    : `<div class="fm__empty">${escapeHtml(payload.ui.desktop.noScreenshot)}</div>`;
  const links = [
    project.links?.repo ? `<a href="${project.links.repo}" target="_blank" rel="noopener noreferrer">[repo]</a>` : '',
    project.links?.demo ? `<a href="${project.links.demo}" target="_blank" rel="noopener noreferrer">[demo]</a>` : '',
  ].join(' ');
  return `
    <p class="project__tagline">${escapeHtml(project.tagline)}</p>
    ${shot}
    ${readme}
    <ul class="tags">${tags}</ul>
    <div class="project__footer">
      <span class="status" data-status="${project.status}">${escapeHtml(
        payload.ui.desktop.statusLabels[project.status],
      )}</span>
      ${links}
    </div>`;
}

function renderStack(payload: DesktopPayload): string {
  const groups = payload.stack
    .map(
      (g) => `<div class="stack-group"><h3>${escapeHtml(g.label)}</h3><ul>${g.items
        .map((i) => `<li>${escapeHtml(i)}</li>`)
        .join('')}</ul></div>`,
    )
    .join('');
  return `<div class="stack-grid">${groups}</div>`;
}

function renderContact(payload: DesktopPayload): string {
  const p = payload.profile;
  return `
    <div class="contact">
      <div class="contact__row"><span class="contact__key">email</span><a href="mailto:${p.email}">${p.email}</a></div>
      <div class="contact__row"><span class="contact__key">github</span><a href="${p.github}" target="_blank" rel="noopener noreferrer">${p.github.replace('https://', '')}</a></div>
      <div class="contact__row"><span class="contact__key">linkedin</span><a href="${p.linkedin}" target="_blank" rel="noopener noreferrer">${p.linkedin.replace('https://www.', '')}</a></div>
      <div class="contact__row"><span class="contact__key">local</span><span>${escapeHtml(p.location)}</span></div>
    </div>
    <a class="cta" href="${p.cvPath}" download>${escapeHtml(payload.ui.actions.downloadCv)} ↓</a>`;
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

function wireTerminal(
  win: HTMLElement,
  payload: DesktopPayload,
  openApp: (app: string) => void,
  wm: WindowManager,
): void {
  const out = win.querySelector<HTMLElement>('[data-term-out]');
  const form = win.querySelector<HTMLFormElement>('[data-term-form]');
  const input = win.querySelector<HTMLInputElement>('[data-term-input]');
  if (!out || !form || !input) return;

  print(
    out,
    [
      `${payload.profile.handle} — ${payload.profile.role}`,
      payload.ui.terminal.helpTitle,
    ],
    'term__line--dim',
  );

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
      if (result.action.type === 'open') openApp(result.action.app);
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
