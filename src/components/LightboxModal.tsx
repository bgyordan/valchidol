import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';
import { GalleryImage } from '../types';

interface LightboxModalProps {
  isOpen: boolean;
  images: GalleryImage[];
  initialIndex?: number;
  onClose: () => void;
  albumTitle?: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
  albumTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/95 backdrop-blur-md p-4">
        {/* Top bar controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 text-[#F5F2ED]">
          <div className="text-xs uppercase tracking-widest text-[#8B8378]">
            {albumTitle && <span className="text-[#C5A059] font-serif font-bold mr-3">{albumTitle}</span>}
            <span>Снимка {currentIndex + 1} от {images.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={currentImage.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-2.5 rounded-xs bg-[#262422] hover:bg-[#333] text-[#F5F2ED] border border-[#333] transition-colors"
              title="Отвори в пълен размер"
            >
              <Maximize2 className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xs bg-[#262422] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] border border-[#333] transition-colors"
              title="Затвори (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xs bg-[#262422] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] border border-[#333] transition-all z-10"
            title="Предишна снимка (Стрелка наляво)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Main image container */}
        <div className="max-w-5xl max-h-[80vh] flex flex-col items-center justify-center">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            src={currentImage.url}
            alt={currentImage.caption || 'Галерия'}
            className="max-h-[72vh] max-w-full rounded-xs object-contain border border-[#333] shadow-2xl"
          />
          {currentImage.caption && (
            <motion.p
              key={`cap-${currentIndex}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center text-[#E6E2D9] text-xs font-serif italic max-w-2xl bg-[#1A1A1A] px-4 py-2 border border-[#333] rounded-xs"
            >
              {currentImage.caption}
            </motion.p>
          )}
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xs bg-[#262422] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] border border-[#333] transition-all z-10"
            title="Следваща снимка (Стрелка надясно)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </AnimatePresence>
  );
};
