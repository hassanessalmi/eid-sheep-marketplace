import sheepAR from './sheep_dataset_ar.json'
import sheepFR from './sheep_dataset_fr.json'

export const getSheepData = (language) => {
  switch (language) {
    case 'ar':
      return sheepAR
    case 'fr':
      return sheepFR
    default:
      return sheepAR // Langue par défaut : Arabe
  }
}

export default getSheepData