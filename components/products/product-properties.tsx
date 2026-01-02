import { ProductProperty } from '@/types/product';

interface ProductPropertiesProps {
  properties: ProductProperty[];
  title?: string;
}

export default function ProductProperties({ 
  properties, 
  title = "Product Specifications" 
}: ProductPropertiesProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">No specifications available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="flex border-b border-gray-100 py-3">
            <span className="text-sm font-medium text-gray-500 w-1/2 md:w-1/3">
              {property.name}:
            </span>
            <span className="text-sm text-gray-900 w-1/2 md:w-2/3">
              {property.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}