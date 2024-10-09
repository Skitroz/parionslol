const fs = require('fs');
const path = require('path');

let language = 'fr';

const loadTranslations = (lang) => {
    const filePath = path.join(__dirname, 'i18n', `${lang}.json`);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
        const defaultFilePath = path.join(__dirname, 'i18n', 'en.json');
        return JSON.parse(fs.readFileSync(defaultFilePath, 'utf8'));
    }
};

let translations = loadTranslations(language);

const setLanguage = (lang) => {
    language = lang;
    translations = loadTranslations(language);
};

const translate = (key) => {
    return translations[key] || key;
};

module.exports = { setLanguage, translate };
