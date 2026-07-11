'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const reviews = [
  {
    name: 'Sushma Ghaley',
    rating: 5,
    text: 'did order cake for my sis birthday and the cake was really. Everyone loves the cake especially my sister(birthday cake). Thank you Krishtina bubble bakery.',
    color: 'from-pink-400 to-rose-500',
    image: '/reviews/SushmaGhaley.png',
  },
  {
    name: 'Arjuna Lamichhane',
    rating: 5,
    text: 'Thank you for the best service❤️❤️.',
    color: 'from-purple-400 to-indigo-500',
    image: '/reviews/ArjunaLamichhane.png',
  },
  {
    name: 'Eleena Sharma',
    rating: 5,
    text: 'Thank for good servicing 🌸\nI\'m appreciated ❤️\n\nFood: 5/5  Service: 5/5  Atmosphere: 5/5',
    color: 'from-green-400 to-emerald-500',
    image: '/reviews/EleenaSharma.png',
  },
  {
    name: 'SANGAM SARU',
    rating: 5,
    text: 'best cake ever ❤️\n\nFood: 5/5Service: 5/5Atmosphere: 5/5',
    color: 'from-orange-400 to-amber-500',
    image: '/reviews/SANGAMSARU.png',
  },
  {
    name: 'Priya Magar',
    rating: 5,
    text: 'Their kid-friendly cakes are the cutest! My son\'s dinosaur cake was a hit at his party. The staff was very helpful with the design. Thank you Bubble Bakery!',
    color: 'from-cyan-400 to-blue-500',
    image: '/reviews/priya.png',
  },
  {
    name: 'Prasamsha Shrestha',
    rating: 5,
    text: 'Reliable and delicious. I\'ve ordered from them multiple times for office parties. Always fresh and delivered on time. A go-to bakery for events.',
    color: 'from-fuchsia-400 to-pink-500',
    image: '/reviews/PrasamshaShrestha.png',
  },
];

