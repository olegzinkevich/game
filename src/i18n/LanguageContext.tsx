import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, DEFAULT_LANGUAGE, translations, TranslationStrings, interpolate } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
  // Helper function to translate with parameters
  translate: (key: keyof TranslationStrings, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage = DEFAULT_LANGUAGE
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // Update language when initialLanguage prop changes (e.g., after SDK detection)
  useEffect(() => {
    console.log('LanguageProvider: initialLanguage prop changed to:', initialLanguage);
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const translate = useCallback((key: keyof TranslationStrings, params?: Record<string, string | number>): string => {
    const str = translations[language][key];
    if (params) {
      return interpolate(str, params);
    }
    return str;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use translations
export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

// Helper to detect language STRICTLY from Yandex SDK
// This function should only be called after waiting for SDK to be available
export const detectLanguage = (): Language => {
  // Debug: Log all available SDK info
  if (typeof window !== 'undefined') {
    const ysdk = (window as any).ysdk;
    console.log('=== Yandex SDK Language Detection ===');
    console.log('window.ysdk available:', !!ysdk);
    console.log('window.ysdk?.environment?.i18n?.lang:', ysdk?.environment?.i18n?.lang);
  }

  // Get language ONLY from Yandex SDK
  if (typeof window !== 'undefined' && (window as any).ysdk?.environment?.i18n?.lang) {
    const sdkLang = (window as any).ysdk.environment.i18n.lang;
    console.log('Yandex SDK language:', sdkLang);

    // Check if SDK language is directly supported
    if (sdkLang === 'ru' || sdkLang === 'en' || sdkLang === 'es' || sdkLang === 'tr' || sdkLang === 'kk' || sdkLang === 'uz') {
      console.log('Using Yandex SDK language:', sdkLang);
      return sdkLang as Language;
    }

    // Map related language codes to supported languages
    if (sdkLang === 'uk' || sdkLang === 'be') {
      console.log('Mapping Yandex SDK language', sdkLang, 'to ru');
      return 'ru'; // Ukrainian, Belarusian -> Russian
    }

    // For any other SDK language, fall back to English (Yandex default)
    console.log('Yandex SDK language', sdkLang, 'not supported, using en');
    return 'en';
  }

  // SDK not available - use default (this should rarely happen if we wait properly)
  console.log('Yandex SDK not available, using default:', DEFAULT_LANGUAGE);
  return DEFAULT_LANGUAGE;
};
