import { useTranslation } from 'react-i18next'
import SheepCard from './SheepCard'

function FeaturedSheep({ sheep }) {
  const { t } = useTranslation()
  const featuredSheep = sheep.filter(s => s.featured)

  return (
    <section id="featured" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('featured.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('featured.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSheep.map(s => (
            <SheepCard key={s.id} sheep={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedSheep