"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-[4/5] max-w-2xl mx-auto shadow-2xl shadow-black/5 bg-white">
        <div className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden">
          <span className="text-8xl grayscale opacity-20">🖼️</span>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  // Handle keyboard navigation in fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      document.body.style.overflow = 'unset';
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen, images.length]);

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="relative w-full aspect-[4/4.7] shadow-2xl shadow-black/5 bg-white overflow-hidden group cursor-pointer" onClick={openFullscreen}>
          {/* Main Image */}
          <div className="relative w-full h-full">
            <Image
              src={images[currentIndex]}
              alt={`${title} - Bild ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
              priority={currentIndex === 0}
            />
          </div>

          {/* Fullscreen Button */}
          <div className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-colorsz-10">
            <Maximize2 className="w-5 h-5" />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10 "
                aria-label="Vorheriges Bild"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10  "
                aria-label="Nächstes Bild"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 ransition-opacity">
                {currentIndex + 1} / {images.length}
              </div>

              {/* Thumbnail Navigation */}
              <div className="absolute bottom-16 left-0 right-0 px-4 transition-opacity">
                <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index);
                      }}
                      className={`relative w-16 h-16 flex-shrink-0  transition-all ${index === currentIndex
                        ? 'border-black scale-110'
                        : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
            aria-label="Schließen"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors z-10"
                aria-label="Vorheriges Bild"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors z-10"
                aria-label="Nächstes Bild"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 text-white px-6 py-3 rounded-full text-lg font-bold">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}

          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${title} - Bild ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>

          {/* Thumbnail Navigation in Fullscreen */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-0 right-0 px-4">
              <div className="flex gap-3 justify-center overflow-x-auto pb-2 max-w-4xl mx-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={`relative w-20 h-20 flex-shrink-0 border-2 transition-all ${index === currentIndex
                      ? 'border-white scale-110'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
