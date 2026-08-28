import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  SlidersHorizontal, 
  ExternalLink,
  BookOpen,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../cms/CMSContext';
import { PageType } from '../types';

export const Header: React.FC = () => {
  const { currentPage, setCurrentPage, setIsSearchOpen, data } = useCMS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAnnouncement = data.announcements.find(a => a.active);

  const navLinks: { label: string; page: PageType; badge?: string }[] = [
    { label: 'Начало', page: 'home' },
    { label: 'За училището', page: 'about' },
    { label: 'Прием', page: 'admissions', badge: '2026/27' },
    { label: 'Обучение', page: 'education' },
    { label: 'Новини', page: 'news' },
    { label: 'Документи', page: 'documents' },
    { label: 'Галерия', page: 'gallery' },
    { label: 'Контакти', page: 'contact' },
  ];

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-[#F5F2ED]/95 backdrop-blur-md border-b border-[#1A1A1A]/10 text-[#1A1A1A] shadow-xs">
      {/* Top utility ribbon */}
      <div className="bg-[#1A1A1A] text-[#E6E2D9] text-xs py-2 px-4 border-b border-[#1A1A1A]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Contact snippets */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#A39A8E] text-[11px] uppercase tracking-wider">
            <a 
              href="tel:051312248" 
              className="flex items-center gap-1.5 hover:text-[#F5F2ED] transition-colors"
              id="top-phone-link"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>05131 22 48</span>
            </a>
            <a 
              href="mailto:info-400112@edu.mon.bg" 
              className="hidden sm:flex items-center gap-1.5 hover:text-[#F5F2ED] transition-colors"
              id="top-email-link"
            >
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="lowercase">info-400112@edu.mon.bg</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5 text-[#8B8378]">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>гр. Вълчи дол, ул. "Георги Димитров" 1</span>
            </div>
          </div>

          {/* Quick Platform Links & CMS Switch */}
          <div className="flex items-center gap-3 ml-auto">
            <a
              href="https://shkolo.bg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-[#262422] text-[#E6E2D9] hover:bg-[#333] hover:text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-sm border border-[#3D3833] transition-all"
              id="top-shkolo-link"
              title="Електронен дневник Shkolo"
            >
              <BookOpen className="w-3 h-3 text-[#C5A059]" />
              <span>Школо.бг</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            <button
              onClick={() => handleNavigate('cms')}
              className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-sm border transition-colors ${
                currentPage === 'cms'
                  ? 'bg-[#C5A059] text-[#1A1A1A] border-[#C5A059]'
                  : 'bg-[#262422] text-[#E6E2D9] border-[#3D3833] hover:bg-[#333] hover:text-white'
              }`}
              id="cms-admin-button"
              title="Headless CMS & Административен панел"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#C5A059]" />
              <span className="hidden sm:inline">Headless CMS</span>
              <span className="sm:hidden">CMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Urgent announcement banner ticker if active */}
      {activeAnnouncement && (
        <div className="bg-[#E6E2D9] text-[#1A1A1A] text-xs sm:text-sm font-medium py-2 px-4 border-b border-[#1A1A1A]/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="bg-[#1A1A1A] text-[#F5F2ED] text-[9px] uppercase tracking-[0.25em] font-bold px-2.5 py-0.5 rounded-xs shrink-0">
                Важно
              </span>
              <span className="truncate text-xs tracking-wide">{activeAnnouncement.text}</span>
            </div>
            {activeAnnouncement.linkText && (
              <button
                onClick={() => activeAnnouncement.targetPage && handleNavigate(activeAnnouncement.targetPage)}
                className="shrink-0 text-[11px] uppercase tracking-wider font-bold border-b border-[#1A1A1A] hover:opacity-60 transition-opacity flex items-center gap-1"
                id="announcement-cta"
              >
                <span>{activeAnnouncement.linkText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Institution identity */}
          <div 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
            id="brand-logo-button"
          >
            <div className="w-12 h-12 rounded-sm bg-[#1A1A1A] border border-[#1A1A1A]/20 flex items-center justify-center text-[#C5A059] shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <span className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#1A1A1A] uppercase group-hover:opacity-75 transition-opacity">
                  СУ "Васил Левски"
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-[0.2em] bg-[#E6E2D9] text-[#4A4540] px-2 py-0.5 rounded-xs border border-[#1A1A1A]/10">
                  <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                  Училище за пример
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8B8378] font-medium">
                гр. Вълчи дол • Област Варна
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavigate(link.page)}
                  id={`nav-link-${link.page}`}
                  className={`relative px-3.5 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#1A1A1A] font-bold'
                      : 'text-[#4A4540] hover:text-[#1A1A1A] hover:opacity-75'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] font-bold bg-[#1A1A1A] text-[#F5F2ED] px-1.5 py-0.2 rounded-xs uppercase tracking-widest">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#1A1A1A]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons: Search & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-sm text-[#1A1A1A] hover:bg-[#E6E2D9] transition-colors flex items-center gap-2 border border-[#1A1A1A]/15 bg-[#F5F2ED]"
              id="header-search-button"
              title="Търсене в сайта (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-[#8B8378]" />
              <span className="hidden md:inline text-xs text-[#8B8378] font-medium tracking-wide">Търсене...</span>
              <kbd className="hidden md:inline-block text-[9px] font-mono bg-white border border-[#1A1A1A]/15 px-1.5 py-0.5 rounded-xs text-[#8B8378]">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-sm text-[#1A1A1A] hover:bg-[#E6E2D9] transition-colors border border-[#1A1A1A]/15"
              id="mobile-menu-toggle"
              aria-label="Отвори меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#F5F2ED] border-b border-[#1A1A1A]/15 overflow-hidden shadow-lg"
            id="mobile-menu-dropdown"
          >
            <div className="px-4 pt-3 pb-6 space-y-1.5">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavigate(link.page)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xs text-xs uppercase tracking-[0.2em] font-medium text-left transition-colors ${
                      isActive
                        ? 'bg-[#1A1A1A] text-[#F5F2ED] font-bold'
                        : 'text-[#1A1A1A] hover:bg-[#E6E2D9]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-xs font-bold tracking-widest ${
                        isActive ? 'bg-[#C5A059] text-[#1A1A1A]' : 'bg-[#E6E2D9] text-[#1A1A1A]'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-2">
                <button
                  onClick={() => handleNavigate('cms')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xs bg-[#1A1A1A] text-[#E6E2D9] font-bold text-xs uppercase tracking-widest hover:bg-[#333]"
                  id="mobile-cms-button"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
                  <span>Управление на съдържанието (CMS)</span>
                </button>
                <a
                  href="https://shkolo.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xs bg-[#E6E2D9] text-[#1A1A1A] border border-[#1A1A1A]/20 font-bold text-xs uppercase tracking-widest hover:bg-[#D9D5CD]"
                  id="mobile-shkolo-link"
                >
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>Електронен дневник Shkolo.bg</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
