'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/context/AdminContext';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const categories = [
  { id: 'birthday', name: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', name: 'Anniversary', emoji: '💝' },
  { id: 'kids', name: 'Kids', emoji: '🧸' },
  { id: 'bento', name: 'Bento', emoji: '🍱' },
  { id: 'custom', name: 'Custom', emoji: '✨' },
];

export default function ProductForm({ initialData, onSubmit, onCancel, isEditing = false }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'birthday');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [trending, setTrending] = useState(initialData?.trending || false);
  const [popular, setPopular] = useState(initialData?.popular || false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setPrice(initialData.price.toString());
      setImage(initialData.image);
      setDescription(initialData.description);
      setTrending(initialData.trending);
      setPopular(initialData.popular);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Valid price is required';
    if (!image.trim()) newErrors.image = 'Image URL is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      category,
      price: Number(price),
      image: image.trim(),
      description: description.trim(),
      trending,
      popular,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
          }}
          placeholder="e.g., Rainbow Delight"
          className={`w-full p-3 border-2 rounded-xl focus:outline-none ${
            errors.name ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
          }`}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-5 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                category === cat.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <span className="text-2xl block mb-1">{cat.emoji}</span>
              <p className="text-sm font-medium text-gray-800">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price (NPR) <span className="text-red-400">*</span>
        </label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
          }}
          placeholder="e.g., 1500"
          min="0"
          className={`w-full p-3 border-2 rounded-xl focus:outline-none ${
            errors.price ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
          }`}
        />
        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL <span className="text-red-400">*</span>
        </label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => {
            setImage(e.target.value);
            if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
          }}
          placeholder="https://example.com/image.jpg"
          className={`w-full p-3 border-2 rounded-xl focus:outline-none ${
            errors.image ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
          }`}
        />
        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
          }}
          placeholder="Describe the cake..."
          rows={3}
          className={`w-full p-3 border-2 rounded-xl focus:outline-none resize-none ${
            errors.description ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
          }`}
        />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Toggle Options */}
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={trending}
            onChange={(e) => setTrending(e.target.checked)}
            className="w-5 h-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700">🔥 Trending</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={popular}
            onChange={(e) => setPopular(e.target.checked)}
            className="w-5 h-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-700">⭐ Popular</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          {isEditing ? 'Update Product' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
