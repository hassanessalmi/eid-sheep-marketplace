import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function SheepCard({ sheep }) {
  const { t } = useTranslation()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg card-hover transition-all duration-300">
      <Link to={`/sheep/${sheep.id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img 
            src={sheep.images[0]} 
            alt={sheep.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-moroccan-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {sheep.category}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/sheep/${sheep.id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-moroccan-green-600 transition-colors">
            {sheep.name}
          </h3>
        </Link>
        
        <div className="space-y-2 mb-4">
          <p className="text-2xl font-bold text-moroccan-green-600">
            {formatPrice(sheep.price)}
          </p>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm gap-4">
            <span>⚖️ {sheep.weight} kg</span>
            <span>📍 {sheep.city}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm gap-4">
            <span>🐑 {sheep.breed}</span>
            <span>🎨 {sheep.color}</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {sheep.description}
        </p>

        <div className="flex items-center justify-between">
          <Link 
            to={`/sheep/${sheep.id}`}
            className="text-moroccan-green-600 hover:text-moroccan-green-700 font-medium text-sm"
          >
            {t('sheepCard.viewDetails')}
          </Link>
          
          <a
            href={`https://wa.me/${sheep.seller.phone}?text=${encodeURIComponent(t('whatsapp.message', { name: sheep.name }))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium 
                     hover:bg-green-600 transition-colors flex items-center gap-1"
          >
            <span>💬</span> {t('sheepCard.whatsapp')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default SheepCard