import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  Mail, 
  Phone, 
  Clock, 
  User, 
  Cpu, 
  Compass, 
  CheckCircle2,
  Sparkles,
  Music,
  MapPin,
  Flame
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';
import { Teacher } from '../types';

export const AboutPage: React.FC = () => {
  const { data } = useCMS();
  const [selectedStage, setSelectedStage] = useState<string>('Всички');

  const stages = [
    'Всички',
    'Ръководство',
    'Начален етап (1-4 кл.)',
    'Прогимназиален етап (5-7 кл.)',
    'Гимназиален етап (8-12 кл.)',
    'Ресурсни специалисти',
  ];

  const filteredTeachers = selectedStage === 'Всички'
    ? data.teachers
    : data.teachers.filter(t => t.stage === selectedStage);

  return (
    <div className="w-full space-y-16 pb-16">
      
      {/* 1. Page Header Banner */}
      <section className="bg-[#1A1A1A] text-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              За училището
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-tight text-[#F5F2ED]">
            История, мисия и екип на <br />
            <span className="text-[#C5A059] not-italic font-normal">СУ "Васил Левски", гр. Вълчи дол</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D9D5CD] max-w-3xl leading-relaxed">
            Повече от седем десетилетия градим мостове между традициите на българското просвещение и високите стандарти на съвременното дигитално и STEM образование.
          </p>
        </div>
      </section>

      {/* 2. Patron of the School: Vasil Levski */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xs bg-[#FAF8F5] p-8 sm:p-12 text-[#1A1A1A] border border-[#1A1A1A]/10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Patron Portrait card */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-xs overflow-hidden border border-[#1A1A1A]/20 shadow-xl bg-[#E6E2D9]">
                  <img
                    src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80"
                    alt="Патрон Васил Левски"
                    className="w-full h-full object-cover filter sepia-25"
                  />
                </div>
                <div className="absolute -bottom-3 bg-[#1A1A1A] text-[#F5F2ED] font-bold text-[9px] px-3 py-1 rounded-xs uppercase tracking-widest shadow-md">
                  Нашият патрон
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-serif font-bold text-[#1A1A1A] uppercase tracking-wide">Васил Иванов Кунчев</h3>
                <p className="text-[10px] uppercase tracking-wider text-[#8B8378] font-medium">Апостолът на българската свобода (1837 – 1873)</p>
              </div>
            </div>

            {/* Right Patron Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[#C5A059]"></span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                  Завет и вдъхновение
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A] leading-tight">
                "Времето е в нас и ние сме във времето; то нас обръща и ние него обръщаме."
              </h2>

              <p className="text-sm text-[#4A4540] leading-relaxed">
                Да носиш името на Васил Левски е чест, привилегия и огромна отговорност. В СУ „Васил Левски“ възпитаваме у децата честност, родолюбие, стремеж към справедливост и несломим дух за преодоляване на предизвикателствата.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xs bg-[#E6E2D9] border border-[#1A1A1A]/10 text-xs space-y-1">
                  <div className="font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">Патронен празник</div>
                  <div className="text-[#4A4540]">19 февруари – Ден на почит и тържествена училищна академия</div>
                </div>
                <div className="p-3.5 rounded-xs bg-[#E6E2D9] border border-[#1A1A1A]/10 text-xs space-y-1">
                  <div className="font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">Училищен девиз</div>
                  <div className="text-[#4A4540]">"Знание, отговорност, бъдеще!"</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. History Timeline & Traditions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#C5A059]"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                Хроника на развитието
              </span>
              <span className="h-px w-8 bg-[#C5A059]"></span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif italic text-[#1A1A1A]">
              Пътят на знанието във Вълчи дол
            </h2>
            <p className="text-sm text-[#4A4540]">
              Основни етапи в изграждането и модернизацията на нашето училище.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                year: 'Основаване и първи випуски',
                title: 'Начало на просветното дело',
                desc: 'Откриване на първото класно училище в района на Вълчи дол, посветено на грамотността и съхраняването на българските културни традиции.',
                icon: BookOpen,
              },
              {
                year: 'Разширяване и Средно училище',
                title: 'Развитие на гимназиален етап',
                desc: 'Училището се утвърждава като водещо образователно средище в община Вълчи дол, предлагащо пълно средно образование и профилирана подготовка.',
                icon: Award,
              },
              {
                year: 'Съвремие и STEM ера (2024 - 2026)',
                title: 'Иновативно училище за пример',
                desc: 'Въвеждане на модерен STEM център по природни науки, интерактивни технологии, участие в проекти на МОН и международен обмен по Erasmus+.',
                icon: Cpu,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xs border border-[#1A1A1A]/10 shadow-xs hover:border-[#1A1A1A]/30 transition-all"
                >
                  <div className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-2">
                    {item.year}
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                  <p className="text-xs text-[#4A4540] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Mission, Vision, and Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#1A1A1A] text-[#F5F2ED] p-8 rounded-xs shadow-md space-y-4 border border-[#1A1A1A]">
            <div className="w-10 h-10 rounded-xs bg-[#262422] text-[#C5A059] flex items-center justify-center font-bold border border-[#333]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#F5F2ED]">Нашата мисия</h3>
            <p className="text-xs text-[#D9D5CD] leading-relaxed">
              Да предоставяме качествено, достъпно и модерно образование, подкрепящо личностното развитие, креативността и критичното мислене на всеки ученик в сигурна и стимулираща среда.
            </p>
          </div>

          <div className="bg-[#E6E2D9] text-[#1A1A1A] p-8 rounded-xs shadow-md space-y-4 border border-[#1A1A1A]/15">
            <div className="w-10 h-10 rounded-xs bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Нашата визия</h3>
            <p className="text-xs text-[#4A4540] leading-relaxed">
              СУ „Васил Левски“ да бъде водещо иновативно училище в Североизточна България – притегателен център за млади таланти, модерни технологии и висок педагогически професионализъм.
            </p>
          </div>

          <div className="bg-[#FAF8F5] text-[#1A1A1A] p-8 rounded-xs shadow-md space-y-4 border border-[#1A1A1A]/10">
            <div className="w-10 h-10 rounded-xs bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Основни ценности</h3>
            <ul className="text-xs text-[#4A4540] space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                <span>Уважение, етика и толерантност</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                <span>Стремеж към висок академичен успех</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                <span>Партньорство с родители и общество</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                <span>Дигитална грамотност и STEM иновации</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. Teachers & Management Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-px w-6 bg-[#C5A059]"></span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                  Педагогически екип
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]">
                Учители и ръководство
              </h2>
            </div>

            {/* Stage filter buttons */}
            <div className="flex flex-wrap gap-1.5">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-3 py-1.5 rounded-xs text-[10px] uppercase tracking-wider font-bold transition-all ${
                    selectedStage === stage
                      ? 'bg-[#1A1A1A] text-[#F5F2ED]'
                      : 'bg-[#E6E2D9] text-[#1A1A1A] hover:bg-[#D9D5CD] border border-[#1A1A1A]/10'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-xs overflow-hidden border border-[#1A1A1A]/10 shadow-xs hover:border-[#1A1A1A]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 overflow-hidden relative bg-[#E6E2D9]">
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#1A1A1A] text-[#F5F2ED] text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-xs">
                      {teacher.stage.split(' ')[0]}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-serif font-bold text-[#1A1A1A]">{teacher.name}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-[#8B8378] font-semibold">{teacher.role}</p>

                    <div className="pt-2 border-t border-[#1A1A1A]/10 text-xs text-[#4A4540] space-y-1">
                      <div className="font-medium text-[#1A1A1A]">
                        Предмети: {teacher.subjects.join(', ')}
                      </div>
                      <div className="text-[11px] text-[#8B8378] line-clamp-2">
                        {teacher.qualification}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2 border-t border-[#1A1A1A]/5">
                  {teacher.consultationHours && (
                    <div className="p-2 rounded-xs bg-[#FAF8F5] border border-[#1A1A1A]/10 text-[11px] text-[#1A1A1A] flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8B8378] shrink-0 mt-0.5" />
                      <span><strong>Приемен час:</strong> {teacher.consultationHours}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-[#8B8378] pt-1">
                    <a
                      href={`mailto:${teacher.email}`}
                      className="flex items-center gap-1 hover:text-[#1A1A1A] transition-colors"
                      title={teacher.email}
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="truncate max-w-[150px]">{teacher.email}</span>
                    </a>
                    {teacher.phone && (
                      <span className="text-[11px] text-[#8B8378]">{teacher.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Facilities & Material Base */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-xs p-8 sm:p-12 border border-[#1A1A1A]/10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-6 bg-[#C5A059]"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                Инфраструктура
              </span>
              <span className="h-px w-6 bg-[#C5A059]"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]">
              Модерна материална база
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4540]">
              Осигуряваме най-добрите условия за обучение, спорт, лабораторни опити и творчество.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Високотехнологичен STEM център',
                desc: 'Лаборатории по природни науки с интерактивни дъски, микроскопи, 3D принтери и комплекти по роботика.',
                img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Физкултурен салон и спортни площадки',
                desc: 'Обновен физкултурен салон, открити игрища за баскетбол, волейбол и футбол с модерна настилка.',
                img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Училищна библиотека и читалня',
                desc: 'Богат фонд от художествена и научна литература, компютърни работни места и тиха зона за самоподготовка.',
                img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
              },
            ].map((facility, idx) => (
              <div key={idx} className="bg-white rounded-xs overflow-hidden border border-[#1A1A1A]/10 shadow-xs">
                <div className="h-44 overflow-hidden bg-[#E6E2D9]">
                  <img
                    src={facility.img}
                    alt={facility.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-serif font-bold text-[#1A1A1A]">{facility.title}</h3>
                  <p className="text-xs text-[#4A4540] leading-relaxed">{facility.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. School Anthem & Symbols */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] text-[#F5F2ED] rounded-xs p-8 sm:p-12 border border-[#1A1A1A] shadow-xl space-y-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 rounded-xs bg-[#262422] text-[#C5A059] border border-[#333] mx-auto">
            <Music className="w-5 h-5" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F5F2ED]">
            Химн и символи на СУ "Васил Левски"
          </h2>

          <div className="p-6 rounded-xs bg-[#262422] border border-[#333] max-w-xl mx-auto text-sm italic font-serif text-[#E6E2D9] space-y-3 leading-relaxed">
            <p>
              "В сърцата носим пламък жив и чист,<br />
              с името на Левски крачим гордо напред!<br />
              Знанието е нашето крило и чест,<br />
              с наука и дух градим бъдния свет!"
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-[#8B8378] font-medium">
            Символите на училището включват училищно знаме, герб, химн и униформени елементи за тържествени поводи.
          </p>
        </div>
      </section>

    </div>
  );
};
