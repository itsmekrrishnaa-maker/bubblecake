'use client';

import { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200',
    title: 'Delicious Cakes',
    subtitle: 'Made with love and fresh ingredients',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200',
    title: 'Custom Designs',
    subtitle: 'Your vision, our creation',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200',
    title: 'Birthday Specials',
    subtitle: 'Make your day memorable',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1200',
    title: 'Premium Quality',
    subtitle: 'Best ingredients for best taste',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=1200',
    title: 'Wedding Cakes',
    subtitle: 'Elegant designs for your special day',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden rounded-2xl">
      {/* Slides */}
      <div
        className="slider-track h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="slide h-full relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{slide.title}</h2>
              <p className="text-lg md:text-xl text-gray-200">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
