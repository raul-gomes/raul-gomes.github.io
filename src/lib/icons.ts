export type IconId =
  | 'pacman'
  | 'invader'
  | 'tetris'
  | 'mushroom'
  | 'pokeball'
  | 'triforce'
  | 'minecraft'
  | 'arcade'
  | 'lightsaber'
  | 'deathstar'
  | 'matrix'
  | 'bat'
  | 'delorean'
  | 'shark'
  | 'ghost'
  | 'cyborg'
  | 'sauron'
  | 'ring'
  | 'glasses'
  | 'whale'
  | 'bigbrother'
  | 'worm'
  | 'magnifier'
  | 'fang'
  | 'book'
  | 'folder'
  | 'document'
  | 'profile'
  | 'recycle';

const SVG_ATTRS = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="geometricPrecision"';

export const icons: Record<IconId, string> = {
  pacman: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#000"/>
    <circle cx="16" cy="16" r="12" fill="#ffd54a"/>
    <path d="M16 16L31 6v20z" fill="#000"/>
    <circle cx="6" cy="10" r="1.4" fill="#fff"/>
    <circle cx="6" cy="16" r="1.4" fill="#fff"/>
    <circle cx="6" cy="22" r="1.4" fill="#fff"/>
  </svg>`,

  invader: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#001a00"/>
    <path d="M8 12V8M24 12V8M11 26v3M21 26v3" stroke="#39ff88" stroke-width="2"/>
    <path d="M4 12h24v9a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" fill="#39ff88"/>
    <rect x="9" y="14" width="5" height="6" fill="#001a00"/>
    <rect x="18" y="14" width="5" height="6" fill="#001a00"/>
    <path d="M13 26h-3M19 26h3" stroke="#001a00" stroke-width="2"/>
  </svg>`,

  tetris: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0a0a12"/>
    <g stroke="#000" stroke-width="1">
      <rect x="8" y="4" width="6" height="6" fill="#00e5ff"/>
      <rect x="14" y="4" width="6" height="6" fill="#ff2d95"/>
      <rect x="20" y="4" width="6" height="6" fill="#ffb000"/>
      <rect x="14" y="10" width="6" height="6" fill="#39ff88"/>
      <rect x="14" y="16" width="6" height="6" fill="#b76bff"/>
      <rect x="14" y="22" width="6" height="6" fill="#ff6a00"/>
    </g>
  </svg>`,

  mushroom: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b0b12"/>
    <path d="M3 17C3 9.8 8.4 5 16 5s13 4.8 13 12z" fill="#e63946"/>
    <circle cx="11" cy="11.5" r="2.8" fill="#fff"/>
    <circle cx="21" cy="11.5" r="2.8" fill="#fff"/>
    <circle cx="16" cy="8" r="2" fill="#fff"/>
    <rect x="9" y="17" width="14" height="10" rx="3" fill="#f1e3c6"/>
    <circle cx="13" cy="21.5" r="1.4" fill="#3a2a12"/>
    <circle cx="19" cy="21.5" r="1.4" fill="#3a2a12"/>
  </svg>`,

  pokeball: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b0b12"/>
    <circle cx="16" cy="16" r="12" fill="#fff"/>
    <path d="M4 16a12 12 0 0 1 24 0z" fill="#e63946"/>
    <rect x="4" y="14.8" width="24" height="2.4" fill="#111"/>
    <circle cx="16" cy="16" r="4.2" fill="#111"/>
    <circle cx="16" cy="16" r="2.2" fill="#fff"/>
  </svg>`,

  triforce: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b1a0b"/>
    <g fill="#ffd54a">
      <path d="M16 4l6 10H10z"/>
      <path d="M9 27l6-10H3z"/>
      <path d="M23 27l6-10H17z"/>
    </g>
  </svg>`,

  minecraft: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b0b12"/>
    <rect x="6" y="10" width="20" height="16" fill="#7a5230"/>
    <rect x="6" y="10" width="20" height="5" fill="#4caf50"/>
    <rect x="6" y="10" width="20" height="15" fill="none" stroke="#3a2614" stroke-width="1"/>
    <path d="M11 20h3v3M19 17h3v2" stroke="#5e3d23" stroke-width="1.6"/>
  </svg>`,

  arcade: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b0b12"/>
    <rect x="7" y="4" width="18" height="24" rx="2" fill="#20263a" stroke="#5b636e" stroke-width="1"/>
    <rect x="10" y="7" width="12" height="8" fill="#001a00" stroke="#39ff88" stroke-width="1"/>
    <text x="12" y="13.5" fill="#39ff88" font-family="monospace" font-size="6" font-weight="bold">&gt;_</text>
    <circle cx="12" cy="22" r="2" fill="#ff2d95"/>
    <circle cx="16" cy="22" r="2" fill="#00e5ff"/>
    <path d="M19.5 22h4M21.5 20v4" stroke="#ffd54a" stroke-width="1.6"/>
  </svg>`,

  lightsaber: `<svg ${SVG_ATTRS}>
    <rect x="13.5" y="16" width="5" height="13" rx="1" fill="#b9c2cc" stroke="#5b636e" stroke-width="0.8"/>
    <rect x="13.5" y="16" width="5" height="3" fill="#5b636e"/>
    <rect x="14" y="2" width="4" height="14.5" rx="2" fill="#4fc3f7"/>
    <rect x="15.4" y="3" width="1.2" height="12.5" fill="#e1f5fe"/>
  </svg>`,

  deathstar: `<svg ${SVG_ATTRS}>
    <circle cx="16" cy="16" r="13" fill="#9aa2ad" stroke="#5b636e" stroke-width="1.2"/>
    <path d="M3 16h26" stroke="#5b636e" stroke-width="1.5"/>
    <circle cx="19" cy="11" r="5" fill="#3d434b"/>
    <circle cx="19" cy="11" r="2.6" fill="#22262b"/>
    <path d="M4 20a13 13 0 0 0 24 0" fill="none" stroke="#6b737e" stroke-width="0.8"/>
  </svg>`,

  matrix: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#001a00"/>
    <g fill="#00ff41" font-family="monospace" font-size="7" font-weight="bold">
      <text x="3" y="12">70</text>
      <text x="14" y="19">01</text>
      <text x="4" y="27">11</text>
    </g>
  </svg>`,

  bat: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="16" fill="#ffd54a"/>
    <path d="M16 8.5c-1.4-2-3.9-2.9-7-1.9.6 1.6.5 3.1-.9 4.7 3-.5 5 .4 6.1 2.9.4 1.6 1.1 2.6 1.8 2.6s1.4-1 1.8-2.6c1.1-2.5 3.1-3.4 6.1-2.9-1.4-1.6-1.5-3.1-.9-4.7-3.1-1-5.6-.1-7 1.9z" fill="#111"/>
  </svg>`,

  delorean: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b0b12"/>
    <path d="M3 11h26" stroke="#00e5ff" stroke-width="1.4" opacity="0.6"/>
    <path d="M4 21l3-7h5l3-3h5l3 3h4l2 7z" fill="#c9d3dd" stroke="#5b636e" stroke-width="1" stroke-linejoin="round"/>
    <path d="M12 14h5l2 3H12z" fill="#8fb7d6"/>
    <circle cx="10" cy="21" r="3" fill="#22262b" stroke="#9aa2ad" stroke-width="1"/>
    <circle cx="23" cy="21" r="3" fill="#22262b" stroke="#9aa2ad" stroke-width="1"/>
  </svg>`,

  shark: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#062033"/>
    <path d="M16 4l4.5 13h-9z" fill="#9aa2ad"/>
    <path d="M1 21c3-2.2 6.5-2.2 9.5 0s6.5 2.2 9.5 0 6.5-2.2 9.5 0v7H1z" fill="#0d5c8a"/>
  </svg>`,

  ghost: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b0b12"/>
    <circle cx="16" cy="16" r="13" fill="#e63946"/>
    <path d="M11 22v-8a5 5 0 0 1 10 0v8l-2.5-2-2.5 2-2.5-2z" fill="#fff"/>
    <circle cx="13.5" cy="14" r="1" fill="#111"/>
    <circle cx="18.5" cy="14" r="1" fill="#111"/>
    <path d="M5 27L27 5" stroke="#fff" stroke-width="3"/>
    <path d="M5 27L27 5" stroke="#111" stroke-width="1.2"/>
  </svg>`,

  cyborg: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b0b12"/>
    <path d="M7 6h18v11a9 9 0 0 1-18 0z" fill="#9aa2ad" stroke="#5b636e" stroke-width="1"/>
    <rect x="10" y="9" width="12" height="6" rx="3" fill="#111"/>
    <circle cx="16" cy="12" r="2.4" fill="#e63946"/>
    <circle cx="16" cy="12" r="1" fill="#ffd0d0"/>
    <path d="M11 22h10M10 26h12" stroke="#5b636e" stroke-width="1.4"/>
  </svg>`,

  sauron: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0d0705"/>
    <ellipse cx="16" cy="9.5" rx="8.5" ry="5.5" fill="none" stroke="#5a2600" stroke-width="1"/>
    <ellipse cx="16" cy="9.5" rx="7" ry="4.5" fill="#ff6a00"/>
    <ellipse cx="16" cy="9.5" rx="4" ry="2.6" fill="#ffcf3f"/>
    <ellipse cx="16" cy="9.5" rx="1.2" ry="2.8" fill="#1a0b00"/>
    <path d="M12 30l1-15h6l1 15z" fill="#3a2c22"/>
    <path d="M11 15h10l-1-3H12z" fill="#2a1f18"/>
    <path d="M12 12l1.3-3 1.4 3 1.3-3 1.4 3 1.3-3 1.3 3z" fill="#2a1f18"/>
    <rect x="9.5" y="20" width="13" height="1.3" fill="#241a14"/>
    <rect x="10.5" y="25" width="11" height="1.3" fill="#241a14"/>
  </svg>`,

  ring: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0d0d12"/>
    <circle cx="16" cy="18" r="9" fill="none" stroke="#ffd54a" stroke-width="3"/>
    <circle cx="16" cy="18" r="9" fill="none" stroke="#fff3c4" stroke-width="1" opacity="0.85"/>
    <path d="M16 5l1.6 3.2h-3.2z" fill="#ffd54a"/>
  </svg>`,

  glasses: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#1a0f08"/>
    <circle cx="11" cy="19" r="5" fill="none" stroke="#c9a24a" stroke-width="1.8"/>
    <circle cx="21" cy="19" r="5" fill="none" stroke="#c9a24a" stroke-width="1.8"/>
    <path d="M16 19h0M16 18.5v1" stroke="#c9a24a" stroke-width="1.8"/>
    <path d="M6 19l-3-1M26 19l3-1" stroke="#c9a24a" stroke-width="1.4"/>
    <path d="M20 4l-2.4 4 3 2-2.4 4" fill="none" stroke="#ffd54a" stroke-width="1.6" stroke-linejoin="round"/>
  </svg>`,

  whale: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#062033"/>
    <path d="M2 21c4-6 13-9 19-4l4-3 1 6-4 3c-2 3-7 4-11 3s-9-2-9-5z" fill="#9aa2ad"/>
    <circle cx="9" cy="17" r="1.1" fill="#062033"/>
    <path d="M13 8c1-2 3-2 4 0M16 6c1-2 3-2 4 0" stroke="#8fd0ff" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  </svg>`,

  bigbrother: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#111"/>
    <path d="M3 16c4-6 9-8 13-8s9 2 13 8c-4 6-9 8-13 8s-9-2-13-8z" fill="#e8e8e8"/>
    <circle cx="16" cy="16" r="5" fill="#3a7bd5"/>
    <circle cx="16" cy="16" r="2.2" fill="#111"/>
    <circle cx="14" cy="13.6" r="1" fill="#fff"/>
  </svg>`,

  worm: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#d9b36a"/>
    <circle cx="16" cy="17" r="10" fill="#1a0f08"/>
    <circle cx="16" cy="17" r="6.5" fill="#000"/>
    <g fill="#f1e3c6">
      <path d="M16 7l2 3h-4z"/>
      <path d="M24 11l-3 2-1-3z"/>
      <path d="M25 19l-3-1 2-3z"/>
      <path d="M20 25l-1-3 3-1z"/>
      <path d="M12 25l3-1-1-3z"/>
      <path d="M7 19l3-1-2-3z"/>
      <path d="M8 11l1 3-3-1z"/>
    </g>
  </svg>`,

  magnifier: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b0b12"/>
    <circle cx="14" cy="14" r="8" fill="#00e5ff" opacity="0.15"/>
    <circle cx="14" cy="14" r="8" fill="none" stroke="#c9a24a" stroke-width="2.5"/>
    <path d="M20 20l7 7" stroke="#8a6d00" stroke-width="3.2" stroke-linecap="round"/>
  </svg>`,

  fang: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#1a0f08"/>
    <path d="M5 12c3-4 19-4 22 0-1 6-6 9-11 9S6 18 5 12z" fill="#e63946"/>
    <path d="M10 19l2.2 6 2.2-6z" fill="#fff"/>
    <path d="M17.6 19l2.2 6 2.2-6z" fill="#fff"/>
  </svg>`,

  book: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#0b0b12"/>
    <path d="M7 5h17a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7z" fill="#8b3a2f" stroke="#4a1e17" stroke-width="1"/>
    <path d="M7 5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2z" fill="#c9a24a"/>
    <path d="M22 5v22" stroke="#4a1e17" stroke-width="1"/>
    <path d="M10 5v22" stroke="#e8c877" stroke-width="1"/>
  </svg>`,

  folder: `<svg ${SVG_ATTRS}>
    <path d="M3 7h10l2 3h14v16H3z" fill="#c9a24a" stroke="#6b4d12" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M3 12h26" stroke="#6b4d12" stroke-width="1.5"/>
    <rect x="5" y="8.5" width="8" height="2.5" fill="#e8c877"/>
  </svg>`,

  document: `<svg ${SVG_ATTRS}>
    <path d="M8 3h12l6 6v20H8z" fill="#e8d9b0" stroke="#8a6d00" stroke-width="1"/>
    <path d="M20 3v6h6" fill="#d8c48a" stroke="#8a6d00" stroke-width="1"/>
    <g stroke="#8a6d00" stroke-width="1.2"><path d="M11 15h10M11 19h10M11 23h6"/></g>
  </svg>`,

  profile: `<svg ${SVG_ATTRS}>
    <rect width="32" height="32" rx="4" fill="#1a0f08"/>
    <circle cx="16" cy="12" r="5.5" fill="#c9a24a"/>
    <path d="M5.5 28c0-6 4.5-9.5 10.5-9.5s10.5 3.5 10.5 9.5z" fill="#c9a24a"/>
  </svg>`,

  recycle: `<svg ${SVG_ATTRS}>
    <rect x="7" y="10" width="18" height="18" rx="1.5" fill="#c9a24a" stroke="#6b4d12" stroke-width="1.2"/>
    <rect x="6" y="7" width="20" height="3.5" rx="1" fill="#a5832f" stroke="#6b4d12" stroke-width="1"/>
    <g stroke="#6b4d12" stroke-width="1.2"><path d="M12 14v10M16 14v10M20 14v10"/></g>
  </svg>`,
};

export function iconSvg(id: string, size = 32): string {
  const svg = icons[(id as IconId)] ?? icons.folder;
  return svg.replace('<svg ', `<svg width="${size}" height="${size}" aria-hidden="true" `);
}
