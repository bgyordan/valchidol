import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  Newspaper, 
  User, 
  BookOpen, 
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../cms/CMSContext';
import { PageType } from '../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, data, setCurrentPage, setSelectedNewsId } = useCMS();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Global keydown for Ctrl+K or Cmd+K or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const matchedNews = query
    ? data.news.filter(
        n =>
          n.title.toLowerCase().includes(normalizedQuery) ||
          n.excerpt.toLowerCase().includes(normalizedQuery) ||
          n.tags.some(t => t.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const matchedDocuments = query
    ? data.documents.filter(
        d =>
          d.title.toLowerCase().includes(normalizedQuery) ||
          d.description.toLowerCase().includes(normalizedQuery) ||
          d.category.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const matchedTeachers = query
    ? data.teachers.filter(
        t =>
          t.name.toLowerCase().includes(normalizedQuery) ||
          t.role.toLowerCase().includes(normalizedQuery) ||
          t.subjects.some(s => s.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const matchedClubs = query
    ? data.clubs.filter(
        c =>
          c.name.toLowerCase().includes(normalizedQuery) ||
          c.description.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const totalResults =
    matchedNews.length +
    matchedDocuments.length +
    matchedTeachers.length +
    matchedClubs.length;

  const handleSelectNews = (id: string) => {
    setSelectedNewsId(id);
    setCurrentPage('news');
    setIsSearchOpen(false);
  };

  const handleSelectPage = (page: PageType) => {
    setCurrentPage(page);
    setIsSearchOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#1A1A1A]/80 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#1A1A1A]/20 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
          id="search-modal-container"
        >
          {/* Top Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1A1A1A]/15 bg-[#FAF8F5]">
            <Search className="w-5 h-5 text-[#8B8378] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Търсете новини, документи, учители, клубове, прием..."
              className="w-full bg-transparent border-none outline-hidden text-[#1A1A1A] placeholder:text-[#8B8378] text-sm font-sans"
              id="search-modal-input"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#8B8378] hover:text-[#1A1A1A] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-[#E6E2D9] text-[#1A1A1A] rounded-xs hover:bg-[#D9D5CD] transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-5 space-y-6 flex-1">
            {!query ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-px w-6 bg-[#C5A059]"></span>
                  <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                    Често търсени раздели
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { label: 'Прием 1. и 8. клас', page: 'admissions' as PageType, icon: BookOpen },
                    { label: 'Седмично разписание', page: 'education' as PageType, icon: FolderOpen },
                    { label: 'Училищни документи', page: 'documents' as PageType, icon: FileText },
                    { label: 'Учителски състав', page: 'about' as PageType, icon: User },
                    { label: 'Патрон Васил Левски', page: 'about' as PageType, icon: BookOpen },
                    { label: 'Контакт с канцелария', page: 'contact' as PageType, icon: ArrowRight },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPage(item.page)}
                      className="p-3 text-left rounded-xs bg-[#E6E2D9] hover:bg-[#D9D5CD] border border-[#1A1A1A]/10 transition-all flex items-center gap-2.5 text-xs font-serif font-bold text-[#1A1A1A] group"
                    >
                      <item.icon className="w-4 h-4 text-[#8B8378] group-hover:text-[#1A1A1A] shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-12 text-[#8B8378]">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#8B8378]" />
                <p className="text-sm font-serif italic text-[#1A1A1A]">Няма намерени резултати за "{query}"</p>
                <p className="text-xs text-[#8B8378] mt-1">Опитайте с друга ключова дума като "прием", "учители", "STEM" или "бюджет".</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Matched News */}
                {matchedNews.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378] mb-2 flex items-center gap-2">
                      <Newspaper className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Новини и събития ({matchedNews.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {matchedNews.map((news) => (
                        <button
                          key={news.id}
                          onClick={() => handleSelectNews(news.id)}
                          className="w-full p-3 text-left rounded-xs hover:bg-[#E6E2D9] border border-transparent hover:border-[#1A1A1A]/10 flex items-start justify-between gap-3 group transition-colors"
                        >
                          <div>
                            <div className="text-sm font-serif font-bold text-[#1A1A1A]">
                              {news.title}
                            </div>
                            <div className="text-xs text-[#4A4540] line-clamp-1 mt-0.5">
                              {news.excerpt}
                            </div>
                          </div>
                          <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#1A1A1A] text-[#F5F2ED] rounded-xs shrink-0 mt-0.5">
                            {news.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Documents */}
                {matchedDocuments.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378] mb-2 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Документи и бланки ({matchedDocuments.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {matchedDocuments.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => handleSelectPage('documents')}
                          className="w-full p-3 text-left rounded-xs hover:bg-[#E6E2D9] border border-transparent hover:border-[#1A1A1A]/10 flex items-start justify-between gap-3 group transition-colors"
                        >
                          <div>
                            <div className="text-sm font-serif font-bold text-[#1A1A1A]">
                              {doc.title}
                            </div>
                            <div className="text-xs text-[#4A4540] line-clamp-1 mt-0.5">
                              {doc.description}
                            </div>
                          </div>
                          <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-[#1A1A1A] text-[#F5F2ED] rounded-xs shrink-0">
                            {doc.fileType} • {doc.fileSize}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Teachers */}
                {matchedTeachers.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378] mb-2 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Преподаватели ({matchedTeachers.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {matchedTeachers.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleSelectPage('about')}
                          className="p-2.5 text-left rounded-xs hover:bg-[#E6E2D9] flex items-center gap-3 group transition-colors border border-[#1A1A1A]/10"
                        >
                          <img
                            src={t.photoUrl}
                            alt={t.name}
                            className="w-10 h-10 rounded-xs object-cover shrink-0 border border-[#1A1A1A]/20"
                          />
                          <div className="overflow-hidden">
                            <div className="text-xs font-serif font-bold text-[#1A1A1A] truncate">
                              {t.name}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-[#8B8378] truncate">{t.role}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
