import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Users, 
  Coffee, 
  FileCheck2, 
  ExternalLink 
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';
import { PageType } from '../types';

export const QuickAccessBar: React.FC = () => {
  const { setCurrentPage } = useCMS();

  const items = [
    {
      title: 'Е-Дневник Shkolo',
      desc: 'Оценки, отсъствия, дневник',
      icon: BookOpen,
      isExternal: true,
      href: 'https://shkolo.bg',
    },
    {
      title: 'Седмично разписание',
      desc: 'График по класове и смени',
      icon: Calendar,
      page: 'education' as PageType,
    },
    {
      title: 'Дневен режим & Звънци',
      desc: 'Начало и край на часовете',
      icon: Clock,
      page: 'education' as PageType,
    },
    {
      title: 'Прием 2026/2027',
      desc: 'Подаване на заявление онлайн',
      icon: FileCheck2,
      page: 'admissions' as PageType,
    },
    {
      title: 'Учители & Консултации',
      desc: 'Приемни часове и контакти',
      icon: Users,
      page: 'about' as PageType,
    },
  ];

  return (
    <div className="w-full bg-[#F5F2ED] border-b border-[#1A1A1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {items.map((item, idx) => {
            const Icon = item.icon;
            if (item.isExternal) {
              return (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-3.5 bg-[#E6E2D9] hover:bg-[#D9D5CD] border border-[#1A1A1A]/12 transition-all duration-200 flex items-center gap-3 group rounded-xs"
                >
                  <div className="p-2 rounded-xs bg-[#1A1A1A] text-[#C5A059] group-hover:scale-105 transition-transform shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-serif font-bold text-[#1A1A1A] truncate flex items-center gap-1">
                      <span>{item.title}</span>
                      <ExternalLink className="w-3 h-3 text-[#8B8378] shrink-0" />
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[#8B8378] truncate">{item.desc}</div>
                  </div>
                </a>
              );
            }

            return (
              <button
                key={idx}
                onClick={() => item.page && setCurrentPage(item.page)}
                className="p-3 sm:p-3.5 bg-[#E6E2D9] hover:bg-[#D9D5CD] border border-[#1A1A1A]/12 transition-all duration-200 flex items-center gap-3 text-left group rounded-xs"
              >
                <div className="p-2 rounded-xs bg-[#1A1A1A] text-[#C5A059] group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-serif font-bold text-[#1A1A1A] truncate">{item.title}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8B8378] truncate">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
