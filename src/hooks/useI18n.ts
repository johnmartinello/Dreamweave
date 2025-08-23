import { useLanguageStore } from '../store/languageStore';
import { useTranslation, type TranslationKey } from '../utils/i18n';

export function useI18n() {
  const language = useLanguageStore((state) => state.language);
  const { t, tArray } = useTranslation(language);
  
  return {
    t: (key: TranslationKey, variables: Record<string, any> = {}) => t(key, variables),
    tArray: (key: TranslationKey) => tArray(key),
    language,
  };
}
