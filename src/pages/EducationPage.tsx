import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Trophy, 
  Users, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Award,
  Flame,
  Globe
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';

export const EducationPage: React.FC = () => {
  const { data } = useCMS();
  const [selectedClass, setSelectedClass] = useState<string>('8А');
  const [selectedDay, setSelectedDay] = useState<string>('Понеделник');

  const classes = ['1А', '3А', '5А', '7А', '8А (STEM)', '9А (ИТ)', '11А', '12А'];
  const days = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък'];

  // Mocked rich schedule mapping for classes
  const sampleSchedule: { [key: string]: Array<{ hour: number; time: string; subject: string; teacher: string; room: string }> } = {
    'Понеделник': [
      { hour: 1, time: '08:00 - 08:45', subject: 'Математика', teacher: 'Светла Иванова', room: 'Кабинет 204' },
      { hour: 2, time: '08:55 - 09:40', subject: 'Български език и литература', teacher: 'Марияна Митева', room: 'Кабинет 102' },
      { hour: 3, time: '10:00 - 10:45', subject: 'Биология и ЗО (STEM)', teacher: 'Елена Стоянова', room: 'STEM Лаборатория' },
      { hour: 4, time: '10:55 - 11:40', subject: 'Информационни технологии', teacher: 'Иван Димитров', room: 'Компютърна зала 1' },
      { hour: 5, time: '11:50 - 12:35', subject: 'Английски език', teacher: 'Радостина Василева', room: 'Кабинет 201' },
      { hour: 6, time: '12:45 - 13:30', subject: 'Физическо възпитание и спорт', teacher: 'Димитър Колев', room: 'Спортен салон' },
    ],
    'Вторник': [
      { hour: 1, time: '08:00 - 08:45', subject: 'Химия и ООС (STEM)', teacher: 'Елена Стоянова', room: 'STEM Лаборатория' },
      { hour: 2, time: '08:55 - 09:40', subject: 'История и цивилизации', teacher: 'Красимир Николов', room: 'Кабинет 203' },
      { hour: 3, time: '10:00 - 10:45', subject: 'Математика', teacher: 'Светла Иванова', room: 'Кабинет 204' },
      { hour: 4, time: '10:55 - 11:40', subject: 'Български език и литература', teacher: 'Марияна Митева', room: 'Кабинет 102' },
      { hour: 5, time: '11:50 - 12:35', subject: 'География и икономика', teacher: 'Красимир Николов', room: 'Кабинет 203' },
      { hour: 6, time: '12:45 - 13:30', subject: 'Музика', teacher: 'Десислава Георгиева', room: 'Актова зала' },
    ],
    'Сряда': [
      { hour: 1, time: '08:00 - 08:45', subject: 'Програмиране & Роботика', teacher: 'Иван Димитров', room: 'STEM Център' },
      { hour: 2, time: '08:55 - 09:40', subject: 'Програмиране & Роботика', teacher: 'Иван Димитров', room: 'STEM Център' },
      { hour: 3, time: '10:00 - 10:45', subject: 'Физика и астрономия', teacher: 'Елена Стоянова', room: 'Кабинет 202' },
      { hour: 4, time: '10:55 - 11:40', subject: 'Български език и литература', teacher: 'Марияна Митева', room: 'Кабинет 102' },
      { hour: 5, time: '11:50 - 12:35', subject: 'Английски език', teacher: 'Радостина Василева', room: 'Кабинет 201' },
      { hour: 6, time: '12:45 - 13:30', subject: 'Час на класа', teacher: 'Класен ръководител', room: 'Кабинет 102' },
    ],
    'Четвъртък': [
      { hour: 1, time: '08:00 - 08:45', subject: 'Биология (Профил)', teacher: 'Елена Стоянова', room: 'STEM Лаборатория' },
      { hour: 2, time: '08:55 - 09:40', subject: 'Математика', teacher: 'Светла Иванова', room: 'Кабинет 204' },
      { hour: 3, time: '10:00 - 10:45', subject: 'Философия / Гражданско образ.', teacher: 'Красимир Николов', room: 'Кабинет 203' },
      { hour: 4, time: '10:55 - 11:40', subject: 'Английски език', teacher: 'Радостина Василева', room: 'Кабинет 201' },
      { hour: 5, time: '11:50 - 12:35', subject: 'Физическо възпитание и спорт', teacher: 'Димитър Колев', room: 'Спортен салон' },
    ],
    'Петък': [
      { hour: 1, time: '08:00 - 08:45', subject: 'Предприемачество & Бизнес', teacher: 'Людмила Петкова', room: 'Кабинет 105' },
      { hour: 2, time: '08:55 - 09:40', subject: 'Български език и литература', teacher: 'Марияна Митева', room: 'Кабинет 102' },
      { hour: 3, time: '10:00 - 10:45', subject: 'Математика', teacher: 'Светла Иванова', room: 'Кабинет 204' },
      { hour: 4, time: '10:55 - 11:40', subject: 'Химия (Профил)', teacher: 'Елена Стоянова', room: 'STEM Лаборатория' },
      { hour: 5, time: '11:50 - 12:35', subject: 'Изобразително изкуство', teacher: 'Десислава Георгиева', room: 'Ателие' },
    ],
  };

  const bellSchedule = [
    { hour: '1. час', time: '08:00 – 08:45', break: '10 мин. междучасие' },
    { hour: '2. час', time: '08:55 – 09:40', break: '20 мин. голямо междучасие (закуска)' },
    { hour: '3. час', time: '10:00 – 10:45', break: '10 мин. междучасие' },
    { hour: '4. час', time: '10:55 – 11:40', break: '10 мин. междучасие' },
    { hour: '5. час', time: '11:50 – 12:35', break: '10 мин. междучасие' },
    { hour: '6. час', time: '12:45 – 13:30', break: '10 мин. междучасие' },
    { hour: '7. час', time: '13:40 – 14:25', break: 'Край на редовните часове' },
    { hour: 'Занималня (ЦОУД)', time: '13:30 – 17:30', break: 'Обяд, самоподготовка и отдих' },
  ];

  return (
    <div className="w-full space-y-16 pb-16">
      
      {/* 1. Page Header */}
      <section className="bg-[#1A1A1A] text-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Учебен процес & Дейности
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-tight text-[#F5F2ED]">
            Обучение и живот в <br />
            <span className="text-[#C5A059] not-italic font-normal">СУ "Васил Левски", гр. Вълчи дол</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D9D5CD] max-w-3xl leading-relaxed">
            Интерактивно седмично разписание, дневен режим, извънкласни клубове, иновативни STEM проекти и дейности по европейски програми.
          </p>
        </div>
      </section>

      {/* 2. Interactive Timetable & Bell Schedule Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Графици и разписания
            </span>
            <span className="h-px w-6 bg-[#C5A059]"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#1A1A1A]">
            Седмично разписание на часовете
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4540]">
            Изберете паралелка и ден от седмицата, за да прегледате учебната програма.
          </p>
        </div>

        {/* Timetable Interactive Box */}
        <div className="bg-[#FAF8F5] rounded-xs border border-[#1A1A1A]/10 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Class Selectors */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-widest font-bold text-[#8B8378]">
              Изберете клас:
            </div>
            <div className="flex flex-wrap gap-2">
              {classes.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3.5 py-1.5 rounded-xs text-[11px] uppercase tracking-wider font-bold transition-all ${
                    selectedClass === cls
                      ? 'bg-[#1A1A1A] text-[#F5F2ED] shadow-xs'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#E6E2D9] border border-[#1A1A1A]/10'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Day Selectors */}
          <div className="flex flex-wrap gap-2 border-b border-[#1A1A1A]/10 pb-4">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-1.5 rounded-xs text-[11px] uppercase tracking-wider font-bold transition-colors ${
                  selectedDay === day
                    ? 'bg-[#C5A059] text-[#1A1A1A]'
                    : 'bg-white text-[#4A4540] hover:bg-[#E6E2D9] border border-[#1A1A1A]/10'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm bg-white rounded-xs border border-[#1A1A1A]/10">
              <thead>
                <tr className="border-b border-[#1A1A1A]/10 text-[10px] uppercase tracking-widest text-[#8B8378] font-bold bg-[#F5F2ED]">
                  <th className="py-3 px-4">Час</th>
                  <th className="py-3 px-4">Време</th>
                  <th className="py-3 px-4">Учебен предмет</th>
                  <th className="py-3 px-4">Преподавател</th>
                  <th className="py-3 px-4">Кабинет</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/5">
                {(sampleSchedule[selectedDay] || []).map((item) => (
                  <tr key={item.hour} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-[#1A1A1A]">
                      {item.hour}. час
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-[#8B8378]">
                      {item.time}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">
                      {item.subject}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#4A4540]">
                      {item.teacher}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#E6E2D9] text-[#1A1A1A] font-semibold border border-[#1A1A1A]/10">
                        {item.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bell Schedule Grid */}
        <div className="bg-[#1A1A1A] text-[#F5F2ED] rounded-xs p-6 sm:p-8 border border-[#1A1A1A] space-y-4">
          <div className="flex items-center gap-2 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest">
            <Clock className="w-4 h-4" />
            <span>Дневен режим на часовете (Звънци)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bellSchedule.map((b, i) => (
              <div key={i} className="p-3.5 rounded-xs bg-[#262422] border border-[#333] text-xs space-y-1">
                <div className="font-serif font-bold text-[#C5A059]">{b.hour}</div>
                <div className="font-mono text-[#F5F2ED]">{b.time}</div>
                <div className="text-[11px] text-[#8B8378]">{b.break}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Extracurricular Clubs & Interests */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Извънкласни дейности
            </span>
            <span className="h-px w-6 bg-[#C5A059]"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#1A1A1A]">
            Клубове по интереси и таланти
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4540]">
            Всеки ученик може да развива своето хоби, спортни и академични страсти.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.clubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-xs overflow-hidden border border-[#1A1A1A]/10 shadow-xs hover:border-[#1A1A1A]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={club.imageUrl}
                    alt={club.name}
                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1A1A1A]/90 text-[#C5A059] text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-xs backdrop-blur-xs">
                    {club.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">{club.name}</h3>
                  <p className="text-xs text-[#4A4540] leading-relaxed">{club.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#1A1A1A]/5 space-y-1.5 text-xs text-[#8B8378]">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#1A1A1A]">Ръководител:</span>
                  <span className="text-[#4A4540]">{club.leader}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#1A1A1A]">Възрастова група:</span>
                  <span className="text-[#4A4540]">{club.targetGrades}</span>
                </div>
                <div className="flex items-center justify-between text-[#1A1A1A] font-semibold pt-1">
                  <span>График:</span>
                  <span className="text-[#C5A059] font-bold">{club.schedule}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. National Programs & EU Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Иновации & Развитие
            </span>
            <span className="h-px w-6 bg-[#C5A059]"></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif italic text-[#1A1A1A]">
            Проекти и национални програми
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4540]">
            Активно участие в проекти на МОН, НПВУ и Европейския съюз (Erasmus+).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-xs p-6 sm:p-8 border border-[#1A1A1A]/10 shadow-xs hover:border-[#1A1A1A]/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] bg-[#E6E2D9] px-2.5 py-1 rounded-xs">
                    {proj.funder}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#8B8378] bg-[#FAF8F5] px-2.5 py-0.5 rounded-xs border border-[#1A1A1A]/10">
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">{proj.title}</h3>
                
                <p className="text-xs text-[#4A4540] leading-relaxed">
                  {proj.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]">Цели на проекта:</div>
                  <ul className="space-y-1 text-xs text-[#4A4540]">
                    {proj.goals.map((g, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0 mt-1.5"></span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs text-[#8B8378]">
                <span>Период: <strong className="text-[#1A1A1A]">{proj.duration}</strong></span>
                {proj.budget && <span>Бюджет: <strong className="text-[#1A1A1A]">{proj.budget}</strong></span>}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
