import { productsApi } from '@/lib/api/products';
import ProductsGrid from './products-grid';

export default async function LatestProductsServer() {
  const locale = 'en';
  const response = await productsApi.getLatestProducts(locale);
  
  return <ProductsGrid products={response.data} />;
}