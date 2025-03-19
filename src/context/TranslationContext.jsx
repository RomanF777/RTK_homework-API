import React, { createContext, useState, useEffect } from "react";
import translationsObject from "../localization";

export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");
  const [translations, setTranslations] = useState(() => {
    translationsObject.setLanguage(language);
    return { ...translationsObject };
  });

  useEffect(() => {
    translationsObject.setLanguage(language);
    setTranslations({ ...translationsObject });
    localStorage.setItem("lang", language);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ translations, language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};
