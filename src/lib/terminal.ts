import type { Locale } from '@data/types';

export type TerminalAction =
  | { type: 'open'; app: string }
  | { type: 'lang'; locale: Locale }
  | { type: 'mode'; mode: 'reader' };

export interface CommandResult {
  lines?: string[];
  clear?: boolean;
  action?: TerminalAction;
  cwd?: string;
}

export interface TerminalContext {
  helpTitle: string;
  commands: { cmd: string; desc: string }[];
  whoami: string[];
  unknown: string;
  opened: string;
  notFound: string;
  notADirectory: string;
  isADirectory: string;
  missingOperand: string;
}

export interface TerminalNode {
  name: string;
  kind: 'file' | 'dir';
  content?: string;
  nodeId?: string;
  children?: TerminalNode[];
}

const HOME = '/';

function splitPath(path: string): string[] {
  return path.split('/').filter(Boolean);
}

function joinPath(segments: string[]): string {
  return segments.length ? `/${segments.join('/')}` : HOME;
}

function resolveSegments(cwd: string, target: string): string[] {
  const base = target === '~'
    ? []
    : target === ''
      ? splitPath(cwd)
      : target.startsWith('~/')
        ? splitPath(target.slice(2))
        : target.startsWith('/')
          ? splitPath(target)
          : [...splitPath(cwd), ...splitPath(target)];

  const segments: string[] = [];
  for (const segment of base) {
    if (segment === '.' || segment === '') continue;
    if (segment === '..') {
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  return segments;
}

function nodeAt(root: TerminalNode, segments: string[]): TerminalNode | undefined {
  let node: TerminalNode | undefined = root;
  for (const segment of segments) {
    if (node?.kind !== 'dir') return undefined;
    node = node.children?.find((child) => child.name === segment);
    if (!node) return undefined;
  }
  return node;
}

function resolveNode(root: TerminalNode, cwd: string, target: string): TerminalNode | undefined {
  return nodeAt(root, resolveSegments(cwd, target));
}

function error(command: string, message: string, target: string): CommandResult {
  return { lines: [`${command}: ${message}: ${target}`] };
}

export function runCommand(
  raw: string,
  ctx: TerminalContext,
  root: TerminalNode,
  cwd: string = HOME,
): CommandResult {
  const input = raw.trim();
  if (input === '') return {};

  const [command, ...args] = input.split(/\s+/);
  const arg = args[0];

  switch (command) {
    case 'help':
      return {
        lines: [ctx.helpTitle, ...ctx.commands.map((c) => `  ${c.cmd.padEnd(16)} ${c.desc}`)],
      };

    case 'whoami':
      return { lines: ctx.whoami };

    case 'ls': {
      const target = args.find((value) => !value.startsWith('-')) ?? '';
      const node = resolveNode(root, cwd, target);
      if (!node) return error('ls', ctx.notFound, target || '~');
      if (node.kind === 'file') return { lines: [node.name] };
      const entries = [...(node.children ?? [])]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((child) => (child.kind === 'dir' ? `${child.name}/` : child.name));
      return { lines: entries };
    }

    case 'cd': {
      const target = arg ?? '~';
      const segments = resolveSegments(cwd, target);
      const node = nodeAt(root, segments);
      if (!node) return error('cd', ctx.notFound, target || '~');
      if (node.kind !== 'dir') return error('cd', ctx.notADirectory, target);
      return { cwd: joinPath(segments) };
    }

    case 'cat': {
      if (args.length === 0) return { lines: [`cat: ${ctx.missingOperand}`] };
      const lines: string[] = [];
      for (const target of args) {
        const node = resolveNode(root, cwd, target);
        if (!node) return error('cat', ctx.notFound, target);
        if (node.kind === 'dir') return error('cat', ctx.isADirectory, target);
        if (lines.length > 0) lines.push('');
        lines.push(...(node.content ?? '').split('\n'));
      }
      return { lines };
    }

    case 'pwd':
      return { lines: [cwd] };

    case 'open': {
      if (!arg) return { lines: [`${ctx.unknown} open`] };
      const candidates = arg.includes('.') ? [arg] : [arg, `${arg}.exe`, `${arg}.txt`, `${arg}.url`, `${arg}.pdf`];
      const node = candidates
        .map((candidate) => resolveNode(root, cwd, candidate))
        .find((candidate) => candidate?.nodeId);
      if (!node?.nodeId) return { lines: [`${ctx.unknown} open ${arg}`] };
      return { action: { type: 'open', app: node.nodeId }, lines: [`${ctx.opened} ${arg}...`] };
    }

    case 'lang': {
      if (arg === 'pt' || arg === 'en') return { action: { type: 'lang', locale: arg } };
      return { lines: [`${ctx.unknown} lang ${arg ?? ''}`.trim()] };
    }

    case 'mode': {
      if (arg === 'reader') return { action: { type: 'mode', mode: 'reader' } };
      return { lines: [`${ctx.unknown} mode ${arg ?? ''}`.trim()] };
    }

    case 'clear':
      return { clear: true };

    default:
      return { lines: [`${ctx.unknown} ${command}`] };
  }
}
