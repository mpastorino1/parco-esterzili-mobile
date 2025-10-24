import { I18n } from "i18n-js";
import it from "./it.json";
import en from "./en.json";

const i18n = new I18n({
  en,
  it,
});

i18n.defaultLocale = "en";
i18n.enableFallback = true;

export default i18n;
