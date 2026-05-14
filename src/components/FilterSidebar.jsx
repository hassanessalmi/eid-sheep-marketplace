import { useTranslation } from 'react-i18next'

function FilterSidebar({ filters, setFilters, cities }) {
  const { t } = useTranslation()
  const breeds = ['Sardi', 'Bergui', 'Timahdite', "D'man"]
  const categories = ['Premium', 'Standard', 'Économique']

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {t('listing.filters.title')}
      </h2>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase">
          {t('listing.filters.city')}
        </h3>
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 
                   dark:border-gray-600 dark:bg-gray-700 dark:text-white
                   focus:border-moroccan-green-500 focus:outline-none"
        >
          <option value="">{t('listing.filters.allCities')}</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase">
          {t('listing.filters.breed')}
        </h3>
        <div className="space-y-2">
          {breeds.map(breed => (
            <label key={breed} className="flex items-center">
              <input
                type="radio"
                name="breed"
                value={breed}
                checked={filters.breed === breed}
                onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
                className="mr-2 text-moroccan-green-600 focus:ring-moroccan-green-500"
              />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{breed}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase">
          {t('listing.filters.category')}
        </h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="mr-2 text-moroccan-green-600 focus:ring-moroccan-green-500"
              />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase">
          {t('listing.filters.maxPrice')}
        </h3>
        <input
          type="range"
          min="2000"
          max="7000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="w-full accent-moroccan-green-600"
        />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span>2,000 MAD</span>
          <span>{Number(filters.maxPrice).toLocaleString()} MAD</span>
        </div>
      </div>

      <button
        onClick={() => setFilters({ city: '', breed: '', category: '', maxPrice: '7000' })}
        className="w-full mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 
                 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                 transition-colors text-sm"
      >
        {t('listing.filters.reset')}
      </button>
    </div>
  )
}

export default FilterSidebar