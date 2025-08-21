export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ECommerce</h3>
            <p className="text-gray-400">
              Votre plateforme de confiance pour tous vos achats en ligne.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Produits
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Électronique</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Mode</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Maison</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Sport</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Livraison</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Retours</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Légal
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">CGV</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Confidentialité</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © 2024 ECommerce Platform. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}