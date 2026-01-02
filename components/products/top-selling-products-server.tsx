import { productsApi } from '@/lib/api/products';
import ProductsGrid from './products-grid';

export default async function TopSellingProductsServer() {
  const locale = 'en';
  const response = await productsApi.getTopSellingProducts(locale);
  
  return <ProductsGrid products={response.data} />;
}