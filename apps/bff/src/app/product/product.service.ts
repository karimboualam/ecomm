import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductsInput } from './dto/products.input';

@Injectable()
export class ProductService {
  // Mock data - In real app, this would call the Catalog microservice
  private products: Product[] = [
    {
      id: '1',
      name: 'Smartphone Premium',
      slug: 'smartphone-premium',
      description: 'Un smartphone haut de gamme avec toutes les dernières fonctionnalités',
      price: 89900, // Prix en centimes
      currency: 'EUR',
      images: ['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg'],
      categoryId: 'electronics',
      inStock: true,
      stockQuantity: 50,
      rating: 4.8,
      reviewCount: 124,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Casque Audio Pro',
      slug: 'casque-audio-pro',
      description: 'Casque audio professionnel avec réduction de bruit active',
      price: 29900,
      currency: 'EUR',
      images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
      categoryId: 'electronics',
      inStock: true,
      stockQuantity: 30,
      rating: 4.6,
      reviewCount: 89,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Montre Connectée',
      slug: 'montre-connectee',
      description: 'Montre intelligente avec suivi fitness et notifications',
      price: 39900,
      currency: 'EUR',
      images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'],
      categoryId: 'electronics',
      inStock: true,
      stockQuantity: 25,
      rating: 4.7,
      reviewCount: 203,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Laptop Gaming',
      slug: 'laptop-gaming',
      description: 'Ordinateur portable gaming haute performance',
      price: 129900,
      currency: 'EUR',
      images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg'],
      categoryId: 'electronics',
      inStock: true,
      stockQuantity: 15,
      rating: 4.9,
      reviewCount: 156,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAll(input?: ProductsInput): Promise<Product[]> {
    // Simulate microservice call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let result = this.products;

    if (input?.category) {
      result = result.filter(p => p.categoryId === input.category);
    }

    if (input?.search) {
      const searchTerm = input.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    if (input?.limit) {
      result = result.slice(0, input.limit);
    }

    return result;
  }

  async findById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products.find(p => p.id === id) || null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products.find(p => p.slug === slug) || null;
  }
}