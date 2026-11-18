/** One image the lightbox can show. */
interface LightboxItem {
  src: string;
  alt: string;
  caption: string;
}

/** Index after moving `delta` steps in a gallery of `length` images, wrapping at both ends. */
export function stepIndex(current: number, delta: number, length: number): number {
  if (length <= 1) return 0;
  return (((current + delta) % length) + length) % length;
}

/** Read the zoomable images of one gallery, in page order. */
function itemsOf(group: string, root: ParentNode): { buttons: HTMLButtonElement[]; items: LightboxItem[] } {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>(`[data-zoom-group="${CSS.escape(group)}"]`));
  const items = buttons.map((button) => {
    const img = button.querySelector('img');
    return {
      src: button.dataset.zoomSrc ?? img?.src ?? '',
      alt: img?.alt ?? '',
      caption: button.dataset.zoomCaption ?? '',
    };
  });
  return { buttons, items };
}

/**
 * Wire the reader's gallery thumbnails to a full-size viewer: a native <dialog>
 * that closes on Esc, on the close button or on a click outside the image, and
 * steps through the same project's screenshots with the arrows (buttons or keys).
 */
export function mountLightbox(dialog: HTMLDialogElement, root: ParentNode = document): void {
  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]');
  const counter = dialog.querySelector<HTMLElement>('[data-lightbox-counter]');
  if (!image || !caption || !counter) return;

  let items: LightboxItem[] = [];
  let index = 0;
  let opener: HTMLElement | null = null;

  const render = () => {
    const item = items[index];
    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = item.caption;
    counter.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : '';
    dialog.dataset.single = String(items.length <= 1);
  };

  const step = (delta: number) => {
    index = stepIndex(index, delta, items.length);
    render();
  };

  root.addEventListener('click', (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-zoom-group]');
    if (!button) return;
    const gallery = itemsOf(button.dataset.zoomGroup ?? '', root);
    items = gallery.items;
    index = Math.max(0, gallery.buttons.indexOf(button));
    opener = button;
    render();
    dialog.showModal();
  });

  dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => step(-1));
  dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => step(1));
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });

  // A click on the backdrop lands on the <dialog> itself, not on its content.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    opener?.focus();
  });
}
