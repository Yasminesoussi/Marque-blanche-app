# Shop

Application Angular/PrimeNG de gestion de catalogue produits, conçue comme base marque blanche

## Fonctionnalités

- Création de produits via un formulaire en 3 étapes (informations, médias, récapitulatif)
- Liste des produits avec tri, pagination et galerie d'images
- Personnalisation de la marque (nom, couleurs, contact) via un fichier de configuration central
- Persistance locale des données dans le navigateur (`localStorage`)

## Stack

Angular 20 · PrimeNG · SCSS


## Installation

```bash
cd white-label-app
npm install
npm start
```

Application disponible sur [http://localhost:4200](http://localhost:4200).

| Commande | Description |
|----------|-------------|
| `npm start` | Serveur de développement |
| `npm run build` | Build de production |

## Routes

| Chemin | Description |
|--------|-------------|
| `/` | Accueil |
| `/product-form` | Création d'un produit |
| `/products` | Catalogue |

## Auteur

**Réalisation :** Yasmine Soussi
