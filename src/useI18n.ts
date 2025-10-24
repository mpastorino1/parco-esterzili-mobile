import { useAppStore } from "./store/states";
import i18n from "./translations/i18n";

export const useI18n = () => {
  const lang = useAppStore((state) => state.lang);

  return { i18n, lang };
};
