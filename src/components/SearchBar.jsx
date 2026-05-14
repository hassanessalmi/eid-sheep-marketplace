import { useTranslation } from 'react-i18next'

function SearchBar({ searchTerm, setSearchTerm }) {
  const { t } = useTranslation()

  return (
    <div className="relative flex-1 max-w-xl">
      <input
        type="text"
        placeholder={t('listing.searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-300 
                 dark:border-gray-600 dark:bg-gray-800 dark:text-white
                 focus:border-moroccan-green-500 focus:outline-none
                 transition-colors duration-300"
      />
      <svg
        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  )
}

export default SearchBar