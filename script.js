function removeDiacritics(str) {
  return String(str ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const DATA_URL = './Voc_erweitert.json';
const SEARCH_FIELDS = ['Deutsch', 'Infinitiv', 'Nomen', 'Verb', 'Adjektiv', 'Synonyme'];
const SECONDARY_FIELDS = ['Infinitiv', 'Nomen', 'Verb', 'Adjektiv', 'Synonyme'];
const SECONDARY_WEIGHTS = {
  Infinitiv: 1.0,
  Nomen: 0.95,
  Verb: 1.0,
  Adjektiv: 0.82,
  Synonyme: 0.88,
};
const INPUT_DEBOUNCE_MS = 180;
const TRANSCRIPTION_FIELD = 'Transkription';
const HEBREW_FIELD = 'Hebräisch';

const state = {
  entries: [],
  lessons: [],
  selectedLessons: new Set(),
  query: '',
  transcriptionQuery: '',
  hebrewQuery: '',
};

const els = {
  searchInput: document.getElementById('searchInput'),
  searchWrap: document.getElementById('searchWrap'),
  clearBtn: document.getElementById('clearBtn'),
  transcriptionSearchInput: document.getElementById('transcriptionSearchInput'),
  transcriptionSearchWrap: document.getElementById('transcriptionSearchWrap'),
  transcriptionClearBtn: document.getElementById('transcriptionClearBtn'),
  hebrewSearchInput: document.getElementById('hebrewSearchInput'),
  hebrewSearchWrap: document.getElementById('hebrewSearchWrap'),
  hebrewClearBtn: document.getElementById('hebrewClearBtn'),
  filterButton: document.getElementById('filterButton'),
  dropdown: document.getElementById('dropdown'),
  selectAllBtn: document.getElementById('selectAllBtn'),
  selectNoneBtn: document.getElementById('selectNoneBtn'),
  lessonList: document.getElementById('lessonList'),
  resultsHost: document.getElementById('resultsHost'),
  infoButton: document.getElementById('infoButton'),
  infoOverlay: document.getElementById('infoOverlay'),
  infoCloseButton: document.getElementById('infoCloseButton'),
  infoTabButtons: Array.from(document.querySelectorAll('.info-tab-btn')),
  infoTabPanels: Array.from(document.querySelectorAll('.info-tab-panel')),
};

const collator = new Intl.Collator('de', { sensitivity: 'base', numeric: true });

function debounce(callback, wait) {
  let timeoutId = null;

  function debounced(...args) {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      callback(...args);
    }, wait);
  }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[(){}\[\],;:!?«»"“”„…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTranscription(value) {
  return removeDiacritics(
    normalize(value)
      .replace(/ts/g, 's')
      .replace(/z/g, 's')
      .replace(/[jy]/g, 'i')
      .replace(/ö/g, 'e')
      .replace(/ä/g, 'e')
      .replace(/(.)\1+/g, '$1')
  );
}

function normalizeHebrew(value) {
  return String(value ?? '')
    .normalize('NFC')
    .replace(/[\u0591-\u05BD\u05BF-\u05C2\u05C4-\u05C5\u05C7]/g, '')
    .replace(/[\u200e\u200f\u202a-\u202e]/g, '')
    .replace(/[־׀׃״׳"'`´.,;:!?(){}\[\]<>/\\|+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTranscriptionVariants(value) {
  if (value == null) return [];
  return String(value)
    .split('/')
    .map((part) => normalizeTranscription(part.trim()))
    .filter(Boolean);
}

function splitSlashValues(value) {
  return String(value ?? '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitWords(value) {
  return normalize(value)
    .split(/[\s\-–—]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function splitTranscriptionWords(value) {
  return normalizeTranscription(value)
    .split(/[\s\-–—]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function splitHebrewWords(value) {
  return normalizeHebrew(value)
    .split(/[\s\-–—]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[rows - 1][cols - 1];
}

function similarity(a, b) {
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

function transcriptionSimilarity(a, b) {
  const left = normalizeTranscription(a);
  const right = normalizeTranscription(b);
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

function hebrewSimilarity(a, b) {
  const left = normalizeHebrew(a);
  const right = normalizeHebrew(b);
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

function scoreCandidate(query, candidate) {
  const q = normalize(query);
  const c = normalize(candidate);
  if (!q || !c) return 0;

  const qWords = splitWords(q);
  const cWords = splitWords(c);
  let best = 0;

  if (c === q) best = Math.max(best, 120);
  if (c.startsWith(q)) best = Math.max(best, 108);
  if (` ${c} `.includes(` ${q} `)) best = Math.max(best, 104);
  if (q.length >= 3 && c.includes(q)) best = Math.max(best, 90);

  if (qWords.length > 1) {
    let exact = 0;
    let prefix = 0;
    let loose = 0;

    for (const qWord of qWords) {
      if (cWords.some((cWord) => cWord === qWord)) {
        exact += 1;
      } else if (cWords.some((cWord) => cWord.startsWith(qWord))) {
        prefix += 1;
      } else if (
        qWord.length >= 4 &&
        cWords.some((cWord) => cWord.includes(qWord) || qWord.includes(cWord))
      ) {
        loose += 1;
      }
    }

    const coverage = (exact + (prefix * 0.78) + (loose * 0.45)) / qWords.length;
    best = Math.max(best, 38 + (coverage * 62));
  } else {
    const qWord = qWords[0] || q;
    if (cWords.some((cWord) => cWord === qWord)) best = Math.max(best, 110);
    if (cWords.some((cWord) => cWord.startsWith(qWord))) best = Math.max(best, 102);
    if (
      qWord.length >= 4 &&
      cWords.some((cWord) => qWord.startsWith(cWord) && cWord.length >= 4)
    ) {
      best = Math.max(best, 94);
    }
    if (
      qWord.length >= 4 &&
      cWords.some((cWord) => cWord.includes(qWord) || qWord.includes(cWord))
    ) {
      best = Math.max(best, 84);
    }
  }

  const relevantParts = [c, ...cWords.filter((word) => word.length >= Math.min(4, q.length))];
  let bestSimilarity = 0;
  for (const part of relevantParts) bestSimilarity = Math.max(bestSimilarity, similarity(q, part));

  if (bestSimilarity >= 0.97) best = Math.max(best, 100);
  else if (bestSimilarity >= 0.92) best = Math.max(best, 92);
  else if (bestSimilarity >= 0.86) best = Math.max(best, 82);
  else if (bestSimilarity >= 0.78) best = Math.max(best, 70);
  else if (bestSimilarity >= 0.70) best = Math.max(best, 58);
  else if (bestSimilarity >= 0.63) best = Math.max(best, 48);

  return Math.round(best * 100) / 100;
}

function scoreTranscriptionCandidate(query, candidate) {
  const q = normalizeTranscription(query);
  const c = normalizeTranscription(candidate);
  if (!q || !c) return 0;

  const qWords = splitTranscriptionWords(q);
  const cWords = splitTranscriptionWords(c);
  let best = 0;

  if (c === q) best = Math.max(best, 132);
  if (c.startsWith(q)) best = Math.max(best, 118);
  if (` ${c} `.includes(` ${q} `)) best = Math.max(best, 112);
  if (q.length >= 2 && c.includes(q)) best = Math.max(best, 98);

  if (qWords.length > 1) {
    let matched = 0;
    let prefix = 0;
    let loose = 0;

    for (const qWord of qWords) {
      if (cWords.some((cWord) => cWord === qWord)) {
        matched += 1;
      } else if (cWords.some((cWord) => cWord.startsWith(qWord) || qWord.startsWith(cWord))) {
        prefix += 1;
      } else if (cWords.some((cWord) => cWord.includes(qWord) || qWord.includes(cWord))) {
        loose += 1;
      }
    }

    const coverage = (matched + (prefix * 0.8) + (loose * 0.5)) / qWords.length;
    best = Math.max(best, 42 + (coverage * 70));
  } else {
    const qWord = qWords[0] || q;
    if (cWords.some((cWord) => cWord === qWord)) best = Math.max(best, 124);
    if (cWords.some((cWord) => cWord.startsWith(qWord))) best = Math.max(best, 114);
    if (cWords.some((cWord) => qWord.startsWith(cWord) && cWord.length >= 2)) best = Math.max(best, 104);
    if (cWords.some((cWord) => cWord.includes(qWord) || qWord.includes(cWord))) best = Math.max(best, 94);
  }

  const relevantParts = [c, ...cWords.filter((word) => word.length >= Math.min(2, q.length))];
  let bestSimilarity = 0;
  for (const part of relevantParts) {
    bestSimilarity = Math.max(bestSimilarity, transcriptionSimilarity(q, part));
  }

  if (bestSimilarity >= 0.98) best = Math.max(best, 120);
  else if (bestSimilarity >= 0.94) best = Math.max(best, 112);
  else if (bestSimilarity >= 0.88) best = Math.max(best, 100);
  else if (bestSimilarity >= 0.82) best = Math.max(best, 88);
  else if (bestSimilarity >= 0.74) best = Math.max(best, 72);
  else if (bestSimilarity >= 0.66) best = Math.max(best, 58);

  return Math.round(best * 100) / 100;
}

function scoreHebrewCandidate(query, candidate) {
  const q = normalizeHebrew(query);
  const c = normalizeHebrew(candidate);
  if (!q || !c) return 0;

  const qWords = splitHebrewWords(q);
  const cWords = splitHebrewWords(c);
  let best = 0;

  if (c === q) best = Math.max(best, 136);
  if (c.startsWith(q)) best = Math.max(best, 122);
  if (` ${c} `.includes(` ${q} `)) best = Math.max(best, 116);
  if (q.length >= 2 && c.includes(q)) best = Math.max(best, 102);

  if (qWords.length > 1) {
    let exact = 0;
    let prefix = 0;
    let loose = 0;

    for (const qWord of qWords) {
      if (cWords.some((cWord) => cWord === qWord)) {
        exact += 1;
      } else if (cWords.some((cWord) => cWord.startsWith(qWord) || qWord.startsWith(cWord))) {
        prefix += 1;
      } else if (cWords.some((cWord) => cWord.includes(qWord) || qWord.includes(cWord))) {
        loose += 1;
      }
    }

    const coverage = (exact + (prefix * 0.8) + (loose * 0.52)) / qWords.length;
    best = Math.max(best, 44 + (coverage * 72));
  } else {
    const qWord = qWords[0] || q;
    if (cWords.some((cWord) => cWord === qWord)) best = Math.max(best, 128);
    if (cWords.some((cWord) => cWord.startsWith(qWord))) best = Math.max(best, 118);
    if (cWords.some((cWord) => qWord.startsWith(cWord) && cWord.length >= 2)) best = Math.max(best, 108);
    if (cWords.some((cWord) => cWord.includes(qWord) || qWord.includes(cWord))) best = Math.max(best, 96);
  }

  const relevantParts = [c, ...cWords.filter((word) => word.length >= Math.min(2, q.length))];
  let bestSimilarity = 0;
  for (const part of relevantParts) {
    bestSimilarity = Math.max(bestSimilarity, hebrewSimilarity(q, part));
  }

  if (bestSimilarity >= 0.98) best = Math.max(best, 124);
  else if (bestSimilarity >= 0.94) best = Math.max(best, 116);
  else if (bestSimilarity >= 0.88) best = Math.max(best, 104);
  else if (bestSimilarity >= 0.82) best = Math.max(best, 92);
  else if (bestSimilarity >= 0.74) best = Math.max(best, 76);
  else if (bestSimilarity >= 0.66) best = Math.max(best, 62);

  return Math.round(best * 100) / 100;
}

function prepareFieldValues(value) {
  return splitSlashValues(value)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getSortedLessons(rows) {
  return [...new Set(rows.map((row) => String(row?.Lektion ?? '').trim()).filter(Boolean))]
    .sort((a, b) => Number(a) - Number(b) || collator.compare(a, b));
}

function prepareEntries(rows) {
  return rows.map((row, index) => {
    const prepared = {
      ...row,
      __index: index,
      __search: {},
      __transcriptionSearch: prepareFieldValues(row[TRANSCRIPTION_FIELD]),
      __hebrewSearch: prepareFieldValues(row[HEBREW_FIELD]),
    };

    for (const field of SEARCH_FIELDS) {
      prepared.__search[field] = prepareFieldValues(row[field]);
    }

    return prepared;
  });
}

function scoreEntry(entry, query) {
  const result = { deutsch: 0, secondary: 0, total: 0 };
  let secondarySum = 0;

  for (const candidate of entry.__search.Deutsch) {
    result.deutsch = Math.max(result.deutsch, scoreCandidate(query, candidate));
  }

  for (const field of SECONDARY_FIELDS) {
    let bestFieldScore = 0;
    for (const candidate of entry.__search[field]) {
      const normalizedCandidate = normalize(candidate);
      if (!normalizedCandidate) continue;
      if (query.trim().length > 2 && normalizedCandidate.length < 2) continue;
      bestFieldScore = Math.max(bestFieldScore, scoreCandidate(query, candidate));
    }
    const weighted = bestFieldScore * SECONDARY_WEIGHTS[field];
    result.secondary = Math.max(result.secondary, weighted);
    secondarySum += weighted;
  }

  result.total = (result.deutsch * 4) + result.secondary + (secondarySum * 0.22);
  return result;
}

function scoreTranscriptionEntry(entry, query) {
  const result = { transcription: 0, total: 0 };

  for (const candidate of entry.__transcriptionSearch) {
    const normalizedCandidate = normalizeTranscription(candidate);
    if (!normalizedCandidate) continue;
    result.transcription = Math.max(result.transcription, scoreTranscriptionCandidate(query, candidate));
  }

  result.total = result.transcription;
  return result;
}

function scoreHebrewEntry(entry, query) {
  const result = { hebrew: 0, total: 0 };

  for (const candidate of entry.__hebrewSearch) {
    const normalizedCandidate = normalizeHebrew(candidate);
    if (!normalizedCandidate) continue;
    result.hebrew = Math.max(result.hebrew, scoreHebrewCandidate(query, candidate));
  }

  result.total = result.hebrew;
  return result;
}

function defaultSort(a, b) {
  const lessonDiff = Number(a.Lektion || 0) - Number(b.Lektion || 0);
  if (lessonDiff !== 0) return lessonDiff;
  return collator.compare(String(a.Deutsch || ''), String(b.Deutsch || ''));
}

function shouldIncludeMatch(score, query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;
  const isShort = normalizedQuery.length <= 2;
  if (score.deutsch >= (isShort ? 90 : 48)) return true;
  if (score.secondary >= (isShort ? 96 : 58)) return true;
  return false;
}

function shouldIncludeTranscriptionMatch(score, query) {
  const normalizedQuery = normalizeTranscription(query);
  if (!normalizedQuery) return true;
  const isShort = normalizedQuery.length <= 2;
  return score.transcription >= (isShort ? 96 : 58);
}

function shouldIncludeHebrewMatch(score, query) {
  const normalizedQuery = normalizeHebrew(query);
  if (!normalizedQuery) return true;
  const isShort = normalizedQuery.length <= 2;
  return score.hebrew >= (isShort ? 98 : 62);
}

function rankEntries(entries, query, transcriptionQuery, hebrewQuery) {
  const trimmed = query.trim();
  const trimmedTranscription = transcriptionQuery.trim();
  const trimmedHebrew = hebrewQuery.trim();

  if (!trimmed && !trimmedTranscription && !trimmedHebrew) {
    return [...entries]
      .sort(defaultSort)
      .map((entry) => ({
        entry,
        score: { deutsch: 0, secondary: 0, transcription: 0, hebrew: 0, total: 0 },
      }));
  }

  return entries
    .map((entry) => {
      const textScore = trimmed ? scoreEntry(entry, trimmed) : { deutsch: 0, secondary: 0, total: 0 };
      const transcriptionScore = trimmedTranscription
        ? scoreTranscriptionEntry(entry, trimmedTranscription)
        : { transcription: 0, total: 0 };
      const hebrewScore = trimmedHebrew
        ? scoreHebrewEntry(entry, trimmedHebrew)
        : { hebrew: 0, total: 0 };

      return {
        entry,
        score: {
          deutsch: textScore.deutsch,
          secondary: textScore.secondary,
          transcription: transcriptionScore.transcription,
          hebrew: hebrewScore.hebrew,
          total: textScore.total + (transcriptionScore.total * 4) + (hebrewScore.total * 4.25),
        },
      };
    })
    .filter((item) => {
      const matchesText = !trimmed || shouldIncludeMatch(item.score, trimmed);
      const matchesTranscription = !trimmedTranscription || shouldIncludeTranscriptionMatch(item.score, trimmedTranscription);
      const matchesHebrew = !trimmedHebrew || shouldIncludeHebrewMatch(item.score, trimmedHebrew);
      return matchesText && matchesTranscription && matchesHebrew;
    })
    .sort((left, right) => {
      if (right.score.hebrew !== left.score.hebrew) return right.score.hebrew - left.score.hebrew;
      if (right.score.transcription !== left.score.transcription) return right.score.transcription - left.score.transcription;
      if (right.score.deutsch !== left.score.deutsch) return right.score.deutsch - left.score.deutsch;
      if (right.score.secondary !== left.score.secondary) return right.score.secondary - left.score.secondary;
      if (right.score.total !== left.score.total) return right.score.total - left.score.total;
      const lessonDiff = Number(left.entry.Lektion || 0) - Number(right.entry.Lektion || 0);
      if (lessonDiff !== 0) return lessonDiff;
      return collator.compare(String(left.entry.Deutsch || ''), String(right.entry.Deutsch || ''));
    });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


const BIDI_RLI = '\u2067';
const BIDI_LRI = '\u2066';
const BIDI_PDI = '\u2069';
let copyToastTimeoutId = null;

function normalizeCopyPart(value) {
  return String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function createEntryCopyText(entry) {
  const hebrew = normalizeCopyPart(entry?.[HEBREW_FIELD]) || '—';
  const deutsch = normalizeCopyPart(entry?.Deutsch) || '—';

  // Hebrew is isolated as RTL and German as LTR so the pasted plain-text order stays:
  // Hebrew - Deutsch, even in mixed-direction contexts such as iOS Notes or Safari fields.
  return `${BIDI_RLI}${hebrew}${BIDI_PDI} - ${BIDI_LRI}${deutsch}${BIDI_PDI}`;
}

function createCopyToast() {
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('aria-atomic', 'true');
  toast.textContent = 'kopiert';
  document.body.appendChild(toast);
  return toast;
}

function showCopyToast(message = 'kopiert') {
  const toast = document.querySelector('.copy-toast') || createCopyToast();
  toast.textContent = message;

  if (copyToastTimeoutId !== null) {
    window.clearTimeout(copyToastTimeoutId);
    copyToastTimeoutId = null;
  }

  window.requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  copyToastTimeoutId = window.setTimeout(() => {
    toast.classList.remove('is-visible');
    copyToastTimeoutId = null;
  }, 900);
}

function copyWithTemporarySelection(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.autocapitalize = 'off';
  textarea.autocomplete = 'off';
  textarea.autocorrect = 'off';
  textarea.spellcheck = false;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '1px';
  textarea.style.height = '1px';
  textarea.style.padding = '0';
  textarea.style.border = '0';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  textarea.style.fontSize = '16px';
  textarea.style.direction = 'ltr';
  textarea.style.unicodeBidi = 'plaintext';

  const activeElement = document.activeElement;
  const selection = window.getSelection?.();
  const previousRanges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
    : [];

  document.body.appendChild(textarea);

  try {
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    return document.execCommand('copy');
  } catch (error) {
    return false;
  } finally {
    textarea.remove();

    if (selection && previousRanges.length) {
      selection.removeAllRanges();
      for (const range of previousRanges) selection.addRange(range);
    }

    if (activeElement && typeof activeElement.focus === 'function') {
      try {
        activeElement.focus({ preventScroll: true });
      } catch (error) {
        // Restoring focus is best-effort only.
      }
    }
  }
}

async function copyTextToClipboard(text) {
  // The synchronous path runs inside the click/tap gesture and is the most reliable fallback
  // for iOS Safari, especially outside secure contexts.
  if (copyWithTemporarySelection(text)) return true;

  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  throw new Error('Clipboard API nicht verfügbar');
}

function highlightDeutsch(text, query) {
  const safeText = escapeHtml(text);
  const normalizedQuery = normalize(query);
  if (!normalizedQuery || normalizedQuery.length < 2) return safeText;

  return String(text ?? '')
    .split(/(\s+)/)
    .map((part) => {
      if (/^\s+$/.test(part)) return part;
      const normalizedPart = normalize(part);
      if (!normalizedPart) return escapeHtml(part);

      const shouldMark =
        normalizedPart === normalizedQuery ||
        normalizedPart.startsWith(normalizedQuery) ||
        (normalizedQuery.length >= 4 && normalizedPart.includes(normalizedQuery)) ||
        similarity(normalizedPart, normalizedQuery) >= 0.84;

      return shouldMark ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part);
    })
    .join('');
}

function getFilteredEntries() {
  if (!state.selectedLessons.size) return [];
  return state.entries.filter((entry) => state.selectedLessons.has(String(entry.Lektion ?? '').trim()));
}

function updateFilterButtonLabel() {
  const total = state.lessons.length;
  const selected = state.selectedLessons.size;
  if (selected === total) {
    els.filterButton.textContent = 'Kapitel';
  } else if (selected === 0) {
    els.filterButton.textContent = 'Kapitel (0)';
  } else {
    els.filterButton.textContent = `Kapitel (${selected})`;
  }
}

function renderLessonList() {
  els.lessonList.innerHTML = state.lessons.map((lesson) => {
    const key = escapeHtml(lesson);
    const checked = state.selectedLessons.has(lesson) ? 'checked' : '';
    return `
      <label class="lesson-option">
        <input type="checkbox" value="${key}" ${checked} />
        <span>Lektion ${key}</span>
      </label>
    `;
  }).join('');

  updateFilterButtonLabel();
}

function renderResults(items, message = '') {
  if (message) {
    els.resultsHost.className = 'plain';
    els.resultsHost.innerHTML = escapeHtml(message);
    return;
  }

  if (!items.length) {
    els.resultsHost.className = 'plain';
    els.resultsHost.textContent = 'Keine Treffer';
    return;
  }

  const rows = items.map(({ entry }) => {
    const copyText = createEntryCopyText(entry);
    const copyLabel = `${normalizeCopyPart(entry?.[HEBREW_FIELD]) || '—'} - ${normalizeCopyPart(entry?.Deutsch) || '—'}`;

    return `
      <button class="row" type="button" data-copy-text="${escapeHtml(copyText)}" aria-label="Eintrag kopieren: ${escapeHtml(copyLabel)}">
        <span class="lesson">Lektion ${escapeHtml(entry.Lektion ?? '')}</span>
        <span class="hebrew">${escapeHtml(entry.Hebräisch || '—')}</span>
        <span class="deutsch">${highlightDeutsch(entry.Deutsch || '', state.query)}</span>
      </button>
    `;
  }).join('');

  els.resultsHost.className = 'list';
  els.resultsHost.innerHTML = rows;
}

function render() {
  if (!state.entries.length) return;
  if (!state.selectedLessons.size) {
    renderResults([], 'Keine Kapitel ausgewählt');
    return;
  }

  const ranked = rankEntries(getFilteredEntries(), state.query, state.transcriptionQuery, state.hebrewQuery);
  renderResults(ranked);
}

const debouncedRender = debounce(render, INPUT_DEBOUNCE_MS);

function syncSearchUi() {
  els.searchWrap.classList.toggle('has-value', !!els.searchInput.value.trim());
  els.transcriptionSearchWrap.classList.toggle('has-value', !!els.transcriptionSearchInput.value.trim());
  els.hebrewSearchWrap.classList.toggle('has-value', !!els.hebrewSearchInput.value.trim());
}

function openDropdown() {
  els.dropdown.classList.add('is-open');
  els.filterButton.setAttribute('aria-expanded', 'true');
}

function closeDropdown() {
  els.dropdown.classList.remove('is-open');
  els.filterButton.setAttribute('aria-expanded', 'false');
}

function setInfoTab(tabName) {
  if (!els.infoTabButtons.length || !els.infoTabPanels.length) return;

  for (const button of els.infoTabButtons) {
    const isActive = button.dataset.tabTarget === tabName;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  }

  for (const panel of els.infoTabPanels) {
    const isActive = panel.dataset.tabPanel === tabName;
    panel.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  }
}

function openInfoOverlay() {
  closeDropdown();
  setInfoTab('general');
  els.infoOverlay.hidden = false;
  els.infoButton.setAttribute('aria-expanded', 'true');
  els.infoCloseButton.focus({ preventScroll: true });
}

function closeInfoOverlay({ restoreFocus = false } = {}) {
  if (els.infoOverlay.hidden) return;
  els.infoOverlay.hidden = true;
  els.infoButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) els.infoButton.focus({ preventScroll: true });
}

async function loadData() {
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('Die JSON-Datei ist kein Array.');

    state.entries = prepareEntries(rows);
    state.lessons = getSortedLessons(rows);
    state.selectedLessons = new Set(state.lessons);
    renderLessonList();
    render();
  } catch (error) {
    const localFileHint = window.location.protocol === 'file:'
      ? 'Öffne die Datei über einen lokalen Server, z. B. mit: python -m http.server'
      : String(error?.message || error);
    renderResults([], localFileHint);
  }
}

els.resultsHost.addEventListener('click', async (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const row = target?.closest('.row[data-copy-text]');
  if (!row || !els.resultsHost.contains(row)) return;

  try {
    await copyTextToClipboard(row.dataset.copyText || '');
    showCopyToast('kopiert');
  } catch (error) {
    showCopyToast('nicht kopiert');
  }
});

els.searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  syncSearchUi();
  debouncedRender();
});

els.transcriptionSearchInput.addEventListener('input', (event) => {
  state.transcriptionQuery = event.target.value;
  syncSearchUi();
  debouncedRender();
});

els.hebrewSearchInput.addEventListener('input', (event) => {
  state.hebrewQuery = event.target.value;
  syncSearchUi();
  debouncedRender();
});

els.clearBtn.addEventListener('click', () => {
  debouncedRender.cancel();
  els.searchInput.value = '';
  state.query = '';
  syncSearchUi();
  render();
  els.searchInput.focus();
});

els.transcriptionClearBtn.addEventListener('click', () => {
  debouncedRender.cancel();
  els.transcriptionSearchInput.value = '';
  state.transcriptionQuery = '';
  syncSearchUi();
  render();
  els.transcriptionSearchInput.focus();
});

els.hebrewClearBtn.addEventListener('click', () => {
  debouncedRender.cancel();
  els.hebrewSearchInput.value = '';
  state.hebrewQuery = '';
  syncSearchUi();
  render();
  els.hebrewSearchInput.focus();
});

els.infoButton.addEventListener('click', () => {
  openInfoOverlay();
});

els.infoCloseButton.addEventListener('click', () => {
  closeInfoOverlay({ restoreFocus: true });
});

els.infoOverlay.addEventListener('click', (event) => {
  if (event.target === els.infoOverlay) closeInfoOverlay({ restoreFocus: true });
});

for (const button of els.infoTabButtons) {
  button.addEventListener('click', () => {
    setInfoTab(button.dataset.tabTarget || 'general');
  });
}

els.filterButton.addEventListener('click', () => {
  const isOpen = els.dropdown.classList.contains('is-open');
  if (isOpen) closeDropdown();
  else openDropdown();
});

els.selectAllBtn.addEventListener('click', () => {
  debouncedRender.cancel();
  state.selectedLessons = new Set(state.lessons);
  renderLessonList();
  render();
});

els.selectNoneBtn.addEventListener('click', () => {
  debouncedRender.cancel();
  state.selectedLessons = new Set();
  renderLessonList();
  render();
});

els.lessonList.addEventListener('change', (event) => {
  debouncedRender.cancel();
  const input = event.target.closest('input[type="checkbox"]');
  if (!input) return;
  const lesson = String(input.value ?? '').trim();
  if (input.checked) state.selectedLessons.add(lesson);
  else state.selectedLessons.delete(lesson);
  updateFilterButtonLabel();
  render();
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.filter-wrap')) closeDropdown();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDropdown();
  if ((event.key === 'k' && (event.ctrlKey || event.metaKey)) || event.key === '/') {
    const targetTag = document.activeElement?.tagName?.toLowerCase();
    const isTypingContext = ['input', 'textarea'].includes(targetTag) || document.activeElement?.isContentEditable;
    if (!isTypingContext) {
      event.preventDefault();
      els.searchInput.focus();
      els.searchInput.select();
    }
  }
});

syncSearchUi();
setInfoTab('general');
loadData();
