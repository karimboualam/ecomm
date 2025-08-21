'use client';

import { motion } from 'framer-motion';

const categories = [
  { name: 'Électronique', image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg', count: 123 },
  { name: 'Mode', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', count: 456 },
  { name: 'Maison & Jardin', image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg', count: 789 },
  { name: 'Sport & Loisirs', image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg', count: 234 },
];

export function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Nos catégories</h2>
          <p className="mt-4 text-lg text-gray-600">
            Explorez notre large gamme de produits
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg bg-white shadow-md group-hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-gray-600">{category.count} produits</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}