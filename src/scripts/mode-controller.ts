import { MODE_KEY, MODE_PARAM, otherMode, type Mode } from '../lib/mode';

export function currentMode(): Mode {
  const attr = document.documentElement.dataset.mode;
  return attr === 'desktop' ? 'desktop' : 'reader';
}

export function setMode(mode: Mode): void {
  try {
    localStorage.setItem(MODE_KEY, mode);
    const url = new URL(window.location.href);
    url.searchParams.set(MODE_PARAM, mode);
    window.location.replace(url.href);
  } catch {
    window.location.reload();
  }
}

export function toggleMode(): void {
  setMode(otherMode(currentMode()));
}
