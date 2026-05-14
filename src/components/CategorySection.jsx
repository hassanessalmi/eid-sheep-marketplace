import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function CategorySection() {
  const { t } = useTranslation()

  const categories = [
    {
      name: t('categories.premium.name'),
      description: t('categories.premium.description'),
      icon: '⭐',
      color: 'from-yellow-400 to-yellow-600',
      value: 'Premium'
    },
    {
      name: t('categories.standard.name'),
      description: t('categories.standard.description'),
      icon: '✅',
      color: 'from-moroccan-green-400 to-moroccan-green-600',
      value: 'Standard'
    },
    {
      name: t('categories.economy.name'),
      description: t('categories.economy.description'),
      icon: '💰',
      color: 'from-blue-400 to-blue-600',
      value: 'Économique'
    }
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('categories.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/listings?category=${category.value}`}
              className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white 
                         transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300`}
            >
              <div className="text-6xl mb-4">{category.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
              <p className="text-white/90">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection