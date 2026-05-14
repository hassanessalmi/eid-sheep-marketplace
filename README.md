# Sheep Marketplace Morocco

## Description

Application web pour consulter et gérer des annonces de moutons au Maroc. Le projet combine une interface React et un backend Python pour organiser les données et offrir une expérience simple pour parcourir les annonces.

## Fonctionnalités

- Affichage des annonces
- Recherche et navigation
- Gestion des données JSON
- Interface multilingue
- Architecture frontend + backend

## Stack

- Python 3
- requests
- BeautifulSoup4
- JSON

## Installation React Project

### Créer le projet React

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

### Packages utiles

```bash
npm install react-router-dom axios i18next react-i18next
```

### Backend Python (optionnel)

```bash
pip install requests beautifulsoup4
```

## Utilisation

```bash
python sheep_pro.py
```

## Structure des données

Chaque entrée contient:

- id
- name
- price
- city
- source
- url
- image
- description

## Exemple JSON

```json
{
  "id": "abc123",
  "name": "Mouton Sardi",
  "price": 3500,
  "city": "Rabat",
  "source": "avito",
  "url": "https://...",
  "image": "https://...",
  "description": "Annonce extraite"
}
```

## Idées futures

- Dashboard React
- API Flask/FastAPI
- Base de données MongoDB
- Mise à jour realtime
- Analyse prix par ville

