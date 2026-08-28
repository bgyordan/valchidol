import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Calendar, 
  Maximize2, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';
import { LightboxModal } from '../components/LightboxModal';
import { GalleryAlbum, GalleryImage } from '../types';

export const GalleryPage: React.FC = () => {
  const { data } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('Всички');
  
  // Lightbox state
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const categories = ['Всички', 'Празници', 'STEM и Наука', 'Спорт', 'Изкуство', 'Екскурзии'];

  const filteredAlbums = selectedCategory === 'Всички'
    ? data.galleryAlbums
    : data.galleryAlbums.filter((a) => a.category === selectedCategory);

  const handleOpenAlbum = (album: GalleryAlbum, imageIndex = 0) => {
    setActiveAlbum(album);
    setLightboxIndex(imageIndex);
    setIsLightboxOpen(true);
  };

  return (
    <div className="w-full space-y-12 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-[#1A1A1A] text-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Фотоархив & Спомени
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-tight text-[#F5F2ED]">
            Галерия на <br />
            <span className="text-[#C5A059] not-italic font-normal">СУ „Васил Левски“, гр. Вълчи дол</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D9D5CD] max-w-3xl leading-relaxed">
            Потопете се в незабравимите моменти от празници, спортни надпревари, STEM експерименти, патронни тържества и екскурзии.
          </p>
        </div>
      </section>

      {/* 2. Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xs border border-[#1A1A1A]/10 shadow-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xs text-[11px] uppercase tracking-wider font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-[#F5F2ED] shadow-xs'
                  : 'bg-[#FAF8F5] text-[#4A4540] hover:bg-[#E6E2D9] border border-[#1A1A1A]/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Albums Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            className="bg-white rounded-xs p-6 sm:p-8 border border-[#1A1A1A]/10 shadow-xs space-y-6"
          >
            {/* Album Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1A]/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-xs bg-[#E6E2D9] text-[#1A1A1A]">
                    {album.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#8B8378]">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{album.date}</span>
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">{album.title}</h3>
                <p className="text-xs text-[#4A4540] mt-1">{album.description}</p>
              </div>

              <button
                onClick={() => handleOpenAlbum(album, 0)}
                className="px-4 py-2 rounded-xs bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-xs"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Преглед на албума ({album.images.length} снимки)</span>
              </button>
            </div>

            {/* Photo thumbnails grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {album.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenAlbum(album, idx)}
                  className="relative h-44 sm:h-52 rounded-xs overflow-hidden cursor-pointer group bg-[#FAF8F5] border border-[#1A1A1A]/10"
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[15%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-[#F5F2ED]">
                    <div className="flex justify-end">
                      <span className="p-1.5 rounded-xs bg-[#1A1A1A]/80 text-[#C5A059]">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2 leading-tight font-medium">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={isLightboxOpen}
        images={activeAlbum ? activeAlbum.images : []}
        initialIndex={lightboxIndex}
        onClose={() => setIsLightboxOpen(false)}
        albumTitle={activeAlbum?.title}
      />

    </div>
  );
};