export default function ContactPage() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const getIndex = (offset: number) => (current + offset + reviews.length) % reviews.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Contact <span className="text-pink-500">Us</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;d love to hear from you! Reach out for orders, inquiries, or just to say hello.
          </p>
        </div>
      </section>

      {/* Map + Contact Side by Side */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column — Map */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-[520px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.306219871277!2d85.31213489999999!3d27.738699499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb192dc0036425%3A0x56b56c5b66b7ccff!2sBubble%20Bakery!5e0!3m2!1sen!2snp!4v1783746043298!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0"
            />

            {/* Get Directions Button */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href="https://www.google.com/maps/dir//Bubble+Bakery,+Siddhi+Chowk,+Kathmandu+44600/@27.7386995,85.3121349,17z/data=!4m17!1m7!3m6!1s0x39eb192dc0036425:0x56b56c5b66b7ccff!2sBubble+Bakery!8m2!3d27.7386995!4d85.3121349!16s%2Fg%2F11m_77pddz!4m8!1m1!4e2!1m5!1m1!1s0x39eb192dc0036425:0x56b56c5b66b7ccff!2m2!1d85.3121349!2d27.7386995?hl=en&entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all hover:scale-105 hover:shadow-xl text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions
              </a>
            </div>

            {/* Map Label */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                <span className="text-xs font-medium text-gray-700">📍 Bubble Bakery, Siddhi Chowk</span>
              </div>
            </div>
          </div>

          {/* Right Column — Contact Info */}
          <div className="flex flex-col gap-6">
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Our Address</h3>
                  <p className="text-gray-600">Siddhi Chowk, Kathmandu 44600, Nepal</p>
                  <a
                    href="https://www.google.com/maps/dir//Bubble+Bakery,+Siddhi+Chowk,+Kathmandu+44600/@27.7386995,85.3121349,17z/data=!4m17!1m7!3m6!1s0x39eb192dc0036425:0x56b56c5b66b7ccff!2sBubble+Bakery!8m2!3d27.7386995!4d85.3121349!16s%2Fg%2F11m_77pddz!4m8!1m1!4e2!1m5!1m1!1s0x39eb192dc0036425:0x56b56c5b66b7ccff!2m2!1d85.3121349!2d27.7386995?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-pink-500 hover:text-pink-600 font-medium text-sm transition-colors"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Call Us</h3>
                  <p className="text-gray-600">+977-984-1234567</p>
                  <p className="text-gray-600">+977-1-4567890</p>
                  <a
                    href="tel:+9779841234567"
                    className="inline-block mt-2 text-pink-500 hover:text-pink-600 font-medium text-sm transition-colors"
                  >
                    Call Now →
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✉️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Email Us</h3>
                  <p className="text-gray-600">info@bubblecake.com</p>
                  <p className="text-gray-600">orders@bubblecake.com</p>
                  <a
                    href="mailto:info@bubblecake.com"
                    className="inline-block mt-2 text-pink-500 hover:text-pink-600 font-medium text-sm transition-colors"
                  >
                    Send Email →
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🕐</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Business Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Monday - Friday</span>
                      <span className="font-semibold text-gray-800 text-sm">9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-gray-600 text-sm">Saturday</span>
                      <span className="font-semibold text-gray-800 text-sm">10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-600 text-sm">Sunday</span>
                      <span className="font-semibold text-pink-500 text-sm">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            What Our <span className="text-pink-500">Customers</span> Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex text-yellow-400 text-lg">★★★★★</div>
            <span className="text-gray-600 font-medium">4.8 / 5</span>
            <span className="text-gray-400 text-sm">• 120+ reviews on Google</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center py-8" style={{ perspective: '1200px' }}>
          {/* Previous Card */}
          <div
            className="hidden md:block absolute left-[8%] w-[320px] bg-white rounded-2xl p-6 shadow-lg transition-all duration-700 ease-in-out relative overflow-hidden cursor-pointer opacity-40"
            style={{ transform: 'scale(0.88) translateX(0) rotateY(8deg)' }}
            onClick={prev}
          >
            <span className="absolute top-2 left-5 text-6xl font-serif text-pink-100 leading-none select-none">&ldquo;</span>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className={`w-10 h-10 bg-gradient-to-br ${reviews[getIndex(-1)].color} rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden`}>
                {reviews[getIndex(-1)].image ? (
                  <img src={reviews[getIndex(-1)].image} alt={reviews[getIndex(-1)].name} className="w-full h-full object-cover" />
                ) : (
                  reviews[getIndex(-1)].name.charAt(0)
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{reviews[getIndex(-1)].name}</p>
                <div className="flex text-yellow-400 text-xs">
                  {'★'.repeat(reviews[getIndex(-1)].rating)}{'☆'.repeat(5 - reviews[getIndex(-1)].rating)}
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed relative z-10 line-clamp-3">
              {reviews[getIndex(-1)].text}
            </p>
          </div>

          {/* Current Card (main) */}
          <div
            key={current}
            className="flex-shrink-0 w-[380px] md:w-[440px] bg-white rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-slideIn"
            style={{ zIndex: 10 }}
          >
            <span className="absolute top-3 left-6 text-8xl font-serif text-pink-100 leading-none select-none">&ldquo;</span>

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className={`w-14 h-14 bg-gradient-to-br ${reviews[current].color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden`}>
                {reviews[current].image ? (
                  <img src={reviews[current].image} alt={reviews[current].name} className="w-full h-full object-cover" />
                ) : (
                  reviews[current].name.charAt(0)
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">{reviews[current].name}</p>
                <div className="flex text-yellow-400 text-base">
                  {'★'.repeat(reviews[current].rating)}{'☆'.repeat(5 - reviews[current].rating)}
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed relative z-10 pl-1 min-h-[80px]">
              {reviews[current].text}
            </p>

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-400 text-xs">Google Review</span>
            </div>
          </div>

          {/* Next Card */}
          <div
            className="hidden md:block absolute right-[8%] w-[320px] bg-white rounded-2xl p-6 shadow-lg transition-all duration-700 ease-in-out relative overflow-hidden cursor-pointer opacity-40"
            style={{ transform: 'scale(0.88) translateX(0) rotateY(-8deg)' }}
            onClick={next}
          >
            <span className="absolute top-2 left-5 text-6xl font-serif text-pink-100 leading-none select-none">&ldquo;</span>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className={`w-10 h-10 bg-gradient-to-br ${reviews[getIndex(1)].color} rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden`}>
                {reviews[getIndex(1)].image ? (
                  <img src={reviews[getIndex(1)].image} alt={reviews[getIndex(1)].name} className="w-full h-full object-cover" />
                ) : (
                  reviews[getIndex(1)].name.charAt(0)
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{reviews[getIndex(1)].name}</p>
                <div className="flex text-yellow-400 text-xs">
                  {'★'.repeat(reviews[getIndex(1)].rating)}{'☆'.repeat(5 - reviews[getIndex(1)].rating)}
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed relative z-10 line-clamp-3">
              {reviews[getIndex(1)].text}
            </p>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={prev} className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-pink-500 hover:shadow-lg transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-pink-500 w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
          <button onClick={next} className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-pink-500 hover:shadow-lg transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="text-center mt-8">
          <a
            href="https://g.page/r/Cf_Mt2ZbbLVWEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-pink-500 text-pink-500 font-semibold rounded-full hover:bg-pink-50 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Write a Review on Google
          </a>
        </div>
      </section>

      {/* Back to Home */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-600 transition-all hover:scale-105"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
