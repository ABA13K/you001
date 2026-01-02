import { categoriesApi } from '@/lib/api/categories';
import MainCategoriesClient from './main-categories-client';

export default async function MainCategoriesServer() {
  const locale = 'en'; // You can get this from next/navigation in the future
  const response = await categoriesApi.getMainCategories(locale);
  
  return <MainCategoriesClient categories={response.data} />;
}