import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const languages = [
  { code: 'en', label: 'English', icon: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', icon: '🇮🇳' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={i18n.language === lang.code ? 'active' : ''}
          onClick={() => i18n.changeLanguage(lang.code)}
          aria-label={lang.label}
        >
          <span className="lang-icon">{lang.icon}</span> {lang.label}
        </button>
      ))}
    </div>
  );
}
