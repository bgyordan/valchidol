import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  Users, 
  Bus, 
  FileText,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';

export const ContactPage: React.FC = () => {
  const { submitContactMessage } = useCMS();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    submitContactMessage({
      name,
      email,
      phone,
      subject: subject || 'Общо запитване към училището',
      message,
    });

    setIsSent(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setIsSent(false);
  };

  return (
    <div className="w-full space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-[#1A1A1A] text-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Контакти & Локация
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-tight text-[#F5F2ED]">
            Свържете се с <br />
            <span className="text-[#C5A059] not-italic font-normal">СУ „Васил Левски“, гр. Вълчи дол</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D9D5CD] max-w-3xl leading-relaxed">
            На разположение сме за вашите въпроси относно прием, документи, учебен процес и консултации с преподаватели.
          </p>
        </div>
      </section>

      {/* 2. Key Contact Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Director */}
          <div className="bg-white p-6 rounded-xs border border-[#1A1A1A]/10 shadow-xs space-y-4 flex flex-col justify-between hover:border-[#1A1A1A]/30 transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xs bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Директор</h3>
              <p className="text-xs text-[#C5A059] font-bold">Марияна Митева</p>
              <p className="text-xs text-[#4A4540]">Приемно време: Вторник и Четвъртък 14:00 - 16:00 ч.</p>
            </div>

            <div className="pt-3 border-t border-[#1A1A1A]/5 space-y-2 text-xs text-[#4A4540]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>05131 22 48</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <a href="mailto:info-400112@edu.mon.bg" className="hover:text-[#C5A059] truncate">
                  info-400112@edu.mon.bg
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Deputy Directors */}
          <div className="bg-white p-6 rounded-xs border border-[#1A1A1A]/10 shadow-xs space-y-4 flex flex-col justify-between hover:border-[#1A1A1A]/30 transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xs bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Заместник-директори</h3>
              <p className="text-xs text-[#1A1A1A] font-semibold">
                Светла Иванова (УД) <br />
                Людмила Петкова (АСД)
              </p>
              <p className="text-xs text-[#4A4540]">Организация на учебния процес и стопанска дейност</p>
            </div>

            <div className="pt-3 border-t border-[#1A1A1A]/5 space-y-2 text-xs text-[#4A4540]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>05131 22 48</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <a href="mailto:su_v.levski@abv.bg" className="hover:text-[#C5A059] truncate">
                  su_v.levski@abv.bg
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Clerical Office */}
          <div className="bg-white p-6 rounded-xs border border-[#1A1A1A]/10 shadow-xs space-y-4 flex flex-col justify-between hover:border-[#1A1A1A]/30 transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xs bg-[#C5A059] text-[#1A1A1A] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Канцелария & Деловодство</h3>
              <p className="text-xs text-[#4A4540]">Издаване на служебни бележки, дипломи, карти и прием на заявления.</p>
              <p className="text-xs text-[#8B8378]">Работно време: 08:00 – 16:30 ч.</p>
            </div>

            <div className="pt-3 border-t border-[#1A1A1A]/5 space-y-2 text-xs text-[#4A4540]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>05131 22 48</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Пон – Петък (без прекъсване)</span>
              </div>
            </div>
          </div>

          {/* Card 4: Address & Transport */}
          <div className="bg-white p-6 rounded-xs border border-[#1A1A1A]/10 shadow-xs space-y-4 flex flex-col justify-between hover:border-[#1A1A1A]/30 transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xs bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Адрес на училището</h3>
              <p className="text-xs text-[#4A4540]">
                гр. Вълчи дол 9280, <br />
                ул. „Георги Димитров“ №1, <br />
                област Варна
              </p>
            </div>

            <div className="pt-3 border-t border-[#1A1A1A]/5 space-y-2 text-xs text-[#4A4540]">
              <div className="flex items-center gap-2">
                <Bus className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Училищни автобуси от селата</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Form & Location Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Contact Form */}
          <div className="lg:col-span-6 bg-white rounded-xs border border-[#1A1A1A]/10 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#8B8378] bg-[#E6E2D9] px-2.5 py-1 rounded-xs">
                Форма за контакт
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] mt-2">
                Изпратете запитване
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4540] mt-1">
                Попълнете формата и нашето административно звено ще Ви отговори в най-кратък срок.
              </p>
            </div>

            {isSent ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-xs bg-[#FAF8F5] text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Съобщението е получено!</h3>
                <p className="text-xs sm:text-sm text-[#4A4540]">
                  Благодарим Ви! Ще се свържем с Вас на посочения имейл адрес или телефон.
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xs bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] text-[10px] uppercase tracking-widest font-bold transition-colors"
                >
                  Изпрати ново съобщение
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]">Вашето име *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иван Петров"
                      className="w-full px-3.5 py-2 rounded-xs border border-[#1A1A1A]/15 focus:border-[#1A1A1A] text-xs bg-[#FAF8F5] focus:bg-white outline-hidden text-[#1A1A1A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]">Имейл адрес *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ivan@example.com"
                      className="w-full px-3.5 py-2 rounded-xs border border-[#1A1A1A]/15 focus:border-[#1A1A1A] text-xs bg-[#FAF8F5] focus:bg-white outline-hidden text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]">Телефон</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0888 123 456"
                      className="w-full px-3.5 py-2 rounded-xs border border-[#1A1A1A]/15 focus:border-[#1A1A1A] text-xs bg-[#FAF8F5] focus:bg-white outline-hidden text-[#1A1A1A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]">Тема на запитването</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Прием, служебна бележка, друго..."
                      className="w-full px-3.5 py-2 rounded-xs border border-[#1A1A1A]/15 focus:border-[#1A1A1A] text-xs bg-[#FAF8F5] focus:bg-white outline-hidden text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]">Съобщение *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Моля, опишете вашия въпрос подробно..."
                    className="w-full px-3.5 py-2 rounded-xs border border-[#1A1A1A]/15 focus:border-[#1A1A1A] text-xs bg-[#FAF8F5] focus:bg-white outline-hidden text-[#1A1A1A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xs bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-4 h-4 text-[#C5A059] group-hover:text-[#1A1A1A]" />
                  <span>Изпрати запитването</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Interactive Location Map & Navigation Directions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-xs border border-[#1A1A1A]/10 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-[#1A1A1A]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A]">
                    Карта на гр. Вълчи дол (Координати: 43.4042° N, 27.5516° E)
                  </span>
                </div>
                <a
                  href="https://maps.google.com/?q=гр.+Вълчи+дол+ул.+Георги+Димитров+1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] hover:text-[#C5A059] transition-colors"
                >
                  Google Maps →
                </a>
              </div>

              {/* Embedded Map Representation */}
              <div className="relative h-80 bg-[#FAF8F5] w-full overflow-hidden">
                <iframe
                  title="Карта СУ Васил Левски Вълчи дол"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=27.5300%2C43.3950%2C27.5700%2C43.4150&amp;layer=mapnik&amp;marker=43.4042%2C27.5516"
                  className="w-full h-full border-none grayscale-[20%]"
                />
              </div>

              <div className="p-5 bg-[#FAF8F5] border-t border-[#1A1A1A]/10 text-xs text-[#4A4540] space-y-2">
                <div className="font-bold text-[#1A1A1A] uppercase text-[10px] tracking-wider">Как да ни намерите:</div>
                <p className="leading-relaxed">
                  СУ „Васил Левски“ се намира в централната градска част на гр. Вълчи дол, на 5 минути пеша от автогарата и жп гарата. Осигурен е удобен паркинг за родители и учители, както и рампа за инвалидни колички.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
