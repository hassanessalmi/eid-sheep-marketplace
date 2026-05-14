import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🐑</span>
            <span className="text-2xl font-bold text-moroccan-green-600 dark:text-moroccan-green-400">
              {t('site.name')}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-moroccan-green-600 transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/listings" 
              className="text-gray-700 dark:text-gray-300 hover:text-moroccan-green-600 transition-colors"
            >
              {t('nav.allSheep')}
            </Link>
            
            <LanguageSwitcher />
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title={t('darkMode')}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              title={t('darkMode')}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-moroccan-green-600 transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/listings" 
                className="text-gray-700 dark:text-gray-300 hover:text-moroccan-green-600 transition-colors px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.allSheep')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar