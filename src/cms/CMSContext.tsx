import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CMSContentData, 
  NewsItem, 
  DocumentItem, 
  GalleryAlbum, 
  Teacher, 
  AdmissionProfile, 
  SchoolClub, 
  SchoolProject, 
  Announcement, 
  ContactMessage, 
  AdmissionApplication,
  PageType 
} from '../types';
import { INITIAL_CMS_DATA } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'souvalchidol_cms_v1';

interface CMSContextType {
  data: CMSContentData;
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  selectedNewsId: string | null;
  setSelectedNewsId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // CMS CRUD Actions
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, news: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;
  updateDocument: (id: string, doc: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;

  addGalleryAlbum: (album: Omit<GalleryAlbum, 'id'>) => void;
  updateGalleryAlbum: (id: string, album: Partial<GalleryAlbum>) => void;
  deleteGalleryAlbum: (id: string) => void;

  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  updateAnnouncement: (id: string, ann: Partial<Announcement>) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;

  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  submitAdmissionApplication: (app: Omit<AdmissionApplication, 'id' | 'submittedAt' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: AdmissionApplication['status']) => void;
  deleteApplication: (id: string) => void;

  // Headless API export / reset
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
  resetToDefaults: () => void;
  toastMessage: string | null;
  setToast: (msg: string | null) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CMSContentData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_CMS_DATA;
  });

  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage error fallback
    }
  }, [data]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // News Actions
  const addNews = (news: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = {
      ...news,
      id: 'news-' + Date.now(),
    };
    setData(prev => ({ ...prev, news: [newItem, ...prev.news] }));
    showToast('Новината беше успешно публикувана!');
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    setData(prev => ({
      ...prev,
      news: prev.news.map(item => item.id === id ? { ...item, ...updated } : item),
    }));
    showToast('Новината беше обновена!');
  };

  const deleteNews = (id: string) => {
    setData(prev => ({
      ...prev,
      news: prev.news.filter(item => item.id !== id),
    }));
    showToast('Новината беше изтрита.');
  };

  // Document Actions
  const addDocument = (doc: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: 'doc-' + Date.now(),
    };
    setData(prev => ({ ...prev, documents: [newDoc, ...prev.documents] }));
    showToast('Документът беше добавен успешно!');
  };

  const updateDocument = (id: string, updated: Partial<DocumentItem>) => {
    setData(prev => ({
      ...prev,
      documents: prev.documents.map(item => item.id === id ? { ...item, ...updated } : item),
    }));
    showToast('Документът беше обновен!');
  };

  const deleteDocument = (id: string) => {
    setData(prev => ({
      ...prev,
      documents: prev.documents.filter(item => item.id !== id),
    }));
    showToast('Документът беше изтрит.');
  };

  // Gallery Actions
  const addGalleryAlbum = (album: Omit<GalleryAlbum, 'id'>) => {
    const newAlbum: GalleryAlbum = {
      ...album,
      id: 'alb-' + Date.now(),
    };
    setData(prev => ({ ...prev, galleryAlbums: [newAlbum, ...prev.galleryAlbums] }));
    showToast('Албумът беше създаден успешно!');
  };

  const updateGalleryAlbum = (id: string, updated: Partial<GalleryAlbum>) => {
    setData(prev => ({
      ...prev,
      galleryAlbums: prev.galleryAlbums.map(item => item.id === id ? { ...item, ...updated } : item),
    }));
    showToast('Албумът беше обновен!');
  };

  const deleteGalleryAlbum = (id: string) => {
    setData(prev => ({
      ...prev,
      galleryAlbums: prev.galleryAlbums.filter(item => item.id !== id),
    }));
    showToast('Албумът беше премахнат.');
  };

  // Teacher Actions
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: 't-' + Date.now(),
    };
    setData(prev => ({ ...prev, teachers: [...prev.teachers, newTeacher] }));
    showToast('Преподавателят беше добавен в указателя!');
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setData(prev => ({
      ...prev,
      teachers: prev.teachers.map(item => item.id === id ? { ...item, ...updated } : item),
    }));
    showToast('Данните за преподавателя бяха обновени!');
  };

  const deleteTeacher = (id: string) => {
    setData(prev => ({
      ...prev,
      teachers: prev.teachers.filter(item => item.id !== id),
    }));
    showToast('Преподавателят беше премахнат.');
  };

  // Announcement Actions
  const updateAnnouncement = (id: string, ann: Partial<Announcement>) => {
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.map(item => item.id === id ? { ...item, ...ann } : item),
    }));
    showToast('Съобщението беше редактирано!');
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: 'ann-' + Date.now(),
    };
    setData(prev => ({ ...prev, announcements: [newAnn, ...prev.announcements] }));
    showToast('Новото съобщение беше добавено в лентата!');
  };

  const deleteAnnouncement = (id: string) => {
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.filter(item => item.id !== id),
    }));
    showToast('Съобщението беше изтрито.');
  };

  // Contact Messages
  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('bg-BG')} ${now.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}`;
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: formattedDate,
      isRead: false,
    };
    setData(prev => ({ ...prev, contactMessages: [newMsg, ...prev.contactMessages] }));
    showToast('Благодарим! Вашето съобщение беше изпратено успешно до канцеларията.');
  };

  const markMessageRead = (id: string) => {
    setData(prev => ({
      ...prev,
      contactMessages: prev.contactMessages.map(m => m.id === id ? { ...m, isRead: true } : m),
    }));
  };

  const deleteMessage = (id: string) => {
    setData(prev => ({
      ...prev,
      contactMessages: prev.contactMessages.filter(m => m.id !== id),
    }));
    showToast('Съобщението беше изтрито.');
  };

  // Admission Applications
  const submitAdmissionApplication = (app: Omit<AdmissionApplication, 'id' | 'submittedAt' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('bg-BG')} ${now.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}`;
    const newApp: AdmissionApplication = {
      ...app,
      id: 'app-' + Date.now(),
      submittedAt: formattedDate,
      status: 'Ново',
    };
    setData(prev => ({ ...prev, admissionApplications: [newApp, ...prev.admissionApplications] }));
    showToast('Заявлението за кандидатстване беше подадено успешно!');
  };

  const updateApplicationStatus = (id: string, status: AdmissionApplication['status']) => {
    setData(prev => ({
      ...prev,
      admissionApplications: prev.admissionApplications.map(a => a.id === id ? { ...a, status } : a),
    }));
    showToast(`Статусът беше променен на "${status}"!`);
  };

  const deleteApplication = (id: string) => {
    setData(prev => ({
      ...prev,
      admissionApplications: prev.admissionApplications.filter(a => a.id !== id),
    }));
    showToast('Заявлението беше изтрито.');
  };

  // Export / Import / Reset
  const exportJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.news && parsed.documents) {
        setData(parsed);
        showToast('Данните бяха успешно импортирани в Headless CMS!');
        return true;
      }
    } catch {
      showToast('Грешка при импортиране на JSON: Невалиден формат.');
    }
    return false;
  };

  const resetToDefaults = () => {
    setData(INITIAL_CMS_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('Базата данни беше възстановена до първоначалните стойности.');
  };

  return (
    <CMSContext.Provider
      value={{
        data,
        currentPage,
        setCurrentPage,
        selectedNewsId,
        setSelectedNewsId,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        addNews,
        updateNews,
        deleteNews,
        addDocument,
        updateDocument,
        deleteDocument,
        addGalleryAlbum,
        updateGalleryAlbum,
        deleteGalleryAlbum,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        updateAnnouncement,
        addAnnouncement,
        deleteAnnouncement,
        submitContactMessage,
        markMessageRead,
        deleteMessage,
        submitAdmissionApplication,
        updateApplicationStatus,
        deleteApplication,
        exportJSON,
        importJSON,
        resetToDefaults,
        toastMessage,
        setToast: showToast,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
