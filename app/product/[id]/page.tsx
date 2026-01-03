/* eslint-disable react-hooks/purity */
import { notFound } from 'next/navigation';
import { productInfoApi } from '@/lib/api/productsinfo';
import ProductGallery from '@/components/products/product-gallery';
import ProductInfo from '@/components/products/product-info';
import ProductProperties from '@/components/products/product-properties';
import ProductVariants from '@/components/products/product-variants';
import CommentsSection from '@/components/products/comments-section';
import SimilarProducts from '@/components/products/similar-products';

interface ProductPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    locale?: 'ar' | 'en';
  };
}

export default async function ProductPage({ 
  params, 
  searchParams 
}: ProductPageProps) {
  const productId = parseInt(params.id);
  
  if (isNaN(productId)) {
    notFound();
  }

  const locale = searchParams?.locale || 'en';

  try {
    const productResponse = await productInfoApi.getProductById(productId, locale);
    const { product, similar_products } = productResponse.data;

    // Transform properties for the ProductProperties component
    const properties = product.properties.map(prop => ({
      id: Math.random(), // Generate unique id for React key
      name: prop.key,
      value: prop.value,
      type: prop.type,
    }));

    // Transform variants for the ProductVariants component
    const variants = Object.entries(product.variants).flatMap(([variantType, options]) => 
      options.map(option => ({
        id: option.id,
        name: `${variantType}: ${option.value}`,
        price: (parseFloat(product.price_after_discount) + parseFloat(option.extra_price)).toString(),
        image: option.images[0] || product.main_image,
        stock: option.quantity,
        properties: {
          type: variantType,
          value: option.value,
          extra_price: option.extra_price,
        },
      }))
    );

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li>Home</li>
            <li className="text-gray-300">/</li>
            <li>{product.sub_category.name}</li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Gallery */}
          <div>
            <ProductGallery 
              images={[product.main_image, ...product.images]} 
              mainImage={product.main_image}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < Math.floor(product.total_rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-600">({product.total_rating.toFixed(1)})</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{product.sales_count} sold</span>
              {product.quantity > 0 && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-green-600">{product.quantity} in stock</span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              {product.discount_percentage > 0 ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price_after_discount}
                  </span>
                  <span className="text-xl line-through text-gray-500">
                    ${product.original_price}
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    -{product.discount_percentage}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ${product.original_price}
                </span>
              )}
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <ProductVariants 
                variants={variants}
                variantType="Options"
              />
            )}

            {/* Add to Cart */}
            <div className="pt-6 border-t">
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <span className="text-xl">♡</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
                Description
              </button>
              <button className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium">
                Specifications
              </button>
              <button className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium">
                Reviews ({product.has_comments ? 'See reviews' : 'No reviews yet'})
              </button>
            </nav>
          </div>

          <div className="py-8">
            {/* Properties */}
            {properties.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Product Specifications</h2>
                <ProductProperties properties={properties} />
              </div>
            )}

            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <CommentsSection productId={productId} productName={''} />
        </div>

        {/* Similar Products */}
        <div>
          <SimilarProducts 
           currentProductId={productId}
           
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}