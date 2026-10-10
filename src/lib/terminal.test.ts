import { describe, it, expect } from 'vitest';
import { KNOWN_APPS, runCommand, type TerminalContext } from './terminal';

const ctx: TerminalContext = {
  helpTitle: 'available:',
  commands: [
    { cmd: 'help', desc: 'help' },
    { cmd: 'open <app>', desc: 'open app' },
  ],
  whoami: ['raul@nostromo'],
  unknown: 'unknown command:',
  opened: 'opening',
};

describe('runCommand', () => {
  it('ignores empty input', () => {
    expect(runCommand('   ', ctx)).toEqual({});
  });

  it('lists help', () => {
    const result = runCommand('help', ctx);
    expect(result.lines?.[0]).toBe('available:');
    expect(result.lines).toHaveLength(3);
  });

  it('returns the profile for whoami', () => {
    expect(runCommand('whoami', ctx).lines).toEqual(['raul@nostromo']);
  });

  it('lists known apps for ls', () => {
    const result = runCommand('ls', ctx);
    expect(result.lines).toEqual(KNOWN_APPS.map((app) => `${app}/`));
  });

  it('opens a known app', () => {
    const result = runCommand('open projects', ctx);
    expect(result.action).toEqual({ type: 'open', app: 'projects' });
  });

  it('rejects an unknown app', () => {
    const result = runCommand('open github', ctx);
    expect(result.action).toBeUndefined();
    expect(result.lines?.[0]).toContain('open github');
  });

  it('switches language', () => {
    expect(runCommand('lang en', ctx).action).toEqual({ type: 'lang', locale: 'en' });
    expect(runCommand('lang xx', ctx).action).toBeUndefined();
  });

  it('switches to reader mode', () => {
    expect(runCommand('mode reader', ctx).action).toEqual({ type: 'mode', mode: 'reader' });
  });

  it('clears the screen', () => {
    expect(runCommand('clear', ctx).clear).toBe(true);
  });

  it('reports unknown commands', () => {
    expect(runCommand('sudo rm', ctx).lines?.[0]).toBe('unknown command: sudo');
  });

  it('is case-sensitive like a real shell', () => {
    expect(runCommand('HELP', ctx).lines?.[0]).toBe('unknown command: HELP');
  });
});
