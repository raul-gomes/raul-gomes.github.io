import type { Locale } from '@data/types';

export type TerminalAction =
  | { type: 'open'; app: string }
  | { type: 'lang'; locale: Locale }
  | { type: 'mode'; mode: 'reader' };

export interface CommandResult {
  lines?: string[];
  clear?: boolean;
  action?: TerminalAction;
}

export interface TerminalContext {
  helpTitle: string;
  commands: { cmd: string; desc: string }[];
  whoami: string[];
  unknown: string;
  opened: string;
}

export const KNOWN_APPS = ['about', 'projects', 'stack', 'contact'] as const;

export function runCommand(raw: string, ctx: TerminalContext): CommandResult {
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

    case 'ls':
      return { lines: KNOWN_APPS.map((app) => `${app}/`) };

    case 'open': {
      if (!arg) return { lines: [`${ctx.unknown} open`] };
      if (!(KNOWN_APPS as readonly string[]).includes(arg)) {
        return { lines: [`${ctx.unknown} open ${arg}`] };
      }
      return { action: { type: 'open', app: arg }, lines: [`${ctx.opened} ${arg}...`] };
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
