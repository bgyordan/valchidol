import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Tag, 
  Share2, 
  X, 
  ChevronRight, 
  Bookmark,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';
import { NewsItem } from '../types';

export const NewsPage: React.FC = () => {
  const { data, selectedNewsId, setSelectedNewsId } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('Всички');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['Всички', 'Новини', 'Събития', 'Постижения', 'Обявления', 'Проекти'];

  const filteredNews = data.news.filter((item) => {
    const matchesCategory = selectedCategory === 'Всички' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeArticle = data.news.find((n) => n.id === selectedNewsId);

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Връзката към новината е копирана в клипборда!');
    }
  };

  return (
    <div className="w-full space-y-12 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-[#1A1A1A] text-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Новини и събития
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-tight text-[#F5F2ED]">
            Училищен бюлетин & <br />
            <span className="text-[#C5A059] not-italic font-normal">Актуални съобщения</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D9D5CD] max-w-3xl leading-relaxed">
            Следете последните събития, постижения на олимпиади, проекти и важни обявления за живота в СУ „Васил Левски“, гр. Вълчи дол.
          </p>
        </div>
      </section>

      {/* 2. Filters & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xs border border-[#1A1A1A]/10 shadow-xs">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xs text-[11px] uppercase tracking-wider font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1A1A1A] text-[#F5F2ED] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#4A4540] hover:bg-[#E6E2D9] border border-[#1A1A1A]/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8B8378] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Търси по заглавие или таг..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xs border border-[#1A1A1A]/10 focus:border-[#1A1A1A] outline-hidden bg-[#FAF8F5] focus:bg-white text-[#1A1A1A]"
            />
          </div>

        </div>
      </section>

      {/* 3. News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xs border border-[#1A1A1A]/10 p-8">
            <Newspaper className="w-12 h-12 text-[#8B8378] mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Няма намерени новини</h3>
            <p className="text-xs text-[#4A4540] mt-1">
              Няма публикации, отговарящи на избраната категория или критерии за търсене.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNewsId(item.id)}
                className="bg-white rounded-xs overflow-hidden border border-[#1A1A1A]/10 shadow-xs hover:border-[#1A1A1A]/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-[#FAF8F5]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[15%] group-hover:grayscale-0"
                    />
                    <div className="absolute top-3 left-3 bg-[#1A1A1A]/90 backdrop-blur-xs text-[#C5A059] text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-xs">
                      {item.category}
                    </div>
                    {item.isPinned && (
                      <div className="absolute top-3 right-3 bg-[#C5A059] text-[#1A1A1A] text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-xs flex items-center gap-1 shadow-xs">
                        <Bookmark className="w-3 h-3 fill-current" />
                        <span>Важно</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#8B8378]">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{item.date}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.readTime}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#4A4540] line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="text-[9px] uppercase tracking-wider bg-[#FAF8F5] text-[#8B8378] px-2 py-0.5 rounded-xs border border-[#1A1A1A]/5">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#1A1A1A]/5 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] group-hover:text-[#C5A059]">
                    <span>Виж целия материал</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Single Article Modal View */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1A1A]/80 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#1A1A1A]/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col my-auto"
            >
              {/* Top Banner Image & Close */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#1A1A1A] shrink-0">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-transparent to-[#1A1A1A]/40" />
                
                <button
                  onClick={() => setSelectedNewsId(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-xs bg-[#1A1A1A]/80 hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-[#F5F2ED] space-y-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-[#C5A059] text-[#1A1A1A] px-2.5 py-1 rounded-xs">
                    {activeArticle.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F2ED] leading-tight">
                    {activeArticle.title}
                  </h2>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10 text-xs text-[#8B8378]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#C5A059]" />
                      <span className="font-semibold text-[#1A1A1A]">{activeArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#8B8378]" />
                      <span>{activeArticle.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleShare(activeArticle.title)}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#1A1A1A] font-bold hover:text-[#C5A059] transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Сподели</span>
                  </button>
                </div>

                {/* Excerpt Lead */}
                <div className="text-sm font-serif italic text-[#1A1A1A] bg-white p-4 rounded-xs border-l-2 border-[#C5A059] leading-relaxed">
                  {activeArticle.excerpt}
                </div>

                {/* Full text with paragraph separation */}
                <div className="space-y-4 text-sm text-[#4A4540] leading-relaxed whitespace-pre-line">
                  {activeArticle.content}
                </div>

                {/* Tags */}
                <div className="pt-4 border-t border-[#1A1A1A]/10 flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-[#8B8378]" />
                  {activeArticle.tags.map((t, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider bg-white text-[#4A4540] px-2.5 py-1 rounded-xs border border-[#1A1A1A]/10">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Bottom Back Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedNewsId(null)}
                    className="px-5 py-2.5 rounded-xs bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Обратно към новините</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
