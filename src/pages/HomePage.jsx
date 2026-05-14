import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import getSheepData from '../data/sheep'
import HeroSection from '../components/HeroSection'
import FeaturedSheep from '../components/FeaturedSheep'
import CategorySection from '../components/CategorySection'

function HomePage() {
  const { i18n } = useTranslation()
  const [sheep, setSheep] = useState([])

  useEffect(() => {
    const data = getSheepData(i18n.language)
    setSheep(data)
  }, [i18n.language])

  return (
    <div>
      <HeroSection />
      <FeaturedSheep sheep={sheep} />
      <CategorySection />
    </div>
  )
}

export default HomePage