import React from 'react';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Heart, 
  SlidersHorizontal,
  FileText,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';
import { PageType } from '../types';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useCMS();

  return (
    <footer className="bg-[#1A1A1A] text-[#E6E2D9] pt-16 pb-10 border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#333333]">
          
          {/* Col 1: School Identity & Patron */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xs bg-[#262422] border border-[#3D3833] flex items-center justify-center text-[#C5A059]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#F5F2ED] uppercase tracking-wide">СУ "Васил Левски"</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#8B8378] font-medium">гр. Вълчи дол, обл. Варна</p>
              </div>
            </div>

            <p className="text-xs text-[#A39A8E] leading-relaxed">
              Модерно средно училище с вековни традиции и поглед към бъдещето. Подготвяме знаещи, отговорни и успешни личности.
            </p>

            <div className="p-3.5 bg-[#262422] border border-[#333333] space-y-1.5 rounded-xs">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-[#C5A059]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Девиз на училището:</span>
              </div>
              <p className="text-xs text-[#E6E2D9] font-serif italic">
                "Ако спечеля, печеля за цял народ – ако загубя, губя само мене си."
              </p>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <div className="mb-4">
              <span className="h-px w-8 bg-[#C5A059] block mb-2"></span>
              <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                Бързи връзки
              </h4>
            </div>
            <ul className="space-y-2 text-xs uppercase tracking-wider font-medium">
              {[
                { label: 'За училището & Патрон', page: 'about' as PageType },
                { label: 'Прием в 1. и 8. клас', page: 'admissions' as PageType },
                { label: 'Седмично разписание и клубове', page: 'education' as PageType },
                { label: 'Актуални новини и събития', page: 'news' as PageType },
                { label: 'Училищни документи & Бюджет', page: 'documents' as PageType },
                { label: 'Фотогалерия от събития', page: 'gallery' as PageType },
                { label: 'Контактна информация', page: 'contact' as PageType },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => setCurrentPage(item.page)}
                    className="text-[#A39A8E] hover:text-[#F5F2ED] transition-colors flex items-center gap-2 group text-left"
                  >
                    <span className="w-1 h-1 bg-[#8B8378] group-hover:bg-[#C5A059] transition-colors" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contacts & Working Hours */}
          <div className="space-y-4">
            <div>
              <span className="h-px w-8 bg-[#C5A059] block mb-2"></span>
              <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                Контакти и адрес
              </h4>
            </div>
            
            <div className="space-y-2.5 text-xs text-[#A39A8E]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>гр. Вълчи дол 9280, ул. "Георги Димитров" №1, област Варна</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Тел./Факс: <strong className="text-[#F5F2ED]">05131 22 48</strong></span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:info-400112@edu.mon.bg" className="hover:text-[#F5F2ED] transition-colors">
                  info-400112@edu.mon.bg
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:su_v.levski@abv.bg" className="hover:text-[#F5F2ED] transition-colors">
                  su_v.levski@abv.bg
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-[#333333]">
                <Clock className="w-4 h-4 text-[#8B8378] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#E6E2D9]">Канцелария:</div>
                  <div className="text-[#8B8378]">Пон – Пет: 08:00 – 16:30 ч.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Institutional Links & CMS Portal */}
          <div className="space-y-4">
            <div>
              <span className="h-px w-8 bg-[#C5A059] block mb-2"></span>
              <h4 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                Институционални връзки
              </h4>
            </div>

            <div className="space-y-2">
              <a
                href="https://www.mon.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#262422] hover:bg-[#333333] border border-[#333333] transition-colors flex items-center justify-between text-xs text-[#E6E2D9] group rounded-xs"
              >
                <span>Министерство на образованието (МОН)</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8B8378] group-hover:text-[#C5A059]" />
              </a>

              <a
                href="https://www.ruo-varna.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#262422] hover:bg-[#333333] border border-[#333333] transition-colors flex items-center justify-between text-xs text-[#E6E2D9] group rounded-xs"
              >
                <span>РУО - Варна</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8B8378] group-hover:text-[#C5A059]" />
              </a>

              <a
                href="https://shkolo.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#262422] border border-[#C5A059]/40 hover:bg-[#333333] transition-colors flex items-center justify-between text-xs text-[#C5A059] group rounded-xs"
              >
                <span className="font-semibold">Електронен дневник Shkolo.bg</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              </a>

              <button
                onClick={() => setCurrentPage('cms')}
                className="w-full mt-3 p-2.5 bg-[#1A1A1A] hover:bg-[#262422] border border-[#3D3833] transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E6E2D9] rounded-xs"
                id="footer-cms-button"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Headless CMS Панел</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B8378]">
          <div>
            © {new Date().getFullYear()} СУ "Васил Левски", гр. Вълчи дол. Всички права запазени.
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCurrentPage('documents')} 
              className="hover:text-[#F5F2ED] transition-colors"
            >
              Политика за поверителност & GDPR
            </button>
            <button 
              onClick={() => setCurrentPage('documents')} 
              className="hover:text-[#F5F2ED] transition-colors"
            >
              Достъп до обществена информация
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
