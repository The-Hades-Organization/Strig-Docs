export const THEME_KEY = 'strig-theme';

export type ThemeChoice = 'light' | 'dark';

// Runs before first paint so the page never flashes the wrong theme.
// Static string with no external input; it reads the stored choice and
// falls back to the system preference.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;
