"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import type { CarouselSlideDisplay } from "@/services/carousel.service";

interface CarouselProps {
  slides: CarouselSlideDisplay[];
  autoSlideInterval?: number;
}

export function Carousel({ slides, autoSlideInterval = 5500 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);
    return () => clearInterval(timer);
  }, [isPaused, slides.length, nextSlide, autoSlideInterval]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Promotional Carousel"
      className="relative w-full overflow-hidden bg-primary py-4 md:py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative h-[480px] w-full overflow-hidden rounded-3xl shadow-xl sm:h-[520px] md:h-[580px]">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Background Image */}
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center transform scale-105 transition-transform duration-10000"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                />

                {/* Luxury Vignette and Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Slide Content */}
                <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12 md:px-20 max-w-2xl text-white">
                  {slide.discountText && (
                    <div className="mb-4 inline-flex items-center gap-1.5 self-start rounded-full bg-accent px-3.5 py-1 text-xs font-bold tracking-widest text-white shadow-md animate-fade-in uppercase">
                      <Tag className="h-3 w-3" />
                      <span>{slide.discountText}</span>
                    </div>
                  )}

                  <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent-light/90 mb-2">
                    AUMIS Haute Parfumerie
                  </span>

                  <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-sm">
                    {slide.title}
                  </h2>

                  <p className="mt-4 text-xs sm:text-sm md:text-base leading-relaxed text-gray-200 line-clamp-3">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white shadow-lg transition-all duration-300 hover:bg-accent-hover hover:scale-105 active:scale-95"
                    >
                      {slide.ctaText}
                    </Link>

                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:bg-white hover:text-text-main"
                    >
                      View All Scents
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Controls (Left / Right) */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-3 sm:left-5 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 active:scale-95 border border-white/20"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-3 sm:right-5 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 active:scale-95 border border-white/20"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3.5 py-1.5 backdrop-blur-md border border-white/10">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-8 bg-accent"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
