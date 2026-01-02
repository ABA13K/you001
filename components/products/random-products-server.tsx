import { productsApi } from '@/lib/api/products';
import ProductsGrid from './products-grid';

export default async function RandomProductsServer() {
  const locale = 'en';
  const response = await productsApi.getRandomProducts(locale);
  
  return <ProductsGrid products={response.data} />;
}