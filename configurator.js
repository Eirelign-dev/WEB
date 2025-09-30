(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const form = $('#config-form');
  const preview = $('#preview-svg');
  const nameOut = $('#config-name');
  const engraveOut = $('#engrave-preview');
  const engraveCount = $('#engrave-count');
  const CUSTOM_PRICE = 40; // €40 for custom builds

  const state = { base: 'Custom Build', primary: '#00e0b8', accent: '#58a6ff', pattern: 'none', finish: 'matte', engraving: '' };

  function apply() {
    const prim = $('#shape-primary', preview), acc = $('#shape-accent', preview), panel = $('#panel', preview);
    if (prim) prim.setAttribute('fill', state.primary);
    if (acc) acc.setAttribute('stroke', state.accent);
    if (panel) panel.setAttribute('opacity', state.finish === 'gloss' ? '0.16' : '0.10');

    const stripes = $('#pattern-stripes', preview), speckles = $('#pattern-speckles', preview);
    if (stripes) stripes.style.display = state.pattern === 'stripes' ? 'block' : 'none';
    if (speckles) speckles.style.display = state.pattern === 'speckles' ? 'block' : 'none';

    if (nameOut) nameOut.textContent = `${state.base} — ${state.finish}, ${state.pattern}, ${state.primary}/${state.accent} · €${CUSTOM_PRICE}`;
    if (engraveOut) engraveOut.textContent = (state.engraving || '').trim().toUpperCase();
  }

  function sanitizeEngraving(v) {
    v = v.replace(/[^a-zA-Z0-9 \-.&]/g, '');
    if (v.length > 16) v = v.slice(0, 16);
    if (engraveCount) engraveCount.textContent = `${v.length}/16`;
    return v;
  }

  function readInputs() {
    state.primary = form.primary.value;
    state.accent = form.accent.value;
    state.pattern = form.pattern.value;
    state.finish = form.finish.value;
    state.engraving = sanitizeEngraving(form.engraving.value);
  }

  function toSku() {
    const p = state.primary.replace('#', '').toUpperCase().slice(0, 6);
    const a = state.accent.replace('#', '').toUpperCase().slice(0, 6);
    const pat = ({ none: 'N', stripes: 'S', speckles: 'K' }[state.pattern]) || 'N';
    const fin = state.finish === 'gloss' ? 'G' : 'M';
    const eng = state.engraving ? '-ENG' : '';
    return `CUSTOM-${pat}${fin}-${p}-${a}${eng}`;
  }

  function addToCart() {
    const item = {
      name: 'Éirelign Custom',
      price: CUSTOM_PRICE,
      sku: toSku(),
      options: { primary: state.primary, accent: state.accent, pattern: state.pattern, finish: state.finish, engraving: state.engraving }
    };
    if (window.EirelignCart) window.EirelignCart.addToCart(item);
  }

  if (form) {
    form.addEventListener('input', () => { readInputs(); apply(); });
    const btn = $('#btn-add');
    if (btn) btn.addEventListener('click', e => { e.preventDefault(); readInputs(); apply(); addToCart(); });
    const eng = form.engraving;
    if (eng) eng.addEventListener('input', () => { eng.value = sanitizeEngraving(eng.value); readInputs(); apply(); });
    readInputs(); apply();
  }
})();
