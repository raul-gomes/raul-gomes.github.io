// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { WindowManager, type OpenWindowInfo } from './window-manager';

let layer: HTMLElement;
let snapshots: OpenWindowInfo[][];
let wm: WindowManager;

beforeEach(() => {
  document.body.innerHTML = '<div class="win-layer" data-layer></div>';
  layer = document.querySelector<HTMLElement>('[data-layer]')!;
  Object.defineProperty(layer, 'clientWidth', { value: 800, configurable: true });
  Object.defineProperty(layer, 'clientHeight', { value: 600, configurable: true });
  snapshots = [];
  wm = new WindowManager(layer, (open) => snapshots.push(open));
});

describe('WindowManager', () => {
  it('opens a window and reports it', () => {
    wm.open({ id: 'about', title: 'sobre.txt', content: '<p>hi</p>' });
    expect(wm.isOpen('about')).toBe(true);
    expect(layer.querySelectorAll('.app-window')).toHaveLength(1);
    expect(snapshots.at(-1)?.[0]).toMatchObject({ id: 'about', minimized: false });
  });

  it('focuses an already open window instead of duplicating', () => {
    wm.open({ id: 'about', title: 'sobre.txt', content: '<p>hi</p>' });
    wm.open({ id: 'about', title: 'sobre.txt', content: '<p>hi</p>' });
    expect(layer.querySelectorAll('.app-window')).toHaveLength(1);
  });

  it('minimizes and restores', () => {
    wm.open({ id: 'stack', title: 'stack', content: '' });
    wm.minimize('stack');
    expect(snapshots.at(-1)?.[0].minimized).toBe(true);
    expect(wm.isOpen('stack')).toBe(true);
    wm.toggle('stack');
    expect(snapshots.at(-1)?.[0].minimized).toBe(false);
  });

  it('closes a window and removes it from the DOM', () => {
    wm.open({ id: 'contact', title: 'contato', content: '' });
    wm.close('contact');
    expect(wm.isOpen('contact')).toBe(false);
    expect(layer.querySelectorAll('.app-window')).toHaveLength(0);
  });

  it('keeps multiple windows and marks the focused one', () => {
    wm.open({ id: 'a', title: 'a', content: '' });
    wm.open({ id: 'b', title: 'b', content: '' });
    const focused = layer.querySelectorAll('[data-focused="true"]');
    expect(focused).toHaveLength(1);
    expect((focused[0] as HTMLElement).dataset.winId).toBe('b');
  });

  it('invokes onOpen with the created element', () => {
    let received: HTMLElement | null = null;
    wm.open({ id: 'term', title: 'terminal', content: '', onOpen: (el) => (received = el) });
    expect(received).not.toBeNull();
    expect((received as HTMLElement | null)?.dataset.winId).toBe('term');
  });
});
