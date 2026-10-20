import type { Locale } from './types';

export interface AppLabels {
  about: string;
  projects: string;
  experience: string;
  education: string;
  skills: string;
  contact: string;
  terminal: string;
  cv: string;
}

export interface UIStrings {
  skipToContent: string;
  sections: {
    bio: string;
    projects: string;
    stack: string;
    experience: string;
    certs: string;
    contact: string;
  };
  actions: {
    downloadCv: string;
    toDesktop: string;
    toReader: string;
    powerOn: string;
    reboot: string;
    openApp: string;
  };
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
  apps: AppLabels;
  terminal: {
    promptLabel: string;
    inputLabel: string;
    helpTitle: string;
    commands: { cmd: string; desc: string }[];
    unknown: string;
    whoami: string[];
    opened: string;
    cleared: string;
    langChanged: string;
  };
}

export const ui: Record<Locale, UIStrings> = {
  pt: {
    skipToContent: 'Pular para o conteúdo',
    sections: {
      bio: 'sobre',
      projects: 'projetos',
      stack: 'stack',
      experience: 'experiência',
      certs: 'certificações & prêmios',
      contact: 'contato',
    },
    actions: {
      downloadCv: 'baixar CV',
      toDesktop: 'ligar modo desktop',
      toReader: 'modo leitura',
      powerOn: 'POWER ON',
      reboot: 'reiniciar',
      openApp: 'abrir',
    },
    boot: [
      'NOSTROMO BIOS v4.13 — RAUL DA SILVA GOMES',
      'MEM TEST ........ 640K OK',
      'MOUNT /dev/portfolio ........ OK',
      'LINK NEURAL ........ NOMINAL',
      'CARREGANDO INTERFACE ........ OK',
    ],
    desktop: {
      welcome: 'SISTEMA ONLINE. Dê um duplo clique nos ícones da área de trabalho.',
      hint: 'Dica: duplo clique abre pastas e arquivos. Arraste as janelas. Ou use o terminal.',
      selectHint: 'duplo clique para abrir',
      fileManager: 'diretório',
      readme: 'LEIA-ME',
      noScreenshot: '[ sem captura de tela ]',
      awards: 'prêmios.txt',
      certifications: 'certificações.txt',
      location: 'local',
      statusLabels: {
        live: 'no ar',
        wip: 'em construção',
        placeholder: 'placeholder',
      },
    },
    apps: {
      about: 'sobre.txt',
      projects: 'projetos',
      experience: 'experiencia',
      education: 'formacao',
      skills: 'skills',
      contact: 'contato',
      terminal: 'terminal',
      cv: 'curriculo.pdf',
    },
    terminal: {
      promptLabel: 'raul@nostromo:~$',
      inputLabel: 'Comando do terminal',
      helpTitle: 'comandos disponíveis:',
      commands: [
        { cmd: 'help', desc: 'lista os comandos' },
        { cmd: 'whoami', desc: 'perfil resumido' },
        { cmd: 'ls', desc: 'lista os apps disponíveis' },
        { cmd: 'open <app>', desc: 'abre uma janela (sobre, projetos, experiencia, formacao, skills, contato)' },
        { cmd: 'lang pt | en', desc: 'troca o idioma' },
        { cmd: 'mode reader', desc: 'volta para o modo leitura' },
        { cmd: 'clear', desc: 'limpa a tela' },
      ],
      unknown: 'comando desconhecido:',
      whoami: [
        'raul@nostromo — Engenheiro de Software',
        '3+ anos · backend Python · arquitetura · cloud',
        'Azure AI Engineer · 3º lugar Innovation Challenge Microsoft 2025',
      ],
      opened: 'abrindo',
      cleared: 'tela limpa',
      langChanged: 'idioma alterado',
    },
  },
  en: {
    skipToContent: 'Skip to content',
    sections: {
      bio: 'about',
      projects: 'projects',
      stack: 'stack',
      experience: 'experience',
      certs: 'certifications & awards',
      contact: 'contact',
    },
    actions: {
      downloadCv: 'download CV',
      toDesktop: 'boot desktop mode',
      toReader: 'reader mode',
      powerOn: 'POWER ON',
      reboot: 'reboot',
      openApp: 'open',
    },
    boot: [
      'NOSTROMO BIOS v4.13 — RAUL DA SILVA GOMES',
      'MEM TEST ........ 640K OK',
      'MOUNT /dev/portfolio ........ OK',
      'NEURAL LINK ........ NOMINAL',
      'LOADING INTERFACE ........ OK',
    ],
    desktop: {
      welcome: 'SYSTEM ONLINE. Double-click the desktop icons to open them.',
      hint: 'Tip: double-click opens folders and files. Drag windows around. Or use the terminal.',
      selectHint: 'double-click to open',
      fileManager: 'directory',
      readme: 'README',
      noScreenshot: '[ no screenshot ]',
      awards: 'awards.txt',
      certifications: 'certifications.txt',
      location: 'location',
      statusLabels: {
        live: 'live',
        wip: 'work in progress',
        placeholder: 'placeholder',
      },
    },
    apps: {
      about: 'about.txt',
      projects: 'projects',
      experience: 'experience',
      education: 'education',
      skills: 'skills',
      contact: 'contact',
      terminal: 'terminal',
      cv: 'resume.pdf',
    },
    terminal: {
      promptLabel: 'raul@nostromo:~$',
      inputLabel: 'Terminal command',
      helpTitle: 'available commands:',
      commands: [
        { cmd: 'help', desc: 'list the commands' },
        { cmd: 'whoami', desc: 'short profile' },
        { cmd: 'ls', desc: 'list available apps' },
        { cmd: 'open <app>', desc: 'open a window (sobre, projetos, experiencia, formacao, skills, contato)' },
        { cmd: 'lang pt | en', desc: 'switch language' },
        { cmd: 'mode reader', desc: 'return to reader mode' },
        { cmd: 'clear', desc: 'clear the screen' },
      ],
      unknown: 'unknown command:',
      whoami: [
        'raul@nostromo — Software Engineer',
        '3+ years · Python backend · architecture · cloud',
        'Azure AI Engineer · 3rd place Microsoft Innovation Challenge 2025',
      ],
      opened: 'opening',
      cleared: 'screen cleared',
      langChanged: 'language changed',
    },
  },
};
