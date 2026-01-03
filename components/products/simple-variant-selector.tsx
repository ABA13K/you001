'use client';

interface SimpleVariantOption {
  id: number;
  value: string;
  available: boolean;
  extra_price?: string;
}

interface SimpleVariantSelectorProps {
  options: SimpleVariantOption[];
  type: 'color' | 'size' | 'material';
  label?: string;
  selectedId?: number;
  onSelect?: (optionId: number) => void;
}

export default function SimpleVariantSelector({
  options,
  type,
  label,
  selectedId,
  onSelect
}: SimpleVariantSelectorProps) {
  if (!options || options.length === 0) {
    return null;
  }

  const getColorFromValue = (value: string): string => {
    const colorMap: Record<string, string> = {
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'blue': '#0000ff',
      'green': '#00ff00',
      'yellow': '#ffff00',
      'purple': '#800080',
      'pink': '#ffc0cb',
      'orange': '#ffa500',
      'gray': '#808080',
      'brown': '#8b4513',
      'beige': '#f5f5dc',
      'navy': '#000080',
      'silver': '#c0c0c0',
      'gold': '#ffd700',
    };

    const lowerValue = value.toLowerCase();
    for (const [key, color] of Object.entries(colorMap)) {
      if (lowerValue.includes(key)) {
        return color;
      }
    }

    // Try to parse hex or rgb
    if (value.startsWith('#') && value.length === 7) {
      return value;
    }

    // Default fallback
    return '#f3f4f6';
  };

  const getTypeLabel = () => {
    if (label) return label;
    switch (type) {
      case 'color': return 'Color';
      case 'size': return 'Size';
      case 'material': return 'Material';
      default: return 'Option';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{getTypeLabel()}</h3>
        {selectedId && (
          <span className="text-sm text-gray-500">
            {options.find(o => o.id === selectedId)?.value}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isColor = type === 'color';
          
          return (
            <button
              key={option.id}
              onClick={() => option.available && onSelect?.(option.id)}
              disabled={!option.available}
              className={`
                relative flex items-center justify-center border rounded-md transition-all
                ${isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-500/30' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${!option.available 
                  ? 'opacity-40 cursor-not-allowed' 
                  : 'cursor-pointer'
                }
                ${isColor ? 'w-12 h-12' : 'px-4 py-3'}
              `}
              title={!option.available ? 'Not available' : option.value}
            >
              {isColor ? (
                <div
                  className="w-8 h-8 rounded-full border border-gray-200"
                  style={{ backgroundColor: getColorFromValue(option.value) }}
                />
              ) : (
                <span className="text-sm font-medium">{option.value}</span>
              )}
              
              {/* Extra price badge */}
              {option.extra_price && parseFloat(option.extra_price) !== 0 && (
                <span className={`absolute -top-1 -right-1 text-xs px-1 py-0.5 rounded ${
                  parseFloat(option.extra_price) > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {parseFloat(option.extra_price) > 0 ? '+' : ''}
                  {option.extra_price}
                </span>
              )}
              
              {/* Out of stock indicator */}
              {!option.available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-gray-400 rotate-45 transform"></div>
                </div>
              )}
              
              {/* Selected indicator for colors */}
              {isSelected && isColor && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}