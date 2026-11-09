import { describe, it, expect } from 'vitest';
import { runCommand, type TerminalContext, type TerminalNode } from './terminal';

const ctx: TerminalContext = {
  helpTitle: 'available:',
  commands: [
    { cmd: 'help', desc: 'help' },
    { cmd: 'open <app>', desc: 'open app' },
  ],
  whoami: ['raul@nostromo'],
  unknown: 'unknown command:',
  opened: 'opening',
  notFound: 'no such file or directory',
  notADirectory: 'not a directory',
  isADirectory: 'is a directory',
  missingOperand: 'missing operand',
};

const root: TerminalNode = {
  name: '/',
  kind: 'dir',
  children: [
    { name: 'sobre.txt', kind: 'file', nodeId: 'sobre', content: 'raul@nostromo' },
    {
      name: 'projetos',
      kind: 'dir',
      nodeId: 'projetos',
      children: [
        {
          name: 'cafe-com-bpo.txt',
          kind: 'file',
          nodeId: 'cafe-com-bpo',
          content: 'Café com BPO\nBPO financeiro',
        },
      ],
    },
    {
      name: 'contato',
      kind: 'dir',
      nodeId: 'contato',
      children: [{ name: 'email.url', kind: 'file', nodeId: 'email', content: 'mailto:raul@example.com' }],
    },
  ],
};

describe('runCommand', () => {
  it('ignores empty input', () => {
    expect(runCommand('   ', ctx, root)).toEqual({});
  });

  it('lists help', () => {
    const result = runCommand('help', ctx, root);
    expect(result.lines?.[0]).toBe('available:');
    expect(result.lines).toHaveLength(3);
  });

  it('returns the profile for whoami', () => {
    expect(runCommand('whoami', ctx, root).lines).toEqual(['raul@nostromo']);
  });

  it('lists the current directory', () => {
    expect(runCommand('ls', ctx, root).lines).toEqual(['contato/', 'projetos/', 'sobre.txt']);
  });

  it('lists a directory by path', () => {
    expect(runCommand('ls projetos', ctx, root).lines).toEqual(['cafe-com-bpo.txt']);
    expect(runCommand('ls /contato', ctx, root).lines).toEqual(['email.url']);
    expect(runCommand('ls', ctx, root, '/projetos').lines).toEqual(['cafe-com-bpo.txt']);
  });

  it('reports a missing path for ls', () => {
    expect(runCommand('ls nope', ctx, root).lines).toEqual(['ls: no such file or directory: nope']);
  });

  it('changes directory', () => {
    expect(runCommand('cd projetos', ctx, root).cwd).toBe('/projetos');
    expect(runCommand('cd /contato', ctx, root).cwd).toBe('/contato');
    expect(runCommand('cd ~', ctx, root).cwd).toBe('/');
    expect(runCommand('cd', ctx, root, '/projetos').cwd).toBe('/');
  });

  it('goes back with cd ..', () => {
    expect(runCommand('cd ..', ctx, root, '/projetos').cwd).toBe('/');
    expect(runCommand('cd ../contato', ctx, root, '/projetos').cwd).toBe('/contato');
    expect(runCommand('cd ..', ctx, root).cwd).toBe('/');
  });

  it('rejects cd into a file or missing path', () => {
    expect(runCommand('cd sobre.txt', ctx, root).lines).toEqual(['cd: not a directory: sobre.txt']);
    expect(runCommand('cd nope', ctx, root).lines).toEqual(['cd: no such file or directory: nope']);
  });

  it('prints a file with cat', () => {
    expect(runCommand('cat sobre.txt', ctx, root).lines).toEqual(['raul@nostromo']);
    expect(runCommand('cat projetos/cafe-com-bpo.txt', ctx, root).lines).toEqual([
      'Café com BPO',
      'BPO financeiro',
    ]);
  });

  it('rejects cat on directories and missing files', () => {
    expect(runCommand('cat projetos', ctx, root).lines).toEqual(['cat: is a directory: projetos']);
    expect(runCommand('cat nope', ctx, root).lines).toEqual(['cat: no such file or directory: nope']);
    expect(runCommand('cat', ctx, root).lines).toEqual(['cat: missing operand']);
  });

  it('prints the current directory with pwd', () => {
    expect(runCommand('pwd', ctx, root).lines).toEqual(['/']);
    expect(runCommand('pwd', ctx, root, '/projetos').lines).toEqual(['/projetos']);
  });

  it('opens a folder or file by path', () => {
    expect(runCommand('open projetos', ctx, root).action).toEqual({ type: 'open', app: 'projetos' });
    expect(runCommand('open projetos/cafe-com-bpo', ctx, root).action).toEqual({
      type: 'open',
      app: 'cafe-com-bpo',
    });
    expect(runCommand('open sobre', ctx, root).action).toEqual({ type: 'open', app: 'sobre' });
  });

  it('rejects an unknown app', () => {
    const result = runCommand('open github', ctx, root);
    expect(result.action).toBeUndefined();
    expect(result.lines?.[0]).toContain('open github');
  });

  it('switches language', () => {
    expect(runCommand('lang en', ctx, root).action).toEqual({ type: 'lang', locale: 'en' });
    expect(runCommand('lang xx', ctx, root).action).toBeUndefined();
  });

  it('switches to reader mode', () => {
    expect(runCommand('mode reader', ctx, root).action).toEqual({ type: 'mode', mode: 'reader' });
  });

  it('clears the screen', () => {
    expect(runCommand('clear', ctx, root).clear).toBe(true);
  });

  it('reports unknown commands', () => {
    expect(runCommand('sudo rm', ctx, root).lines?.[0]).toBe('unknown command: sudo');
  });

  it('is case-sensitive like a real shell', () => {
    expect(runCommand('HELP', ctx, root).lines?.[0]).toBe('unknown command: HELP');
  });
});
