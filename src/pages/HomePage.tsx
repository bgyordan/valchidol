import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Trophy, 
  Users, 
  ShieldCheck, 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  HeartHandshake,
  Compass,
  FileText
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';
import { QuickAccessBar } from '../components/QuickAccessBar';
import { LightboxModal } from '../components/LightboxModal';
import { GalleryImage } from '../types';

export const HomePage: React.FC = () => {
  const { data, setCurrentPage, setSelectedNewsId } = useCMS();
  const [lightboxImages, setLightboxImages] = useState<GalleryImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const pinnedNews = data.news.slice(0, 3);
  const latestAlbum = data.galleryAlbums[0];

  const handleOpenPhoto = (images: GalleryImage[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleOpenNews = (id: string) => {
    setSelectedNewsId(id);
    setCurrentPage('news');
  };

  return (
    <div className="w-full space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-[#1A1A1A] text-[#F5F2ED] overflow-hidden border-b border-[#1A1A1A]">
        {/* Background Subtle Texture */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80"
            alt="СУ Васил Левски"
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-[#1A1A1A]/85" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#C5A059]"></span>
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#8B8378]">
                  Иновативно училище • Прием 2026/2027
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif italic tracking-tight text-[#F5F2ED] leading-[1.05]">
                Знание с традиции. <br />
                <span className="text-[#C5A059] not-italic font-normal">
                  Умения за бъдещето.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#D9D5CD] max-w-2xl leading-relaxed font-normal">
                Добре дошли в официалния портал на Средно училище „Васил Левски“, гр. Вълчи дол. Предоставяме съвременно образование в модерен STEM център, засилена подготовка и грижовна среда за всяко дете.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <button
                  onClick={() => setCurrentPage('admissions')}
                  className="px-8 py-4 bg-[#F5F2ED] text-[#1A1A1A] text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors rounded-xs shadow-md flex items-center gap-2"
                  id="hero-apply-button"
                >
                  <span>Кандидатствай онлайн</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCurrentPage('about')}
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#F5F2ED] border-b border-[#F5F2ED] pb-1 hover:opacity-75 transition-opacity flex items-center gap-1.5"
                  id="hero-explore-button"
                >
                  <span>За училището</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              </div>

              {/* Badges strip */}
              <div className="pt-8 border-t border-[#333333] grid grid-cols-3 gap-4 text-xs text-[#8B8378]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                  <span className="uppercase tracking-widest text-[10px]">Училище за пример</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                  <span className="uppercase tracking-widest text-[10px]">STEM център</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                  <span className="uppercase tracking-widest text-[10px]">100% всеотдайност</span>
                </div>
              </div>
            </motion.div>

            {/* Right Card / Visual Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative bg-[#E6E2D9] text-[#1A1A1A] p-7 border border-[#1A1A1A]/15 shadow-2xl rounded-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xs bg-[#1A1A1A] text-[#C5A059]">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-serif font-bold text-[#1A1A1A] uppercase tracking-wide">СУ "Васил Левски"</div>
                      <div className="text-[10px] uppercase tracking-widest text-[#8B8378]">Вълчи дол • Варненска област</div>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 bg-[#1A1A1A] text-[#F5F2ED] rounded-xs">
                    Прием 2026/27
                  </span>
                </div>

                {/* Admission Profiles highlights */}
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                    Акценти за новата учебна година
                  </div>
                  
                  <div 
                    onClick={() => setCurrentPage('admissions')}
                    className="p-3.5 bg-[#FAF8F5] hover:bg-white border border-[#1A1A1A]/10 transition-all cursor-pointer group rounded-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1A1A1A] mb-1">
                      <span>1. клас • Начален етап</span>
                      <span className="text-[9px] uppercase tracking-widest text-[#8B8378]">Целодневна форма</span>
                    </div>
                    <p className="text-xs text-[#4A4540] leading-relaxed">
                      Безплатен топъл обяд, занималня до 17:30 ч., дигитални таблети и грижовни педагози.
                    </p>
                  </div>

                  <div 
                    onClick={() => setCurrentPage('admissions')}
                    className="p-3.5 bg-[#FAF8F5] hover:bg-white border border-[#1A1A1A]/10 transition-all cursor-pointer group rounded-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1A1A1A] mb-1">
                      <span>8. клас • Природни науки & STEM</span>
                      <span className="text-[9px] uppercase tracking-widest text-[#8B8378]">26 места</span>
                    </div>
                    <p className="text-xs text-[#4A4540] leading-relaxed">
                      Биология, химия и ИТ лаборатории, насочени към медицина, фармация и биотехнологии.
                    </p>
                  </div>

                  <div 
                    onClick={() => setCurrentPage('admissions')}
                    className="p-3.5 bg-[#FAF8F5] hover:bg-white border border-[#1A1A1A]/10 transition-all cursor-pointer group rounded-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1A1A1A] mb-1">
                      <span>8. клас • Софтуер & Предприемачество</span>
                      <span className="text-[9px] uppercase tracking-widest text-[#8B8378]">26 места</span>
                    </div>
                    <p className="text-xs text-[#4A4540] leading-relaxed">
                      Програмиране, дигитални технологии, бизнес умения и практическа реализация.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPage('admissions')}
                  className="w-full py-3 bg-[#1A1A1A] hover:bg-[#333] text-[#F5F2ED] text-[10px] uppercase tracking-[0.2em] font-bold transition-colors flex items-center justify-center gap-2 rounded-xs"
                >
                  <span>Виж пълните условия за прием</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Quick Access Bar */}
      <QuickAccessBar />

      {/* 3. Director's Welcome & Institutional Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-xs border border-[#1A1A1A]/10 shadow-xs p-6 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Director Photo with Architectural Frame */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-48 h-56 sm:w-56 sm:h-64 rounded-xs overflow-hidden border border-[#1A1A1A]/20 shadow-xl bg-[#E6E2D9]">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                    alt="Марияна Митева - Директор"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-[#1A1A1A] text-[#C5A059] p-2.5 rounded-xs shadow-lg border border-[#1A1A1A]/40">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-base font-serif font-bold text-[#1A1A1A] uppercase tracking-wide">Марияна Митева</h3>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B8378] font-semibold mt-1">
                  Директор на СУ "Васил Левски"
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#8B8378]">гр. Вълчи дол</p>
              </div>
            </div>

            {/* Director Address Message */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#C5A059]"></span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                  Приветствие от Директора
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-[#1A1A1A] leading-tight">
                "Училището е дом на знанието, където всяко дете открива своя талант и криле"
              </h2>

              <div className="space-y-3 text-sm text-[#4A4540] leading-relaxed">
                <p>
                  Скъпи ученици, уважаеми родители и приятели на СУ „Васил Левски“,
                </p>
                <p>
                  Нашето училище е място със здрави корени и високи цели. В град Вълчи дол ние създадохме съвременна образователна среда, в която учениците получават не само солидни академични знания, но и умения за реалния живот – критично мислене, дигитална култура, отговорност и човечност.
                </p>
                <p>
                  С новия ни STEM център, програмата "Училище за пример" и всеотдайния ни екип, ние сме до всяко дете по пътя му към личен и професионален успех.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setCurrentPage('about')}
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:opacity-60 transition-opacity inline-flex items-center gap-2"
                >
                  <span>Запознайте се с нашето училище и история</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Stats Counter Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { number: '75+', label: 'Години традиции', desc: 'Богата образователна история във Вълчи дол', icon: Clock },
            { number: '350+', label: 'Ученици', desc: 'От 1. до 12. клас в дневна форма', icon: Users },
            { number: '35+', label: 'Педагози', desc: 'Висококвалифицирани учители', icon: GraduationCap },
            { number: '100%', label: 'STEM среда', desc: 'Модерни лаборатории и дигитални кабинети', icon: Cpu },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-[#E6E2D9] p-6 sm:p-7 rounded-xs border border-[#1A1A1A]/10 transition-all hover:bg-[#D9D5CD]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-xs bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-[#8B8378]">0{idx + 1}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-serif italic text-[#1A1A1A] tracking-tight">
                  {stat.number}
                </div>
                <div className="text-xs font-serif font-bold text-[#1A1A1A] uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-[#4A4540] mt-1">
                  {stat.desc}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Key Highlights / Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Защо да изберете СУ "Васил Левски"
            </span>
            <span className="h-px w-8 bg-[#C5A059]"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#1A1A1A]">
            Съвременно образование с грижа за всеки ученик
          </h2>
          <p className="text-sm text-[#4A4540]">
            Комбинираме високотехнологична среда, индивидуален подход и богати извънкласни занимания.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Високотехнологичен STEM Център',
              desc: 'Оборудвани лаборатории по природни науки, комплекти по роботика, 3D принтери и съвременен софтуер.',
              icon: Cpu,
            },
            {
              title: 'Целодневна организация (1-4 кл.)',
              desc: 'Грижовни възпитатели, топъл обяд, подготовка на домашни работи и спортни игри в обезопасена среда.',
              icon: BookOpen,
            },
            {
              title: 'Клубове и спортна база',
              desc: 'Клубове "Аз и числата", "Аз и природата", "Моят бизнес", фолклорен ансамбъл, баскетбол и шахмат.',
              icon: Trophy,
            },
            {
              title: 'Програма "Училище за пример"',
              desc: 'Участие в престижни национални и европейски програми за модерна педагогика и проектно учене.',
              icon: ShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xs p-6 border border-[#1A1A1A]/10 shadow-xs hover:border-[#1A1A1A]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xs bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-xs text-[#4A4540] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Latest News & Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-px w-6 bg-[#C5A059]"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                Училищен бюлетин
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]">
              Актуални новини
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('news')}
            className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:opacity-60 transition-opacity flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Всички новини</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pinnedNews.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenNews(item.id)}
              className="bg-white rounded-xs overflow-hidden border border-[#1A1A1A]/10 shadow-xs hover:border-[#1A1A1A]/30 transition-all duration-300 cursor-pointer flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-[#E6E2D9]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#1A1A1A] text-[#F5F2ED] text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-xs">
                  {item.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#8B8378] mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.readTime}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#1A1A1A] group-hover:opacity-75 transition-opacity line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#4A4540] mt-2 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] group-hover:text-[#8B8378]">
                  <span>Прочети цялата статия</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Gallery Snapshot Preview */}
      {latestAlbum && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1A1A1A] rounded-xs p-6 sm:p-10 text-[#F5F2ED] border border-[#1A1A1A]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                  Фотоархив
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F5F2ED] mt-1">
                  Училищни моменти в кадри
                </h2>
              </div>
              <button
                onClick={() => setCurrentPage('gallery')}
                className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C5A059] border-b border-[#C5A059] pb-0.5 hover:opacity-75 transition-opacity inline-flex items-center gap-2"
              >
                <span>Към пълната галерия ({data.galleryAlbums.length} албума)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestAlbum.images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenPhoto(latestAlbum.images, idx)}
                  className="relative h-40 sm:h-52 rounded-xs overflow-hidden cursor-pointer group border border-[#333333]"
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-xs text-[#F5F2ED] line-clamp-2">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Call to Action (Admission 2026/27) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xs bg-[#E6E2D9] p-8 sm:p-12 text-[#1A1A1A] border border-[#1A1A1A]/15 overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#C5A059]"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                Станете част от нашата общност
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif italic tracking-tight text-[#1A1A1A]">
              Запишете Вашето дете в СУ "Васил Левски"
            </h2>

            <p className="text-sm text-[#4A4540] leading-relaxed">
              Подайте лесно електронно заявление за прием в 1. клас или изберете перспективен гимназиален профил за 8. клас. Заповядайте на място или се свържете с нас!
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-3">
              <button
                onClick={() => setCurrentPage('admissions')}
                className="px-8 py-3.5 bg-[#1A1A1A] hover:bg-[#333] text-[#F5F2ED] text-[11px] uppercase tracking-[0.2em] font-bold transition-all rounded-xs shadow-md flex items-center gap-2"
              >
                <span>Формуляр за прием</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:opacity-60 transition-opacity"
              >
                <span>Връзка с канцеларията</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={isLightboxOpen}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        onClose={() => setIsLightboxOpen(false)}
        albumTitle={latestAlbum?.title}
      />
    </div>
  );
};
