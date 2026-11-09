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
    phone: string;
    website: string;
    educationList: string;
    languages: string;
    previousImage: string;
    nextImage: string;
    statusLabels: { live: string; wip: string; placeholder: string };
  };
  inventory: {
    hint: string;
    search: string;
    all: string;
    random: string;
    filters: string;
    selectPrompt: string;
    noResults: string;
    category: string;
    related: string;
    projects: string;
    experience: string;
    close: string;
    items: string;
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
    notFound: string;
    notADirectory: string;
    isADirectory: string;
    missingOperand: string;
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
      certs: 'formação & certificações',
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
      phone: 'telefone',
      website: 'site',
      educationList: 'formação.txt',
      languages: 'idiomas.txt',
      previousImage: 'imagem anterior',
      nextImage: 'próxima imagem',
      statusLabels: {
        live: 'no ar',
        wip: 'em construção',
        placeholder: 'placeholder',
      },
    },
    inventory: {
      hint: 'Clique em uma skill para inspecionar. Use a busca, os filtros ou o botão de sortear.',
      search: 'buscar skill...',
      all: 'todas',
      random: 'sortear',
      filters: 'filtrar por categoria',
      selectPrompt: 'Selecione uma skill para ver detalhes, projetos e experiências relacionadas.',
      noResults: 'Nenhuma skill encontrada.',
      category: 'categoria',
      related: 'skills relacionadas',
      projects: 'projetos relacionados',
      experience: 'experiências relacionadas',
      close: 'fechar',
      items: 'itens',
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
      promptLabel: 'raul@nostromo:{cwd}$',
      inputLabel: 'Comando do terminal',
      helpTitle: 'comandos disponíveis:',
      commands: [
        { cmd: 'help', desc: 'lista os comandos' },
        { cmd: 'ls [dir]', desc: 'lista arquivos e diretórios' },
        { cmd: 'cd <dir>', desc: 'entra em um diretório (use .. para voltar)' },
        { cmd: 'cat <arquivo>', desc: 'mostra o conteúdo de um arquivo' },
        { cmd: 'pwd', desc: 'mostra o diretório atual' },
        { cmd: 'open <app>', desc: 'abre uma janela pelo caminho ou app' },
        { cmd: 'whoami', desc: 'perfil resumido' },
        { cmd: 'lang pt | en', desc: 'troca o idioma' },
        { cmd: 'mode reader', desc: 'volta para o modo leitura' },
        { cmd: 'clear', desc: 'limpa a tela' },
      ],
      unknown: 'comando desconhecido:',
      whoami: [
        'raul@nostromo — Engenheiro de Software Pleno',
        'Em TI desde 2006 · dev desde 2022 · Python, TypeScript, Node.js',
        'Azure AI Engineer · Databricks Foundations · 3º lugar Innovation Challenge Microsoft 2025',
      ],
      opened: 'abrindo',
      cleared: 'tela limpa',
      langChanged: 'idioma alterado',
      notFound: 'arquivo ou diretório não encontrado',
      notADirectory: 'não é um diretório',
      isADirectory: 'é um diretório',
      missingOperand: 'faltando operando',
    },
  },
  en: {
    skipToContent: 'Skip to content',
    sections: {
      bio: 'about',
      projects: 'projects',
      stack: 'stack',
      experience: 'experience',
      certs: 'education & certifications',
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
      phone: 'phone',
      website: 'website',
      educationList: 'education.txt',
      languages: 'languages.txt',
      previousImage: 'previous image',
      nextImage: 'next image',
      statusLabels: {
        live: 'live',
        wip: 'work in progress',
        placeholder: 'placeholder',
      },
    },
    inventory: {
      hint: 'Click a skill to inspect it. Use search, filters, or the random button.',
      search: 'search skills...',
      all: 'all',
      random: 'random',
      filters: 'filter by category',
      selectPrompt: 'Select a skill to see details, related projects, and experience.',
      noResults: 'No skills found.',
      category: 'category',
      related: 'related skills',
      projects: 'related projects',
      experience: 'related experience',
      close: 'close',
      items: 'items',
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
      promptLabel: 'raul@nostromo:{cwd}$',
      inputLabel: 'Terminal command',
      helpTitle: 'available commands:',
      commands: [
        { cmd: 'help', desc: 'list the commands' },
        { cmd: 'ls [dir]', desc: 'list files and directories' },
        { cmd: 'cd <dir>', desc: 'change directory (use .. to go back)' },
        { cmd: 'cat <file>', desc: 'print a file to the terminal' },
        { cmd: 'pwd', desc: 'print the current directory' },
        { cmd: 'open <app>', desc: 'open a window by path or app name' },
        { cmd: 'whoami', desc: 'short profile' },
        { cmd: 'lang pt | en', desc: 'switch language' },
        { cmd: 'mode reader', desc: 'return to reader mode' },
        { cmd: 'clear', desc: 'clear the screen' },
      ],
      unknown: 'unknown command:',
      whoami: [
        'raul@nostromo — Mid-level Software Engineer',
        'In IT since 2006 · building software since 2022 · Python, TypeScript, Node.js',
        'Azure AI Engineer · Databricks Foundations · 3rd place Microsoft Innovation Challenge 2025',
      ],
      opened: 'opening',
      cleared: 'screen cleared',
      langChanged: 'language changed',
      notFound: 'no such file or directory',
      notADirectory: 'not a directory',
      isADirectory: 'is a directory',
      missingOperand: 'missing operand',
    },
  },
};
