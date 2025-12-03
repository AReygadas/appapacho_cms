// src/admin/extensions/remove-upgrade.ts
const TEXT_SNIPPET = 'Access to Growth plan features';

function findMatchingDivs(): HTMLElement[] {
  try {
    // XPath case-insensitive search for any div containing the phrase
    const expr = `//div[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${TEXT_SNIPPET.toLowerCase()}')]`;
    const it = document.evaluate(expr, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    const found: HTMLElement[] = [];
    let n = it.iterateNext();
    while (n) {
      if (n instanceof HTMLElement) found.push(n);
      n = it.iterateNext();
    }
    return found;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('findMatchingDivs error', e);
    return [];
  }
}

function containsInteractive(node: HTMLElement): boolean {
  return !!node.querySelector('input, button, textarea, select, a[href], form, [role="button"], [role="link"]');
}

function isStructuralTag(tag: string): boolean {
  return /^(BODY|HTML|MAIN|HEADER|FOOTER|NAV|APP|ROOT)$/i.test(tag);
}

function pickContainerToCollapse(start: HTMLElement): HTMLElement {
  // Intentamos subir hasta 4 niveles buscando un ancestro pequeño y no estructural.
  let node: HTMLElement | null = start;
  for (let i = 0; i < 4 && node; i++) {
    const tag = node.tagName;
    if (isStructuralTag(tag)) break;

    if (containsInteractive(node)) {
      // Si contiene controles, no intentar ocultar ese ancestro
      break;
    }

    // Si el ancestro es razonablemente pequeño, lo elegimos
    const children = node.childElementCount ?? 0;
    const textLen = (node.textContent || '').trim().length;

    if (textLen >= 12 && children <= 8) {
      return node;
    }

    node = node.parentElement;
  }

  // fallback: si el start es pequeño y seguro, devolverlo; si no, devolver start (con precaución)
  if (!containsInteractive(start) && (start.childElementCount ?? 0) <= 12) return start;
  return start;
}

function safeCollapse(node: HTMLElement) {
  try {
    // marcar y colapsar visualmente, sin remover del DOM (seguro para React)
    if (node.getAttribute('data-hidden-by') === 'remove-upgrade-safe') return;
    node.setAttribute('data-hidden-by', 'remove-upgrade-safe');
    node.setAttribute('aria-hidden', 'true');
    node.style.setProperty('display', 'none', 'important');
    node.style.setProperty('height', '0', 'important');
    node.style.setProperty('margin', '0', 'important');
    node.style.setProperty('padding', '0', 'important');
    node.style.setProperty('overflow', 'hidden', 'important');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('safeCollapse error', e);
  }
}

function collapseDetected() {
  try {
    const els = findMatchingDivs();
    if (!els.length) return;
    els.forEach(el => {
      const container = pickContainerToCollapse(el);
      // Evitar colapsar tags críticos
      if (container && isStructuralTag(container.tagName)) return;
      // doble comprobación: no colapsar si hay controles
      if (containsInteractive(container)) return;
      safeCollapse(container);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('collapseDetected error', e);
  }
}

export default function observeAndCollapseUpgradeBanners(): void {
  if (typeof window === 'undefined') return;
  // intento inicial tras el render
  setTimeout(collapseDetected, 150);

  const observer = new MutationObserver(() => {
    collapseDetected();
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });

  try {
    // @ts-ignore
    window.__removeUpgradeObserver = observer;
  } catch {}
}
