'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/category';

interface MainCategoriesClientProps {
  categories: Category[];
}

export default function MainCategoriesClient({ categories }: MainCategoriesClientProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group block"
        >
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {category.image && (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          </div>
          <div className="mt-2">
            <h3 className="font-medium text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">
              {category.products_count} products
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}