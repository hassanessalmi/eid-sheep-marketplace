import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function HeroSection() {
  const { t } = useTranslation()

  return (
    <div className="relative bg-gradient-to-br from-moroccan-green-600 to-moroccan-green-800 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              {t('hero.title')}
              <span className="block text-moroccan-green-200">{t('hero.subtitle')}</span>
            </h1>
            <p className="text-xl text-moroccan-green-100 max-w-lg">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/listings"
                className="btn-primary bg-white text-moroccan-green-700 hover:bg-moroccan-green-50 inline-block"
              >
                {t('hero.browseListings')}
              </Link>
              <a
                href="#featured"
                className="btn-primary border-2 border-white text-white hover:bg-white hover:text-moroccan-green-700 inline-block"
                style={{ backgroundColor: 'transparent' }}
              >
                {t('hero.featuredSheep')}
              </a>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold">50+</p>
                <p className="text-moroccan-green-200 text-sm">{t('hero.stats.available')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">10+</p>
                <p className="text-moroccan-green-200 text-sm">{t('hero.stats.cities')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-moroccan-green-200 text-sm">{t('hero.stats.contact')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection