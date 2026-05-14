import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lng
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
          i18n.language === 'ar'
            ? 'bg-white dark:bg-gray-600 text-moroccan-green-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-moroccan-green-600'
        }`}
      >
        عربي
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
          i18n.language === 'fr'
            ? 'bg-white dark:bg-gray-600 text-moroccan-green-600 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:text-moroccan-green-600'
        }`}
      >
        FR
      </button>
    </div>
  )
}

export default LanguageSwitcher