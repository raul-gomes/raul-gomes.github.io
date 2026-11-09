interface InventorySkill {
  id: string;
  name: string;
  group: string;
  groupLabel: string;
  iconSrc: string;
  search: string;
}

interface InventoryGroup {
  label: string;
  projects: Array<{ title: string; tagline?: string }>;
  experience: Array<{ title: string; company: string; period?: string }>;
  skills: Array<{ id: string; name: string }>;
}

interface InventoryLabels {
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
}

interface InventoryPayload {
  skills: InventorySkill[];
  groups: Record<string, InventoryGroup>;
  labels: InventoryLabels;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function mountSkillInventory(root: HTMLElement): void {
  if (root.dataset.skillMounted === 'true') return;
  root.dataset.skillMounted = 'true';

  const dataEl = root.querySelector<HTMLScriptElement>('[data-skill-data]');
  const panel = root.querySelector<HTMLElement>('[data-skill-panel]');
  const search = root.querySelector<HTMLInputElement>('[data-skill-search]');
  const random = root.querySelector<HTMLButtonElement>('[data-skill-random]');
  const count = root.querySelector<HTMLElement>('[data-skill-count]');
  const empty = root.querySelector<HTMLElement>('[data-skill-empty]');
  const cards = [...root.querySelectorAll<HTMLButtonElement>('[data-skill-card]')];
  const filters = [...root.querySelectorAll<HTMLButtonElement>('[data-skill-filter]')];

  if (!dataEl || !panel) return;

  let payload: InventoryPayload;
  try {
    payload = JSON.parse(dataEl.textContent ?? '{}') as InventoryPayload;
  } catch {
    return;
  }

  const panelEmpty = panel.innerHTML;
  const skillById = new Map(payload.skills.map((skill) => [skill.id, skill]));
  let activeFilter = 'all';
  let query = '';
  let selectedId: string | null = null;

  const visibleCards = (): HTMLButtonElement[] =>
    cards.filter((card) => {
      const groupOk = activeFilter === 'all' || card.dataset.skillGroup === activeFilter;
      const searchOk = query === '' || (card.dataset.skillSearch ?? '').includes(query);
      return groupOk && searchOk;
    });

  const clearSelection = (): void => {
    selectedId = null;
    cards.forEach((card) => card.setAttribute('aria-pressed', 'false'));
    panel.dataset.selected = 'false';
    panel.innerHTML = panelEmpty;
  };

  const renderPanel = (skill: InventorySkill): void => {
    const group = payload.groups[skill.group];
    const related = group?.skills.filter((item) => item.id !== skill.id) ?? [];
    const projects = group?.projects ?? [];
    const experience = group?.experience ?? [];
    const labels = payload.labels;

    panel.dataset.selected = 'true';
    panel.innerHTML = `
      <div class="inventory__panel-head">
        <div class="inventory__panel-title-wrap">
          <span class="inventory__panel-icon" aria-hidden="true"><img src="${escapeHtml(skill.iconSrc)}" alt="" loading="lazy" width="28" height="28" /></span>
          <div>
            <h3 class="inventory__panel-title">${escapeHtml(skill.name)}</h3>
            <p class="inventory__panel-cat">${escapeHtml(labels.category)}: ${escapeHtml(skill.groupLabel)}</p>
          </div>
        </div>
        <button type="button" class="inventory__panel-close" data-skill-close aria-label="${escapeHtml(labels.close)}">&times;</button>
      </div>
      ${
        related.length
          ? `<div class="inventory__panel-section">
              <h4>${escapeHtml(labels.related)}</h4>
              <div class="inventory__related">
                ${related
                  .map(
                    (item) =>
                      `<button type="button" data-skill-related="${escapeHtml(item.id)}">${escapeHtml(item.name)}</button>`,
                  )
                  .join('')}
              </div>
            </div>`
          : ''
      }
      ${
        projects.length
          ? `<div class="inventory__panel-section">
              <h4>${escapeHtml(labels.projects)}</h4>
              <ul class="inventory__panel-list">
                ${projects
                  .map(
                    (project) =>
                      `<li><strong>${escapeHtml(project.title)}</strong>${
                        project.tagline ? `<span> — ${escapeHtml(project.tagline)}</span>` : ''
                      }</li>`,
                  )
                  .join('')}
              </ul>
            </div>`
          : ''
      }
      ${
        experience.length
          ? `<div class="inventory__panel-section">
              <h4>${escapeHtml(labels.experience)}</h4>
              <ul class="inventory__panel-list">
                ${experience
                  .map(
                    (job) =>
                      `<li><strong>${escapeHtml(job.title)}</strong><span> — ${escapeHtml(job.company)}${
                        job.period ? ` · ${escapeHtml(job.period)}` : ''
                      }</span></li>`,
                  )
                  .join('')}
              </ul>
            </div>`
          : ''
      }
    `;
  };

  const selectSkill = (id: string): void => {
    const skill = skillById.get(id);
    if (!skill) return;

    selectedId = id;
    cards.forEach((card) => card.setAttribute('aria-pressed', String(card.dataset.skillId === id)));
    renderPanel(skill);

    if (window.matchMedia('(max-width: 900px)').matches) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const update = (): void => {
    const visible = visibleCards();
    const visibleSet = new Set(visible);

    cards.forEach((card) => {
      card.hidden = !visibleSet.has(card);
    });

    if (count) count.textContent = `${visible.length} / ${cards.length} ${payload.labels.items}`;
    if (empty) empty.hidden = visible.length > 0;

    if (selectedId) {
      const card = cards.find((item) => item.dataset.skillId === selectedId);
      if (!card || card.hidden) clearSelection();
    }
  };

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.skillFilter ?? 'all';
      filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      update();
    });
  });

  search?.addEventListener('input', () => {
    query = normalize(search.value.trim());
    update();
  });

  random?.addEventListener('click', () => {
    const visible = visibleCards();
    if (!visible.length) return;

    const pick = visible[Math.floor(Math.random() * visible.length)];
    const id = pick.dataset.skillId;
    if (id) selectSkill(id);
    pick.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.skillId;
      if (id) selectSkill(id);
    });
  });

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.closest('[data-skill-close]')) {
      clearSelection();
      return;
    }

    const related = target.closest<HTMLElement>('[data-skill-related]');
    if (related?.dataset.skillRelated) selectSkill(related.dataset.skillRelated);
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && selectedId) {
      event.stopPropagation();
      clearSelection();
    }
  });

  update();
}
