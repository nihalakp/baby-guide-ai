// Everything here lives in the browser only. Reads and writes are wrapped in
// try/catch because storage can be unavailable (private mode, quota, SSR).
const HISTORY_KEY = 'babyguide.history.v1';
const THEME_KEY = 'babyguide.theme.v1';

function read(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore: the app still works without persistence */
  }
}

export function loadHistory() {
  try {
    const parsed = JSON.parse(read(HISTORY_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(items) {
  write(HISTORY_KEY, JSON.stringify(items));
}

export function loadTheme() {
  return read(THEME_KEY);
}

export function saveTheme(themeId) {
  write(THEME_KEY, themeId);
}
