/* eslint-disable react-hooks/error-boundaries */
import { productsApi } from '@/lib/api/products';
import ProductsGrid from './products-grid';

export interface SimilarProductsProps {
  currentProductId: number;
  locale?: 'ar' | 'en';
  limit?: number;
}

export default async function SimilarProducts({
  currentProductId,
  locale = 'en',
  limit = 4
}: SimilarProductsProps) {
  try {
    // Fetch random products
    const response = await productsApi.getRandomProducts(locale);
    
    // Filter out the current product and limit results
    const similarProducts = response.data
      .filter(product => product.id !== currentProductId)
      .slice(0, limit);

    if (similarProducts.length === 0) {
      return null;
    }

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <ProductsGrid products={similarProducts} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch similar products:', error);
    return null;
  }
}