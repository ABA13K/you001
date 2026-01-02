/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/products/product-gallery';
import ProductInfo from '@/components/products/product-info';
import SimilarProducts from '@/components/products/similar-products';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // You'll need to create an API to fetch single product by ID
  // For now, we'll use the existing APIs to find the product
  
  const productId = parseInt(params.id);
  if (isNaN(productId)) {
    notFound();
  }

  // Fetch all products from different endpoints to find the product
  // This is temporary until you have a single product API endpoint
  const locale = 'en';
  
  // Try to get product from top rated
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/public/home-page/products/top-rated/${locale}`
  );
  
  if (!response.ok) {
    notFound();
  }
  
  const data = await response.json();
  const product = data.data.find((p: any) => p.id === productId);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Gallery */}
        <ProductGallery images={[product.image]} mainImage={''} variants={undefined} />
        
        {/* Product Info */}
        <ProductInfo product={product} />
      </div>
      
      {/* Similar Products */}
      <div className="mt-12">
        <SimilarProducts currentProductId={productId} />
      </div>
    </div>
  );
}