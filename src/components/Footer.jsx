import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-moroccan-green-600 dark:text-moroccan-green-400 mb-4">
              {t('site.name')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('footer.about')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-moroccan-green-600 dark:text-moroccan-green-400 mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="/" className="hover:text-moroccan-green-600 transition-colors">{t('nav.home')}</a></li>
              <li><a href="/listings" className="hover:text-moroccan-green-600 transition-colors">{t('nav.allSheep')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-moroccan-green-600 dark:text-moroccan-green-400 mb-4">
              {t('footer.contact')}
            </h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>📧 contact@souklaid.ma</p>
              <p>📱 +212 5XX-XXXXXX</p>
              <p>📍 Maroc</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer