(() => {
  'use strict';

const LAYOUT = [{"label": "Konsonanten","tone": "consonant","type": "consonant","items": [{"code": "05D0","char": "א","name": "HEBREW LETTER ALEF","combining": false,"category": "Lo"},{"code": "05D1","char": "ב","name": "HEBREW LETTER BET","combining": false,"category": "Lo"},{"code": "05D2","char": "ג","name": "HEBREW LETTER GIMEL","combining": false,"category": "Lo"},{"code": "05D3","char": "ד","name": "HEBREW LETTER DALET","combining": false,"category": "Lo"},{"code": "05D4","char": "ה","name": "HEBREW LETTER HE","combining": false,"category": "Lo"},{"code": "05D5","char": "ו","name": "HEBREW LETTER VAV","combining": false,"category": "Lo"},{"code": "05D6","char": "ז","name": "HEBREW LETTER ZAYIN","combining": false,"category": "Lo"},{"code": "05D7","char": "ח","name": "HEBREW LETTER HET","combining": false,"category": "Lo"},{"code": "05D8","char": "ט","name": "HEBREW LETTER TET","combining": false,"category": "Lo"},{"code": "05D9","char": "י","name": "HEBREW LETTER YOD","combining": false,"category": "Lo"},{"code": "05DA","char": "ך","name": "HEBREW LETTER FINAL KAF","combining": false,"category": "Lo"},{"code": "05DB","char": "כ","name": "HEBREW LETTER KAF","combining": false,"category": "Lo"},{"code": "05DC","char": "ל","name": "HEBREW LETTER LAMED","combining": false,"category": "Lo"},{"code": "05DD","char": "ם","name": "HEBREW LETTER FINAL MEM","combining": false,"category": "Lo"},{"code": "05DE","char": "מ","name": "HEBREW LETTER MEM","combining": false,"category": "Lo"},{"code": "05DF","char": "ן","name": "HEBREW LETTER FINAL NUN","combining": false,"category": "Lo"},{"code": "05E0","char": "נ","name": "HEBREW LETTER NUN","combining": false,"category": "Lo"},{"code": "05E1","char": "ס","name": "HEBREW LETTER SAMEKH","combining": false,"category": "Lo"},{"code": "05E2","char": "ע","name": "HEBREW LETTER AYIN","combining": false,"category": "Lo"},{"code": "05E3","char": "ף","name": "HEBREW LETTER FINAL PE","combining": false,"category": "Lo"},{"code": "05E4","char": "פ","name": "HEBREW LETTER PE","combining": false,"category": "Lo"},{"code": "05E5","char": "ץ","name": "HEBREW LETTER FINAL TSADI","combining": false,"category": "Lo"},{"code": "05E6","char": "צ","name": "HEBREW LETTER TSADI","combining": false,"category": "Lo"},{"code": "05E7","char": "ק","name": "HEBREW LETTER QOF","combining": false,"category": "Lo"},{"code": "05E8","char": "ר","name": "HEBREW LETTER RESH","combining": false,"category": "Lo"},{"code": "05E9","char": "ש","name": "HEBREW LETTER SHIN","combining": false,"category": "Lo"},{"code": "05EA","char": "ת","name": "HEBREW LETTER TAV","combining": false,"category": "Lo"}]},{"label": "Vokale · lang","tone": "vowel","type": "mark","items": [{"code": "05B5","char": "ֵ","name": "HEBREW POINT TSERE","combining": true,"category": "Mn"},{"code": "05B8","char": "ָ","name": "HEBREW POINT QAMATS","combining": true,"category": "Mn"},{"code": "05B9","char": "ֹ","name": "HEBREW POINT HOLAM","combining": true,"category": "Mn"},{"code": "05BA","char": "ֺ","name": "HEBREW POINT HOLAM HASER FOR VAV","combining": true,"category": "Mn"}]},{"label": "Vokale · kurz","tone": "vowel","type": "mark","items": [{"code": "05B4","char": "ִ","name": "HEBREW POINT HIRIQ","combining": true,"category": "Mn"},{"code": "05B6","char": "ֶ","name": "HEBREW POINT SEGOL","combining": true,"category": "Mn"},{"code": "05B7","char": "ַ","name": "HEBREW POINT PATAH","combining": true,"category": "Mn"},{"code": "05BB","char": "ֻ","name": "HEBREW POINT QUBUTS","combining": true,"category": "Mn"},{"code": "05C7","char": "ׇ","name": "HEBREW POINT QAMATS QATAN","combining": true,"category": "Mn"}]},{"label": "Vokale · verkürzt","tone": "vowel","type": "mark","items": [{"code": "05B0","char": "ְ","name": "HEBREW POINT SHEVA","combining": true,"category": "Mn"},{"code": "05B1","char": "ֱ","name": "HEBREW POINT HATAF SEGOL","combining": true,"category": "Mn"},{"code": "05B2","char": "ֲ","name": "HEBREW POINT HATAF PATAH","combining": true,"category": "Mn"},{"code": "05B3","char": "ֳ","name": "HEBREW POINT HATAF QAMATS","combining": true,"category": "Mn"}]},{"label": "Zeichen","tone": "sign","type": "mark","items": [{"code": "05BC","char": "ּ","name": "HEBREW POINT DAGESH OR MAPIQ","combining": true,"category": "Mn"}]}];

const KEYBOARD_TOOLTIP_MAP = {
      'א': 'Tastatur: x',
      'ב': 'Tastatur: b',
      'ג': 'Tastatur: g',
      'ד': 'Tastatur: d',
      'ה': 'Tastatur: h',
      'ו': 'Tastatur: w',
      'ז': 'Tastatur: z',
      'ח': 'Tastatur: c',
      'ט': 'Tastatur: t',
      'י': 'Tastatur: j',
      'ך': 'Tastatur: Shift+K',
      'כ': 'Tastatur: k',
      'ל': 'Tastatur: l',
      'ם': 'Tastatur: Shift+M',
      'מ': 'Tastatur: m',
      'ן': 'Tastatur: Shift+N',
      'נ': 'Tastatur: n',
      'ס': 'Tastatur: s',
      'ע': 'Tastatur: y',
      'ף': 'Tastatur: Shift+P',
      'פ': 'Tastatur: p',
      'ץ': 'Tastatur: Shift+C',
      'צ': 'Tastatur: keine Belegung',
      'ק': 'Tastatur: q',
      'ר': 'Tastatur: r',
      'ש': 'Tastatur: Shift+W',
      'ת': 'Tastatur: Shift+T',
      'ׯ': 'Tastatur: keine Belegung',
      'װ': 'Tastatur: keine Belegung',
      'ױ': 'Tastatur: keine Belegung',
      'ײ': 'Tastatur: keine Belegung',
      'ֵ': 'Tastatur: e (auf aktuellem Buchstaben)',
      'ָ': 'Tastatur: a (auf aktuellem Buchstaben)',
      'ֹ': 'Tastatur: o (auf aktuellem Buchstaben, außer nach ו)',
      'ֺ': 'Tastatur: o (auf ו)',
      'ִ': 'Tastatur: i (auf aktuellem Buchstaben)',
      'ֶ': 'Tastatur: ä (auf aktuellem Buchstaben)',
      'ַ': 'Tastatur: a+1 (auf aktuellem Buchstaben)',
      'ֻ': 'Tastatur: u (auf aktuellem Buchstaben)',
      'ׇ': 'Tastatur: keine Belegung',
      'ְ': 'Tastatur: : (auf aktuellem Buchstaben)',
      'ֱ': 'Tastatur: ä+2 (auf aktuellem Buchstaben)',
      'ֲ': 'Tastatur: a+2 (auf aktuellem Buchstaben)',
      'ֳ': 'Tastatur: o+2 (auf aktuellem Buchstaben)',
      '֑': 'Tastatur: keine Belegung',
      '֒': 'Tastatur: keine Belegung',
      '֓': 'Tastatur: keine Belegung',
      '֔': 'Tastatur: keine Belegung',
      '֕': 'Tastatur: keine Belegung',
      '֖': 'Tastatur: keine Belegung',
      '֗': 'Tastatur: keine Belegung',
      '֘': 'Tastatur: keine Belegung',
      '֙': 'Tastatur: keine Belegung',
      '֚': 'Tastatur: keine Belegung',
      '֛': 'Tastatur: keine Belegung',
      '֜': 'Tastatur: keine Belegung',
      '֝': 'Tastatur: keine Belegung',
      '֞': 'Tastatur: keine Belegung',
      '֟': 'Tastatur: keine Belegung',
      '֠': 'Tastatur: keine Belegung',
      '֡': 'Tastatur: keine Belegung',
      '֢': 'Tastatur: keine Belegung',
      '֣': 'Tastatur: keine Belegung',
      '֤': 'Tastatur: keine Belegung',
      '֥': 'Tastatur: keine Belegung',
      '֦': 'Tastatur: keine Belegung',
      '֧': 'Tastatur: keine Belegung',
      '֨': 'Tastatur: keine Belegung',
      '֩': 'Tastatur: keine Belegung',
      '֪': 'Tastatur: keine Belegung',
      '֫': 'Tastatur: keine Belegung',
      '֬': 'Tastatur: keine Belegung',
      '֭': 'Tastatur: keine Belegung',
      '֮': 'Tastatur: keine Belegung',
      '׃': 'Tastatur: keine Belegung',
      '׀': 'Tastatur: keine Belegung',
      '־': 'Tastatur: keine Belegung',
      '״': 'Tastatur: keine Belegung',
      '׳': 'Tastatur: keine Belegung',
      '׆': 'Tastatur: keine Belegung',
      'ּ': 'Tastatur: . (auf aktuellem Buchstaben)',
      'ׁ': 'Tastatur: nur mit Shift+W+2',
      'ׂ': 'Tastatur: nur mit Shift+W+1',
      'ֿ': 'Tastatur: keine Belegung',
      'ֽ': 'Tastatur: keine Belegung',
      'ׄ': 'Tastatur: keine Belegung',
      'ׅ': 'Tastatur: keine Belegung',
      '֯': 'Tastatur: keine Belegung'
    };

const KEY_MAP = {
      x: 'א',
      b: 'ב',
      g: 'ג',
      d: 'ד',
      h: 'ה',
      w: 'ו',
      z: 'ז',
      c: 'ח',
      t: 'ט',
      j: 'י',
      k: 'כ',
      l: 'ל',
      m: 'מ',
      n: 'נ',
      s: 'ס',
      y: 'ע',
      p: 'פ',
      q: 'ק',
      r: 'ר'
    };

const SHIFT_SPECIAL_MAP = {
      w: 'ש',
      t: 'ת'
    };

const FINAL_MAP = {
      k: 'ך',
      m: 'ם',
      n: 'ן',
      p: 'ף',
      c: 'ץ'
    };

const DIRECT_MARK_MAP = {
      u: { char: 'ֻ', code: '05BB' },
      i: { char: 'ִ', code: '05B4' },
      e: { char: 'ֵ', code: '05B5' },
      ':': { char: 'ְ', code: '05B0' },
      '.': { char: 'ּ', code: '05BC' }
    };

const BASE_MARK_MAP = {
      a: { char: 'ָ', code: '05B8' },
      'ä': { char: 'ֶ', code: '05B6' },
      o: 'HOLAM_DYNAMIC'
    };

const COMBO_MARK_MAP = {
      'a+1': { char: 'ַ', code: '05B7' },
      'a+2': { char: 'ֲ', code: '05B2' },
      'ä+2': { char: 'ֱ', code: '05B1' },
      'o+2': { char: 'ֳ', code: '05B3' }
    };

  const SEARCH_INPUT_ID = 'hebrewSearchInput';
  const PANEL_ID = 'hebrewKeyboardPanel';
  const KEYS_HOST_ID = 'hebrewKeyboardKeys';
  const input = document.getElementById(SEARCH_INPUT_ID);
  const panel = document.getElementById(PANEL_ID);
  const keyboard = document.getElementById(KEYS_HOST_ID);
  if (!input || !panel || !keyboard) return;

  const COMBO_BASE_KEYS = new Set(['a', 'ä', 'o']);
  const DIGIT_KEYS = new Set(['1', '2']);
  const HEBREW_MARK_RE = /[֑-ֽֿ-ׂׄ-ׇׅ]/;
  const HEBREW_BASE_RE = /[א-תׯ-ײ]/;
  const activeKeys = new Set();
  const pendingBaseKeys = new Set();
  const consumedBaseKeys = new Set();
  const consumedDigitKeys = new Set();
  let pendingShiftW = false;
  let consumedShiftW = false;
  let activeConsonantChar = '';

  function getKeyboardTooltip(item) {
    return KEYBOARD_TOOLTIP_MAP[item.char] || 'Tastatur: keine Belegung';
  }

  function tooltipText(item, label) {
    const typeText = item.combining ? 'kombinierend' : 'spacing';
    return `${getKeyboardTooltip(item)} · U+${item.code} · ${item.name} · ${label} · ${typeText} · ${item.category}`;
  }

  function getSelection() {
    const start = typeof input.selectionStart === 'number' ? input.selectionStart : input.value.length;
    const end = typeof input.selectionEnd === 'number' ? input.selectionEnd : start;
    return { start, end };
  }

  function setSelection(position) {
    try {
      input.setSelectionRange(position, position);
    } catch (error) {
      // Some input implementations may reject selection changes. The value is still updated.
    }
  }

  function dispatchSearchInput() {
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function commitValue(nextValue, nextPosition) {
    input.value = nextValue;
    input.focus({ preventScroll: true });
    setSelection(nextPosition);
    dispatchSearchInput();
    updateKeyboardState();
  }

  function insertText(text) {
    const { start, end } = getSelection();
    const before = input.value.slice(0, start);
    const after = input.value.slice(end);
    commitValue(`${before}${text}${after}`, before.length + text.length);
  }

  function getPreviousBaseBefore(position = getSelection().start) {
    for (let index = position - 1; index >= 0; index -= 1) {
      const char = input.value[index];
      if (HEBREW_MARK_RE.test(char)) continue;
      if (HEBREW_BASE_RE.test(char)) return { char, index };
      return null;
    }
    return null;
  }

  function hasAttachableBase() {
    return !!getPreviousBaseBefore();
  }

  function addSpace() {
    activeConsonantChar = '';
    insertText(' ');
  }

  function addConsonant(item) {
    activeConsonantChar = item.char;
    insertText(item.char);
  }

  function addMark(item) {
    if (!item || !hasAttachableBase()) return;
    insertText(item.char);
  }

  function addResolvedMark(mark) {
    if (!mark) return;
    if (mark === 'HOLAM_DYNAMIC') {
      const previousBase = getPreviousBaseBefore();
      const resolved = previousBase && previousBase.char === 'ו'
        ? { char: 'ֺ', code: '05BA' }
        : { char: 'ֹ', code: '05B9' };
      addMark(resolved);
      return;
    }
    addMark(mark);
  }

  function backspace() {
    const { start, end } = getSelection();
    if (start !== end) {
      const before = input.value.slice(0, start);
      const after = input.value.slice(end);
      commitValue(`${before}${after}`, start);
      activeConsonantChar = getPreviousBaseBefore(start)?.char || '';
      return;
    }

    if (start <= 0) return;
    const before = input.value.slice(0, start - 1);
    const after = input.value.slice(start);
    commitValue(`${before}${after}`, start - 1);
    activeConsonantChar = getPreviousBaseBefore(start - 1)?.char || '';
  }

  function clearAll() {
    activeConsonantChar = '';
    commitValue('', 0);
  }

  function closeFromKeyboard() {
    dispatchSearchInput();
    hideKeyboard();
    input.blur();
  }

  function resolveComboMark(baseKey, digitKey) {
    return COMBO_MARK_MAP[`${baseKey}+${digitKey}`] || null;
  }

  function getActiveDigitForBase(baseKey) {
    if (activeKeys.has('1') && resolveComboMark(baseKey, '1')) return '1';
    if (activeKeys.has('2') && resolveComboMark(baseKey, '2')) return '2';
    return null;
  }

  function getPendingBaseForDigit(digitKey) {
    const baseOrder = ['a', 'ä', 'o'];
    for (const baseKey of baseOrder) {
      if (pendingBaseKeys.has(baseKey) && resolveComboMark(baseKey, digitKey)) return baseKey;
    }
    return null;
  }

  function commitBaseCombo(baseKey, digitKey) {
    const mark = resolveComboMark(baseKey, digitKey);
    if (!mark) return false;
    pendingBaseKeys.delete(baseKey);
    consumedBaseKeys.add(baseKey);
    consumedDigitKeys.add(digitKey);
    addResolvedMark(mark);
    return true;
  }

  function getShinComboMark(digitKey) {
    if (digitKey === '1') return { char: 'ׂ', code: '05C2' };
    if (digitKey === '2') return { char: 'ׁ', code: '05C1' };
    return null;
  }

  function commitShiftWCombo(digitKey) {
    const mark = getShinComboMark(digitKey);
    if (!mark) return false;
    pendingShiftW = false;
    consumedShiftW = true;
    consumedDigitKeys.add(digitKey);
    addConsonant({ char: 'ש', code: '' });
    addMark(mark);
    return true;
  }

  function normalizePhysicalKey(event) {
    if (event.code === 'Digit1') return '1';
    if (event.code === 'Digit2') return '2';
    if (event.code === 'Space') return ' ';
    return event.key.toLowerCase();
  }

  function isKeyboardActive() {
    return !panel.hidden && document.activeElement === input;
  }

  function isPrintableKey(event) {
    return event.key.length === 1;
  }

  function handlePhysicalKeyboard(event) {
    if (!isKeyboardActive()) return;

    const key = normalizePhysicalKey(event);
    activeKeys.add(key);

    if (event.repeat) {
      if (COMBO_BASE_KEYS.has(key) || DIGIT_KEYS.has(key) || key === 'w') event.preventDefault();
      return;
    }

    if (key === 'enter') {
      event.preventDefault();
      closeFromKeyboard();
      return;
    }

    if (key === 'escape') {
      event.preventDefault();
      hideKeyboard();
      input.blur();
      return;
    }

    if (key === 'backspace') {
      event.preventDefault();
      backspace();
      return;
    }

    if (key === 'delete') {
      event.preventDefault();
      clearAll();
      return;
    }

    if (key === ' ') {
      event.preventDefault();
      addSpace();
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (DIGIT_KEYS.has(key)) {
      event.preventDefault();

      if (activeKeys.has('shift') && activeKeys.has('w') && commitShiftWCombo(key)) return;
      if (pendingShiftW && commitShiftWCombo(key)) return;

      const pendingBase = getPendingBaseForDigit(key);
      if (pendingBase && commitBaseCombo(pendingBase, key)) return;

      return;
    }

    if (event.shiftKey && key === 'w') {
      event.preventDefault();

      if (activeKeys.has('1') && commitShiftWCombo('1')) return;
      if (activeKeys.has('2') && commitShiftWCombo('2')) return;

      pendingShiftW = true;
      consumedShiftW = false;
      return;
    }

    if (DIRECT_MARK_MAP[key]) {
      event.preventDefault();
      addResolvedMark(DIRECT_MARK_MAP[key]);
      return;
    }

    if (COMBO_BASE_KEYS.has(key)) {
      event.preventDefault();

      const activeDigit = getActiveDigitForBase(key);
      if (activeDigit && commitBaseCombo(key, activeDigit)) return;

      pendingBaseKeys.add(key);
      consumedBaseKeys.delete(key);
      return;
    }

    if (event.shiftKey && SHIFT_SPECIAL_MAP[key]) {
      event.preventDefault();
      addConsonant({ char: SHIFT_SPECIAL_MAP[key], code: '' });
      return;
    }

    if (!KEY_MAP[key]) {
      if (isPrintableKey(event)) event.preventDefault();
      return;
    }

    event.preventDefault();

    if (event.shiftKey && FINAL_MAP[key]) {
      addConsonant({ char: FINAL_MAP[key], code: '' });
      return;
    }

    addConsonant({ char: KEY_MAP[key], code: '' });
  }

  function handlePhysicalKeyboardKeyup(event) {
    if (!document.activeElement || document.activeElement !== input) return;

    const key = normalizePhysicalKey(event);
    activeKeys.delete(key);

    if (DIGIT_KEYS.has(key)) {
      consumedDigitKeys.delete(key);
      return;
    }

    if (key === 'w') {
      if (consumedShiftW) {
        consumedShiftW = false;
        return;
      }

      if (pendingShiftW) {
        pendingShiftW = false;
        addConsonant({ char: 'ש', code: '' });
        return;
      }

      return;
    }

    if (consumedBaseKeys.has(key)) {
      consumedBaseKeys.delete(key);
      return;
    }

    if (pendingBaseKeys.has(key)) {
      pendingBaseKeys.delete(key);
      addResolvedMark(BASE_MARK_MAP[key] || null);
    }
  }

  function clearActivePhysicalKeys() {
    activeKeys.clear();
    pendingBaseKeys.clear();
    consumedBaseKeys.clear();
    consumedDigitKeys.clear();
    pendingShiftW = false;
    consumedShiftW = false;
  }

  function makeKey(item, sectionIndex, itemIndex, tone, type, label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `hebrew-keyboard-key tone-${tone}`;
    btn.dataset.type = type;
    btn.dataset.section = String(sectionIndex);
    btn.dataset.index = String(itemIndex);
    btn.dataset.char = item.char;
    btn.dataset.code = item.code;
    btn.title = tooltipText(item, label);
    btn.setAttribute('aria-label', btn.title);

    const glyph = document.createElement('span');
    glyph.className = `hebrew-keyboard-glyph ${type === 'consonant' ? 'consonant' : 'mark'}`;
    glyph.textContent = item.char;
    btn.appendChild(glyph);

    btn.addEventListener('mousedown', (event) => event.preventDefault());
    btn.addEventListener('click', () => {
      showKeyboard();
      if (type === 'consonant') addConsonant(item);
      else addMark(item);
    });

    return btn;
  }

  function buildKeyboard() {
    const fragment = document.createDocumentFragment();
    LAYOUT.forEach((section, sectionIndex) => {
      section.items.forEach((item, itemIndex) => {
        fragment.appendChild(makeKey(item, sectionIndex, itemIndex, section.tone, section.type, section.label));
      });
    });
    keyboard.innerHTML = '';
    keyboard.appendChild(fragment);
    updateKeyboardState();
  }

  function updateKeyboardState() {
    const previousBase = getPreviousBaseBefore();
    const canAttachMark = !!previousBase;
    const activeChar = activeConsonantChar || previousBase?.char || '';

    keyboard.querySelectorAll('.hebrew-keyboard-key').forEach((btn) => {
      const isConsonant = btn.dataset.type === 'consonant';
      btn.classList.toggle('blocked', !isConsonant && !canAttachMark);
      btn.classList.toggle('active', isConsonant && !!activeChar && btn.dataset.char === activeChar);
    });
  }

  function showKeyboard() {
    panel.hidden = false;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    input.setAttribute('aria-expanded', 'true');
    updateKeyboardState();
  }

  function hideKeyboard() {
    panel.classList.remove('is-open');
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    input.setAttribute('aria-expanded', 'false');
    clearActivePhysicalKeys();
  }

  function isInsideKeyboardOrHebrewSearch(target) {
    return panel.contains(target) || (target instanceof Element && target.closest('#hebrewSearchWrap'));
  }

  input.addEventListener('focus', showKeyboard);
  input.addEventListener('click', showKeyboard);
  input.addEventListener('blur', () => {
    window.setTimeout(() => {
      if (!panel.contains(document.activeElement)) hideKeyboard();
    }, 0);
  });
  input.addEventListener('input', () => {
    activeConsonantChar = getPreviousBaseBefore()?.char || '';
    updateKeyboardState();
  });
  input.addEventListener('selectionchange', updateKeyboardState);
  input.addEventListener('search', () => {
    if (!input.value) activeConsonantChar = '';
    hideKeyboard();
  });

  document.addEventListener('selectionchange', () => {
    if (document.activeElement === input) updateKeyboardState();
  });

  document.addEventListener('pointerdown', (event) => {
    if (isInsideKeyboardOrHebrewSearch(event.target)) return;
    hideKeyboard();
  });

  document.addEventListener('keydown', handlePhysicalKeyboard, true);
  document.addEventListener('keyup', handlePhysicalKeyboardKeyup, true);
  window.addEventListener('blur', clearActivePhysicalKeys);

  buildKeyboard();
  hideKeyboard();
})();
