import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  SlidersHorizontal, 
  Newspaper, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Bell, 
  Inbox, 
  FileCheck2, 
  Code, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  Download, 
  Upload, 
  Eye, 
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';
import { NewsItem, DocumentItem, Teacher, GalleryAlbum, Announcement, AdmissionApplication } from '../types';

type CMSTab = 
  | 'overview' 
  | 'news' 
  | 'documents' 
  | 'gallery' 
  | 'teachers' 
  | 'announcements' 
  | 'applications' 
  | 'messages' 
  | 'api_explorer';

export const CMSDashboardPage: React.FC = () => {
  const {
    data,
    setCurrentPage,
    addNews,
    updateNews,
    deleteNews,
    addDocument,
    deleteDocument,
    addTeacher,
    deleteTeacher,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    updateApplicationStatus,
    deleteApplication,
    deleteMessage,
    markMessageRead,
    exportJSON,
    importJSON,
    resetToDefaults,
    setToast,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<CMSTab>('overview');

  // Modal / Form states
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsItem['category']>('Новини');
  const [newsAuthor, setNewsAuthor] = useState('Администратор');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80');
  const [newsTags, setNewsTags] = useState('Училище, Новини');

  // Add Document Modal
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentItem['category']>('Учебна дейност');
  const [docType, setDocType] = useState<DocumentItem['fileType']>('PDF');
  const [docSize, setDocSize] = useState('1.5 MB');
  const [docDesc, setDocDesc] = useState('');

  // Add Teacher Modal
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherRole, setTeacherRole] = useState('');
  const [teacherStage, setTeacherStage] = useState<Teacher['stage']>('Прогимназиален етап (5-7 кл.)');
  const [teacherSubjects, setTeacherSubjects] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhoto, setTeacherPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');

  // Add Announcement
  const [newAnnText, setNewAnnText] = useState('');
  const [newAnnType, setNewAnnType] = useState<Announcement['type']>('urgent');

  // JSON Import/Export state
  const [jsonInput, setJsonInput] = useState('');
  const [activeApiEndpoint, setActiveApiEndpoint] = useState<string>('all');

  // Handlers
  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;

    addNews({
      title: newsTitle,
      excerpt: newsExcerpt || newsContent.slice(0, 120) + '...',
      content: newsContent,
      category: newsCategory,
      author: newsAuthor,
      date: new Date().toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' }),
      imageUrl: newsImage,
      readTime: '3 мин.',
      tags: newsTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewsTitle('');
    setNewsExcerpt('');
    setNewsContent('');
    setShowAddNewsModal(false);
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    addDocument({
      title: docTitle,
      category: docCategory,
      fileType: docType,
      fileSize: docSize,
      uploadDate: new Date().toLocaleDateString('bg-BG'),
      description: docDesc || 'Официален училищен документ.',
    });

    setDocTitle('');
    setDocDesc('');
    setShowAddDocModal(false);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;

    addTeacher({
      name: teacherName,
      role: teacherRole,
      stage: teacherStage,
      subjects: teacherSubjects.split(',').map((s) => s.trim()).filter(Boolean),
      email: teacherEmail || 'info-400112@edu.mon.bg',
      qualification: 'Висше педагогическо образование.',
      photoUrl: teacherPhoto,
      consultationHours: 'Сряда: 14:00 - 15:00 ч.',
    });

    setTeacherName('');
    setTeacherRole('');
    setTeacherSubjects('');
    setTeacherEmail('');
    setShowAddTeacherModal(false);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnText.trim()) return;
    addAnnouncement({
      text: newAnnText,
      type: newAnnType,
      active: true,
      linkText: 'Виж повече',
      targetPage: 'news',
    });
    setNewAnnText('');
  };

  const handleCopyAPI = (content: string) => {
    navigator.clipboard.writeText(content);
    setToast('JSON отговорът беше копиран в клипборда!');
  };

  const handleImportJSON = () => {
    if (!jsonInput.trim()) return;
    const success = importJSON(jsonInput);
    if (success) {
      setJsonInput('');
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 pb-20">
      
      {/* 1. CMS Top Navigation Bar */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white leading-tight">Headless CMS Контролен панел</h1>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  v1.2 Live
                </span>
              </div>
              <p className="text-xs text-slate-400">СУ "Васил Левски" гр. Вълчи дол</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('home')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-bold transition-colors flex items-center gap-1.5 border border-blue-700"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Преглед на сайта</span>
            </button>

            <button
              onClick={resetToDefaults}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
              title="Възстанови началните данни"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Нулиране</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CMS Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            {[
              { tab: 'overview' as CMSTab, label: 'Общ преглед', icon: SlidersHorizontal, count: null },
              { tab: 'news' as CMSTab, label: 'Новини & Статии', icon: Newspaper, count: data.news.length },
              { tab: 'documents' as CMSTab, label: 'Документи & Бланки', icon: FileText, count: data.documents.length },
              { tab: 'applications' as CMSTab, label: 'Заявления за прием', icon: FileCheck2, count: data.admissionApplications.length, highlight: true },
              { tab: 'messages' as CMSTab, label: 'Съобщения от контакт', icon: Inbox, count: data.contactMessages.length },
              { tab: 'teachers' as CMSTab, label: 'Преподаватели', icon: Users, count: data.teachers.length },
              { tab: 'gallery' as CMSTab, label: 'Фотоалбуми', icon: ImageIcon, count: data.galleryAlbums.length },
              { tab: 'announcements' as CMSTab, label: 'Съобщения в банера', icon: Bell, count: data.announcements.length },
              { tab: 'api_explorer' as CMSTab, label: 'Headless API & JSON', icon: Code, count: null },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : item.highlight && item.count > 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Tab Content Area */}
          <div className="lg:col-span-9 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            
            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Табло за управление на съдържанието</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Управлявайте лесно всички модули на уеб портала без нужда от програмиране. Всички промени се синхронизират незабавно с публичния интерфейс.
                  </p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Публикувани новини', value: data.news.length, icon: Newspaper, color: 'text-blue-400' },
                    { label: 'Официални документи', value: data.documents.length, icon: FileText, color: 'text-amber-400' },
                    { label: 'Заявления за прием', value: data.admissionApplications.length, icon: FileCheck2, color: 'text-emerald-400' },
                    { label: 'Вписани учители', value: data.teachers.length, icon: Users, color: 'text-purple-400' },
                  ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <Icon className={`w-5 h-5 ${card.color}`} />
                        <div className="text-2xl font-black text-white">{card.value}</div>
                        <div className="text-[11px] text-slate-400">{card.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Applications Preview */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      <span>Последно получени заявления за прием</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('applications')}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      Преглед на всички ({data.admissionApplications.length})
                    </button>
                  </div>

                  {data.admissionApplications.length === 0 ? (
                    <p className="text-xs text-slate-500">Няма нови заявления за прием.</p>
                  ) : (
                    <div className="space-y-2">
                      {data.admissionApplications.slice(0, 3).map((app) => (
                        <div
                          key={app.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">{app.studentName}</div>
                            <div className="text-[11px] text-slate-400">
                              Клас: {app.gradeApplying} • Родител: {app.parentName} ({app.parentPhone})
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Headless API Architecture Info */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Headless CMS Архитектура & REST API</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Порталът на СУ "Васил Левски" е проектиран с отделен слой за данни (Headless Architecture). Можете да експортирате цялото съдържание като валиден JSON за интеграция с външни мобилни приложения, информационни екрани в коридорите на училището или външни бази данни.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: News Management */}
            {activeTab === 'news' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Управление на новини и събития</h2>
                    <p className="text-xs text-slate-400">Добавяйте, редактирайте и изтривайте училищни публикации.</p>
                  </div>

                  <button
                    onClick={() => setShowAddNewsModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добави новина</span>
                  </button>
                </div>

                {/* News Table */}
                <div className="space-y-2">
                  {data.news.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700"
                        />
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-200">
                              {item.category}
                            </span>
                            <span className="text-[11px] text-slate-400">{item.date}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteNews(item.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition-colors shrink-0"
                        title="Изтрий новина"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Documents Management */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Управление на документи и бланки</h2>
                    <p className="text-xs text-slate-400">Качване на училищни планове, правилници и бланки за родители.</p>
                  </div>

                  <button
                    onClick={() => setShowAddDocModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добави документ</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {data.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            {doc.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {doc.fileType} • {doc.fileSize} • {doc.uploadDate}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {doc.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">{doc.description}</p>
                      </div>

                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition-colors shrink-0"
                        title="Изтрий документ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Admission Applications */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Входящи заявления за кандидатстване и прием</h2>
                  <p className="text-xs text-slate-400">Преглед и промяна на статусите на подадените от родители заявления.</p>
                </div>

                {data.admissionApplications.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                    Няма получени заявления за прием.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.admissionApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                          <div className="font-bold text-sm text-amber-400">
                            {app.studentName} ({app.gradeApplying})
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">
                            Подадено на: {app.submittedAt}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                          <div><strong>Родител:</strong> {app.parentName}</div>
                          <div><strong>Телефон:</strong> {app.parentPhone}</div>
                          <div><strong>Имейл:</strong> {app.parentEmail || 'Не е посочен'}</div>
                          <div><strong>Адрес:</strong> {app.address || 'Не е посочен'}</div>
                          {app.notes && (
                            <div className="sm:col-span-2 text-slate-400">
                              <strong>Бележки:</strong> {app.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Статус:</span>
                            <select
                              value={app.status}
                              onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                              className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs outline-hidden"
                            >
                              <option value="Ново">Ново</option>
                              <option value="В обработка">В обработка</option>
                              <option value="Одобрено">Одобрено</option>
                              <option value="Архивирано">Архивирано</option>
                            </select>
                          </div>

                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Изтрий</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Contact Messages */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Входящи съобщения от контактната форма</h2>
                  <p className="text-xs text-slate-400">Запитвания от граждани, родители и партньори.</p>
                </div>

                {data.contactMessages.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                    Няма получени съобщения.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.contactMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="font-bold text-white">
                            {msg.name} ({msg.email})
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">{msg.date}</div>
                        </div>
                        <div className="font-semibold text-amber-400">{msg.subject}</div>
                        <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                          {msg.message}
                        </p>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Изтрий</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Teachers */}
            {activeTab === 'teachers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Учителски състав & Ръководство</h2>
                    <p className="text-xs text-slate-400">Управление на профилите на преподавателите.</p>
                  </div>

                  <button
                    onClick={() => setShowAddTeacherModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добави учител</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.teachers.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={t.photoUrl}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-700"
                        />
                        <div className="overflow-hidden">
                          <div className="font-bold text-white truncate">{t.name}</div>
                          <div className="text-amber-400 text-[11px] truncate">{t.role}</div>
                          <div className="text-slate-400 text-[10px] truncate">{t.stage}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTeacher(t.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Announcements */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Съобщения в горната информационна лента</h2>
                  <p className="text-xs text-slate-400">Бързи банери за спешни обявления, грипни ваканции или прием.</p>
                </div>

                <form onSubmit={handleAddAnnouncement} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-200">Добави ново съобщение:</div>
                  <input
                    type="text"
                    required
                    value={newAnnText}
                    onChange={(e) => setNewAnnText(e.target.value)}
                    placeholder="напр. На 15 септември учебният ден започва в 09:00 ч."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-hidden"
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={newAnnType}
                      onChange={(e) => setNewAnnType(e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs"
                    >
                      <option value="urgent">Спешно (Червено/Жълто)</option>
                      <option value="info">Информативно (Синьо)</option>
                      <option value="holiday">Празнично</option>
                    </select>

                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                    >
                      Публикувай в лентата
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {data.announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${ann.active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <span className="truncate text-slate-200">{ann.text}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateAnnouncement(ann.id, { active: !ann.active })}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ann.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {ann.active ? 'Активно' : 'Скрито'}
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: API Explorer & JSON */}
            {activeTab === 'api_explorer' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Headless CMS API & JSON Експорт</h2>
                  <p className="text-xs text-slate-400">
                    Интегрирайте съдържанието на сайта във външни платформи чрез REST API симулация и JSON схеми.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'GET /api/v1/content (Всички)' },
                    { key: 'news', label: 'GET /api/v1/news' },
                    { key: 'documents', label: 'GET /api/v1/documents' },
                    { key: 'teachers', label: 'GET /api/v1/teachers' },
                    { key: 'profiles', label: 'GET /api/v1/admissions' },
                  ].map((ep) => (
                    <button
                      key={ep.key}
                      onClick={() => setActiveApiEndpoint(ep.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        activeApiEndpoint === ep.key
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ep.label}
                    </button>
                  ))}
                </div>

                {/* Code Window */}
                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs overflow-hidden">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
                    <span className="text-emerald-400">Status: 200 OK • application/json</span>
                    <button
                      onClick={() => {
                        const content = activeApiEndpoint === 'all'
                          ? exportJSON()
                          : JSON.stringify((data as any)[activeApiEndpoint] || {}, null, 2);
                        handleCopyAPI(content);
                      }}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1"
                    >
                      <span>Копирай JSON</span>
                    </button>
                  </div>

                  <pre className="max-h-72 overflow-y-auto text-slate-300 text-[11px] leading-relaxed">
                    {activeApiEndpoint === 'all'
                      ? exportJSON()
                      : JSON.stringify((data as any)[activeApiEndpoint] || {}, null, 2)}
                  </pre>
                </div>

                {/* Import JSON Section */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Импортиране на JSON резервно копие</span>
                  </h3>
                  <textarea
                    rows={3}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Поставете валиден JSON тук за пълен импорт..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white outline-hidden"
                  />
                  <button
                    onClick={handleImportJSON}
                    className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-colors"
                  >
                    Зареди данните в CMS
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Add News Modal */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs text-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Публикуване на нова статия</h3>
              <button onClick={() => setShowAddNewsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-white">Заглавие *</label>
                <input
                  type="text"
                  required
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Заглавие на публикацията"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-white">Категория</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                  >
                    <option value="Новини">Новини</option>
                    <option value="Събития">Събития</option>
                    <option value="Постижения">Постижения</option>
                    <option value="Обявления">Обявления</option>
                    <option value="Проекти">Проекти</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-white">Автор</label>
                  <input
                    type="text"
                    value={newsAuthor}
                    onChange={(e) => setNewsAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Кратко резюме</label>
                <input
                  type="text"
                  value={newsExcerpt}
                  onChange={(e) => setNewsExcerpt(e.target.value)}
                  placeholder="Кратко изречение за водещия текст"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Пълно съдържание *</label>
                <textarea
                  rows={4}
                  required
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Текст на статията..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">URL адрес на снимка</label>
                <input
                  type="text"
                  value={newsImage}
                  onChange={(e) => setNewsImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Отказ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Публикувай
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. Add Document Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs text-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Добавяне на документ</h3>
              <button onClick={() => setShowAddDocModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-white">Заглавие на документа *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="напр. Училищен учебен план 2026/2027"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-white">Категория</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                  >
                    <option value="Учебна дейност">Учебна дейност</option>
                    <option value="Правилници">Правилници</option>
                    <option value="Бюджет и финанси">Бюджет и финанси</option>
                    <option value="Обществени поръчки">Обществени поръчки</option>
                    <option value="Бланки и заявления">Бланки и заявления</option>
                    <option value="Безопасност">Безопасност</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-white">Тип файл</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Описание</label>
                <input
                  type="text"
                  value={docDesc}
                  onChange={(e) => setDocDesc(e.target.value)}
                  placeholder="Кратко описание на съдържанието"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Отказ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Запази
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3. Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs text-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Вписване на преподавател</h3>
              <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-white">Име и фамилия *</label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="напр. Мария Петрова"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Длъжност / Позиция</label>
                <input
                  type="text"
                  value={teacherRole}
                  onChange={(e) => setTeacherRole(e.target.value)}
                  placeholder="Старши учител по английски език"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Етап на обучение</label>
                <select
                  value={teacherStage}
                  onChange={(e) => setTeacherStage(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                >
                  <option value="Ръководство">Ръководство</option>
                  <option value="Начален етап (1-4 кл.)">Начален етап (1-4 кл.)</option>
                  <option value="Прогимназиален етап (5-7 кл.)">Прогимназиален етап (5-7 кл.)</option>
                  <option value="Гимназиален етап (8-12 кл.)">Гимназиален етап (8-12 кл.)</option>
                  <option value="Ресурсни специалисти">Ресурсни специалисти</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white">Преподавани предмети (разделени със запетая)</label>
                <input
                  type="text"
                  value={teacherSubjects}
                  onChange={(e) => setTeacherSubjects(e.target.value)}
                  placeholder="Английски език, Немски език"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Отказ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Добави
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
