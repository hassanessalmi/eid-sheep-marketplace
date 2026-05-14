import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import getSheepData from '../data/sheep'

function DetailsPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [sheep, setSheep] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sheepData = getSheepData(i18n.language)
   const foundSheep = sheepData.find(s => String(s.id) === String(id))
    setSheep(foundSheep)
    setLoading(false)
    window.scrollTo(0, 0)
  }, [id, i18n.language])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-4">🐑</div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!sheep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('details.notFound')}
          </h2>
          <Link 
            to="/listings" 
            className="text-moroccan-green-600 hover:text-moroccan-green-700 font-medium"
          >
            {t('details.backToListings')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            to="/listings" 
            className="text-moroccan-green-600 hover:text-moroccan-green-700 flex items-center gap-2"
          >
            ← {t('details.backToListings').replace('←', '')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img 
                src={sheep.images[0]} 
                alt={sheep.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {sheep.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${sheep.name} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <span className="inline-block bg-moroccan-green-100 dark:bg-moroccan-green-900 
                             text-moroccan-green-700 dark:text-moroccan-green-300 
                             px-4 py-1 rounded-full text-sm font-medium mb-4">
                {sheep.category}
              </span>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {sheep.name}
              </h1>

              <p className="text-3xl font-bold text-moroccan-green-600 mb-6">
                {formatPrice(sheep.price)}
              </p>

              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {sheep.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('details.breed')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{sheep.breed}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('details.weight')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{sheep.weight} kg</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('details.age')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{sheep.age}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('details.color')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{sheep.color}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('details.location')}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">📍 {sheep.city}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('details.seller')}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <p className="font-medium text-gray-900 dark:text-white text-lg mb-1">
                    {sheep.seller.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    ⭐ {sheep.seller.rating} {t('details.rating')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📍 {sheep.seller.location}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    🏆 {sheep.seller.experience}
                  </p>
                </div>
              </div>

              {sheep.healthCert && sheep.vaccination && (
                <div className="flex gap-4 mb-6">
                  <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                    ✅ Certificat sanitaire
                  </span>
                  <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                    💉 Vacciné
                  </span>
                </div>
              )}

              <a
                href={`https://wa.me/${sheep.seller.phone}?text=${encodeURIComponent(t('whatsapp.message', { name: sheep.name }))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full text-center text-lg py-4"
              >
                {t('details.contactWhatsapp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsPage