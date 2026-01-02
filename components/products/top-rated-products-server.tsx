import { productsApi } from '@/lib/api/products';
import ProductsGrid from './products-grid';

export default async function TopRatedProductsServer() {
  const locale = 'en';
  const response = await productsApi.getTopRatedProducts(locale);
  
  return <ProductsGrid products={response.data} />;
}