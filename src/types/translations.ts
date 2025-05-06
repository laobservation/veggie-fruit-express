
export interface Translation {
  key: string;
  fr: string;
  en?: string;
  category: 'general' | 'navigation' | 'product' | 'checkout' | 'account';
  description?: string;
}

export interface TranslationMap {
  [key: string]: string;
}

export const defaultTranslations: Translation[] = [
  // Navigation
  { key: 'nav.home', fr: 'Accueil', category: 'navigation' },
  { key: 'nav.fruits', fr: 'Fruits', category: 'navigation' },
  { key: 'nav.vegetables', fr: 'Légumes', category: 'navigation' },
  { key: 'nav.packs', fr: 'Packs', category: 'navigation' },
  { key: 'nav.account', fr: 'Mon Compte', category: 'navigation' },
  { key: 'nav.favorites', fr: 'Favoris', category: 'navigation' },
  { key: 'nav.cart', fr: 'Panier', category: 'navigation' },
  { key: 'nav.search', fr: 'Rechercher', category: 'navigation' },
  
  // General
  { key: 'general.loading', fr: 'Chargement...', category: 'general' },
  { key: 'general.save', fr: 'Enregistrer', category: 'general' },
  { key: 'general.cancel', fr: 'Annuler', category: 'general' },
  { key: 'general.edit', fr: 'Modifier', category: 'general' },
  { key: 'general.delete', fr: 'Supprimer', category: 'general' },
  { key: 'general.add', fr: 'Ajouter', category: 'general' },
  { key: 'general.create', fr: 'Créer', category: 'general' },
  { key: 'general.update', fr: 'Mettre à jour', category: 'general' },
  { key: 'general.back', fr: 'Retour', category: 'general' },
  { key: 'general.next', fr: 'Suivant', category: 'general' },
  { key: 'general.confirm', fr: 'Confirmer', category: 'general' },
  { key: 'general.submit', fr: 'Soumettre', category: 'general' },
  
  // Product
  { key: 'product.price', fr: 'Prix', category: 'product' },
  { key: 'product.outOfStock', fr: 'Épuisé', category: 'product' },
  { key: 'product.inStock', fr: 'En stock', category: 'product' },
  { key: 'product.description', fr: 'Description', category: 'product' },
  { key: 'product.addToCart', fr: 'Ajouter au panier', category: 'product' },
  { key: 'product.buyNow', fr: 'Acheter maintenant', category: 'product' },
  { key: 'product.relatedProducts', fr: 'Produits similaires', category: 'product' },
  
  // Checkout
  { key: 'checkout.yourCart', fr: 'Votre panier', category: 'checkout' },
  { key: 'checkout.emptyCart', fr: 'Votre panier est vide', category: 'checkout' },
  { key: 'checkout.total', fr: 'Total', category: 'checkout' },
  { key: 'checkout.subtotal', fr: 'Sous-total', category: 'checkout' },
  { key: 'checkout.shipping', fr: 'Livraison', category: 'checkout' },
  { key: 'checkout.tax', fr: 'Taxes', category: 'checkout' },
  { key: 'checkout.checkout', fr: 'Passer à la caisse', category: 'checkout' },
  { key: 'checkout.name', fr: 'Nom complet', category: 'checkout' },
  { key: 'checkout.email', fr: 'Email', category: 'checkout' },
  { key: 'checkout.phone', fr: 'Téléphone', category: 'checkout' },
  { key: 'checkout.address', fr: 'Adresse', category: 'checkout' },
  
  // Account
  { key: 'account.profile', fr: 'Profil', category: 'account' },
  { key: 'account.orders', fr: 'Commandes', category: 'account' },
  { key: 'account.settings', fr: 'Paramètres', category: 'account' },
  { key: 'account.logout', fr: 'Se déconnecter', category: 'account' }
];
