export interface AppModule {
  id: string;
  label: string;
  description: string;
  icon: string;
  route: string;
  locked?: boolean;
}

export type ModuleState = Record<string, boolean>;

export const APP_MODULES: AppModule[] = [
  {
    id: 'home',
    label: 'Accueil',
    description: 'Page d\'accueil et présentation de l\'application',
    icon: 'pi pi-home',
    route: '/',
  },
  {
    id: 'products',
    label: 'Catalogue produits',
    description: 'Liste, tri et suppression des produits',
    icon: 'pi pi-list',
    route: '/products',
  },
  {
    id: 'product-form',
    label: 'Création produit',
    description: 'Formulaire multi-étapes pour ajouter un produit',
    icon: 'pi pi-plus',
    route: '/product-form',
  },
  {
    id: 'theme-config',
    label: 'Thèmes & Apparence',
    description: 'Configuration des couleurs et modules',
    icon: 'pi pi-palette',
    route: '/theme-config',
    locked: true,
  },
];

export const DEFAULT_MODULE_STATE: ModuleState = Object.fromEntries(
  APP_MODULES.map((module) => [module.id, true]),
);
