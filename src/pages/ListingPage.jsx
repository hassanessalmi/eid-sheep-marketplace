import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import getSheepData from '../data/sheep'
import SheepCard from '../components/SheepCard'
import SearchBar from '../components/SearchBar'
import FilterSidebar from '../components/FilterSidebar'

function ListingPage() {
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const [sheep, setSheep] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    city: '',
    breed: '',
    category: '',
    maxPrice: '7000'
  })

  useEffect(() => {
    const data = getSheepData(i18n.language)
    setSheep(data)
    
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }))
    }
  }, [i18n.language, searchParams])

  const cities = [...new Set(sheep.map(s => s.city))].sort()

  const filteredSheep = sheep.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCity = !filters.city || s.city === filters.city
    const matchesBreed = !filters.breed || s.breed === filters.breed
    const matchesCategory = !filters.category || s.category === filters.category
    const matchesPrice = s.price <= Number(filters.maxPrice)

    return matchesSearch && matchesCity && matchesBreed && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('listing.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('listing.description')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden bg-white dark:bg-gray-800 px-4 py-3 rounded-xl 
                     border-2 border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-300"
          >
            {showFilters ? t('listing.hideFilters') : t('listing.showFilters')}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className={`md:w-72 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              cities={cities} 
            />
          </div>

          <div className="flex-1">
            {filteredSheep.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('listing.noResults')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('listing.noResultsDesc')}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600 dark:text-gray-400">
                  {t('listing.showing', { count: filteredSheep.length })}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSheep.map(s => (
                    <SheepCard key={s.id} sheep={s} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingPage