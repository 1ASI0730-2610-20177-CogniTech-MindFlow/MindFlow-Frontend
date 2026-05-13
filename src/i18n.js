import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('mindflow-lang') || 'es',
  fallbackLocale: 'es',
  messages: {
    es,
    en
  },
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
})

export default i18n

