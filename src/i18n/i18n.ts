// languages.json build via CI build
// to generate for localhost/dev, run `build_i18n_json.sh` script
import * as languages from "./languages.json";

function getLangs() {
  const langs = languages.language_metadata;

  Object.keys(languages).map((lang) => {
    if (lang === "language_metadata" || lang == "steam_language_map") {
      return;
    }
    const strs = languages[lang];
    if (lang && strs && langs[lang]?.name) {
      langs[lang].strings = strs;
    }
  });

  return langs;
}

// Map Steam language codes (e.g. "schinese") to i18n keys (e.g. "zh")
// Returns undefined if no mapping found
function mapSteamLang(steamLang: string): string | undefined {
  const map: { [key: string]: string } = languages.steam_language_map as unknown as { [key: string]: string };
  return map[steamLang];
}

/*
LANGS example:

{
  ko: {
    name: "한국어",
    strings: languages["ko"],
  },
  ja: {
    name: "日本語",
    strings: languages["ja"],
  },
};

*/
export const LANGS: {
  [key: string]: {
    name: string;
    strings: {
      [key: string]: string;
    };
  };
} = getLangs();

let cachedLang: string | undefined;

export const getCurrentLanguage = (): string => {
  if (cachedLang) return cachedLang;

  const steamLang = window.LocalizationManager.m_rgLocalesToUse[0];
  // Map Steam language code to i18n key; default to "zh" for this zh-CN fork
  const lang = mapSteamLang(steamLang) || "zh";
  cachedLang = lang;
  return lang;
};

export const getLanguageName = (lang?: string): string => {
  const targetLang = lang || getCurrentLanguage();
  return LANGS[targetLang]?.name || targetLang;
};

/**
 * Translate a key to the current language
 *
 * @param key - Translation key
 * @param originalString - Original text (fallback)
 * @returns Translated string or original text if translation not found
 *
 * @example
 * t('TDP_PROFILE_ENABLE_DESKTOP', 'Enable Desktop Profile')
 */
const t = (key: string, originalString: string): string => {
  const lang = getCurrentLanguage();

  // English always returns the original text
  if (lang === "en") return originalString;

  // Return translation if exists, otherwise return original text
  return LANGS[lang]?.strings?.[key] ?? originalString;
};

export default t;
