'use client';

import Link from 'next/link';
import CakeCard from './CakeCard';

interface Cake {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  trending: boolean;
  popular: boolean;
}

interface CakeGridProps {
  cakes: Cake[];
  title: string;
  viewAllLink?: string;
}

export default function CakeGrid({ cakes, title, viewAllLink }: CakeGridProps) {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-pink-500 hover:text-pink-600 font-medium text-sm">
            View All →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cakes.map((cake) => (
          <CakeCard key={cake.id} cake={cake} />
        ))}
      </div>
    </section>
  );
}
