import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  Cpu, 
  Download, 
  Send, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  FileText,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';

export const AdmissionsPage: React.FC = () => {
  const { data, submitAdmissionApplication } = useCMS();

  // Form State
  const [studentName, setStudentName] = useState('');
  const [egnOrBirthDate, setEgnOrBirthDate] = useState('');
  const [gradeApplying, setGradeApplying] = useState('1. клас');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentPhone.trim() || !parentName.trim()) {
      return;
    }

    submitAdmissionApplication({
      studentName,
      egnOrBirthDate,
      gradeApplying,
      parentName,
      parentPhone,
      parentEmail,
      address,
      specialNeeds,
      notes,
    });

    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setStudentName('');
    setEgnOrBirthDate('');
    setGradeApplying('1. клас');
    setParentName('');
    setParentPhone('');
    setParentEmail('');
    setAddress('');
    setSpecialNeeds(false);
    setNotes('');
    setIsSubmitted(false);
  };

  const faqs = [
    {
      q: 'Какви са необходимите документи за записване в 1. клас?',
      a: 'Необходими са: 1. Заявление по образец (подава се онлайн или в канцеларията); 2. Оригинал на Удостоверение за завършена подготвителна група; 3. Копие от Акт за раждане на детето; 4. Лична здравно-профилактична карта с имунизационен статус от личния лекар.',
    },
    {
      q: 'Осигурено ли е целодневно обучение (занималня) за учениците от 1. до 4. клас?',
      a: 'Да, в СУ "Васил Левски" предлагаме 100% обезпечена целодневна организация на учебния ден (ЦОУД) с квалифицирани учители възпитатели, безплатен топъл обяд и разнообразна извънкласна програма до 17:30 ч.',
    },
    {
      q: 'Как се формира балът за класиране след 7. клас за профилираните паралелки?',
      a: 'Балът се образува от: Резултата от НВО по Български език и литература (удвоен) + Резултата от НВО по Математика (удвоен) + Оценките от свидетелството за основно образование по съответните профилиращи предмети (напр. Биология/Химия за STEM профила или ИТ/Математика за Софтуерния профил).',
    },
    {
      q: 'Има ли осигурен безплатен транспорт за ученици от съседни населени места?',
      a: 'Да, училището разполага с училищни автобуси, осигуряващи ежедневен сигурен и безплатен превоз за ученици от населените места в община Вълчи дол.',
    },
    {
      q: 'Какви извънкласни дейности и спортни клубове се предлагат?',
      a: 'Учениците могат да избират между клубове по роботика в STEM центъра, математически клуб "Аз и числата", екоклуб "Аз и природата", клуб "Моят бизнес", фолклорен ансамбъл "Жива вода", баскетболен и шахматен клуб.',
    },
  ];

  return (
    <div className="w-full space-y-16 pb-16">
      
      {/* 1. Page Header */}
      <section className="bg-[#1A1A1A] text-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Кампания 2026/2027
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-tight text-[#F5F2ED]">
            Прием на ученици в <br />
            <span className="text-[#C5A059] not-italic font-normal">СУ "Васил Левски", гр. Вълчи дол</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D9D5CD] max-w-3xl leading-relaxed">
            Изберете доказано качество, съвременни технологии в новия STEM център и всеотдаен учителски колектив за успешното бъдеще на вашето дете.
          </p>
        </div>
      </section>

      {/* 2. Admission Profiles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Възможности за обучение
            </span>
            <span className="h-px w-6 bg-[#C5A059]"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#1A1A1A]">
            Отворени паралелки за учебната 2026/2027 г.
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4540]">
            Запознайте се с профилите, капацитета и предимствата на всяка програма.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {data.profiles.map((prof) => (
            <div
              key={prof.id}
              className="bg-white rounded-xs p-6 sm:p-8 border border-[#1A1A1A]/10 shadow-xs hover:border-[#1A1A1A]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-xs bg-[#1A1A1A] text-[#F5F2ED]">
                    {prof.gradeLevel}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#8B8378] bg-[#E6E2D9] px-2.5 py-1 rounded-xs">
                    {prof.badge}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] leading-snug">
                  {prof.title}
                </h3>

                <p className="text-xs text-[#4A4540] leading-relaxed">
                  {prof.description}
                </p>

                <div className="p-4 rounded-xs bg-[#FAF8F5] border border-[#1A1A1A]/10 space-y-2">
                  <div className="text-xs font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#C5A059]" />
                    <span>Капацитет: <strong>{prof.capacity}</strong></span>
                  </div>
                  <div className="text-xs text-[#4A4540]">
                    <strong className="text-[#1A1A1A]">Балообразуване / Условия:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#4A4540]">
                      {prof.examSubjects.map((sub, i) => (
                        <li key={i}>{sub}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">Ключови предимства:</div>
                  <ul className="space-y-1.5 text-xs text-[#4A4540]">
                    {prof.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0 mt-1.5"></span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#1A1A1A]/10">
                <a
                  href="#application-form-section"
                  className="w-full py-3 rounded-xs bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
                  <span>Подай заявление за този профил</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Admission Steps & Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] text-[#F5F2ED] rounded-xs p-8 sm:p-12 border border-[#1A1A1A]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-6 bg-[#C5A059]"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                График на дейностите
              </span>
              <span className="h-px w-6 bg-[#C5A059]"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F5F2ED]">
              Стъпки за кандидатстване и прием
            </h2>
            <p className="text-xs sm:text-sm text-[#D9D5CD]">
              Следвайте ключовите дати за подаване на документи и класиране.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 'Етап 1',
                title: 'Подаване на заявление',
                dates: 'Май – Юни 2026',
                desc: 'Онлайн чрез формуляра на сайта или на място в канцеларията на училището.',
              },
              {
                step: 'Етап 2',
                title: 'Обявяване на класирането',
                dates: 'Юли 2026',
                desc: 'Публикуване на списъците на приетите ученици на сайта и информационното табло.',
              },
              {
                step: 'Етап 3',
                title: 'Записване на учениците',
                dates: 'Юли 2026',
                desc: 'Представяне на оригиналните документи (свидетелство/удостоверение) в училището.',
              },
              {
                step: 'Етап 4',
                title: 'Родителска среща & Старт',
                dates: 'Септември 2026',
                desc: 'Запознаване с класните ръководители, получаване на учебници и график.',
              },
            ].map((st, idx) => (
              <div key={idx} className="bg-[#262422] p-5 rounded-xs border border-[#333] relative">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[#C5A059] mb-1">{st.step}</div>
                <h3 className="text-base font-serif font-bold text-[#F5F2ED] mb-1">{st.title}</h3>
                <div className="text-[10px] uppercase tracking-wider text-[#8B8378] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{st.dates}</span>
                </div>
                <p className="text-xs text-[#D9D5CD]">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Online Application Form */}
      <section id="application-form-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-[#FAF8F5] rounded-xs border border-[#1A1A1A]/10 shadow-xl overflow-hidden">
          
          <div className="bg-[#1A1A1A] p-6 sm:p-8 text-[#F5F2ED] border-b border-[#1A1A1A]">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-[#C5A059]"></span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
                Дигитална приемна
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-[#F5F2ED]">
              Електронно заявление за прием 2026/2027
            </h2>
            <p className="text-xs text-[#D9D5CD] mt-1">
              Попълнете формата и нашето административно звено ще се свърже с Вас за потвърждение.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-xs bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center mx-auto border border-[#333]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1A1A1A]">
                  Заявлението беше изпратено успешно!
                </h3>
                <p className="text-sm text-[#4A4540] max-w-md mx-auto">
                  Благодарим Ви, че избрахте СУ "Васил Левски". Вашите данни са записани в системата на училището. Ще получите обаждане от канцеларията в рамките на 2 работни дни.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleResetForm}
                    className="px-6 py-2.5 rounded-xs bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] text-[10px] uppercase tracking-widest font-bold transition-colors"
                  >
                    Подай ново заявление
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                      Трите имена на ученика *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="напр. Иван Георгиев Иванов"
                      className="w-full px-4 py-2.5 rounded-xs border border-[#1A1A1A]/20 focus:border-[#1A1A1A] text-sm outline-hidden bg-white text-[#1A1A1A]"
                      id="student-name-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                      Дата на раждане / ЕГН на детето
                    </label>
                    <input
                      type="text"
                      value={egnOrBirthDate}
                      onChange={(e) => setEgnOrBirthDate(e.target.value)}
                      placeholder="напр. 15.04.2019"
                      className="w-full px-4 py-2.5 rounded-xs border border-[#1A1A1A]/20 focus:border-[#1A1A1A] text-sm outline-hidden bg-white text-[#1A1A1A]"
                      id="student-birth-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                      Клас / Профил, за който кандидатства *
                    </label>
                    <select
                      value={gradeApplying}
                      onChange={(e) => setGradeApplying(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xs border border-[#1A1A1A]/20 focus:border-[#1A1A1A] text-sm outline-hidden bg-white text-[#1A1A1A]"
                      id="grade-select"
                    >
                      <option value="1. клас">1. клас (Начален етап)</option>
                      <option value="5. клас">5. клас (Прогимназиален етап)</option>
                      <option value="8. клас - STEM и Природни науки">8. клас - STEM и Природни науки</option>
                      <option value="8. клас - Софтуер и Предприемачество">8. клас - Софтуер и Предприемачество</option>
                      <option value="Преместване от друг клас">Преместване от друг клас (2-12 кл.)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                      Име на родител / настойник *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="напр. Георги Иванов"
                      className="w-full px-4 py-2.5 rounded-xs border border-[#1A1A1A]/20 focus:border-[#1A1A1A] text-sm outline-hidden bg-white text-[#1A1A1A]"
                      id="parent-name-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                      Телефон за обратна връзка *
                    </label>
                    <input
                      type="tel"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="напр. 0888 123 456"
                      className="w-full px-4 py-2.5 rounded-xs border border-[#1A1A1A]/20 focus:border-[#1A1A1A] text-sm outline-hidden bg-white text-[#1A1A1A]"
                      id="parent-phone-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                      Имейл адрес
                    </label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="напр. roditel@example.com"
                      className="w-full px-4 py-2.5 rounded-xs border border-[#1A1A1A]/20 focus:border-[#1A1A1A] text-sm outline-hidden bg-white text-[#1A1A1A]"
                      id="parent-email-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                    Постоянен / Настоящ адрес
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="напр. гр. Вълчи дол, ул. Васил Левски 10"
                    className="w-full px-4 py-2.5 rounded-xs border border-[#1A1A1A]/20 focus:border-[#1A1A1A] text-sm outline-hidden bg-white text-[#1A1A1A]"
                    id="parent-address-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">
                    Допълнителни бележки / Желание за занималня и столово хранене
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Моля, посочете ако детето има специални хранителни предпочитания или се нуждае от транспорт..."
                    className="w-full px-4 py-2.5 rounded-xs border border-[#1A1A1A]/20 focus:border-[#1A1A1A] text-sm outline-hidden bg-white text-[#1A1A1A]"
                    id="admission-notes-input"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="gdpr-check"
                    required
                    className="w-4 h-4 rounded-xs text-[#1A1A1A] border-[#1A1A1A]/30 focus:ring-[#1A1A1A]"
                  />
                  <label htmlFor="gdpr-check" className="text-xs text-[#4A4540]">
                    Съгласен/на съм предоставените лични данни да бъдат обработвани за целите на приема в СУ "Васил Левски" съгласно Регламент (ЕС) 2016/679 (GDPR).
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xs bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] font-bold text-[11px] uppercase tracking-widest transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                  id="submit-admission-button"
                >
                  <Send className="w-4 h-4 text-[#C5A059]" />
                  <span>Изпрати заявление за прием</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 5. FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Въпроси и отговори
            </span>
            <span className="h-px w-6 bg-[#C5A059]"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A]">
            Често задавани въпроси от родители
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xs border border-[#1A1A1A]/10 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#1A1A1A] hover:bg-[#FAF8F5] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C5A059] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8B8378] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#4A4540] leading-relaxed border-t border-[#1A1A1A]/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
