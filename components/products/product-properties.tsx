interface Property {
  id: number;
  name?: string;  // Optional name
  key?: string;   // Optional key
  value: string;
  type?: 'text' | 'color' | 'number' | 'boolean';
}

interface ProductPropertiesProps {
  properties: Property[];
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

  // Helper to get the display key
  const getDisplayKey = (property: Property): string => {
    return property.name || property.key || 'Property';
  };

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="flex border-b border-gray-100 py-3">
            <span className="text-sm font-medium text-gray-500 w-1/2 md:w-1/3">
              {getDisplayKey(property)}:
            </span>
            <span className="text-sm text-gray-900 w-1/2 md:w-2/3">
              {property.type === 'color' ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ 
                      backgroundColor: property.value.includes('#') 
                        ? property.value 
                        : property.value.toLowerCase() === 'white' ? '#ffffff' :
                          property.value.toLowerCase() === 'black' ? '#000000' :
                          property.value.toLowerCase() === 'red' ? '#ff0000' :
                          property.value.toLowerCase() === 'blue' ? '#0000ff' :
                          property.value.toLowerCase() === 'green' ? '#00ff00' :
                          property.value.toLowerCase() === 'silver' ? '#c0c0c0' :
                          '#f3f4f6'
                    }}
                  />
                  <span>{property.value}</span>
                </div>
              ) : (
                property.value
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}