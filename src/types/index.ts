export type PageType = 
  | 'home' 
  | 'about' 
  | 'admissions' 
  | 'education' 
  | 'news' 
  | 'documents' 
  | 'gallery' 
  | 'contact' 
  | 'cms';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Новини' | 'Събития' | 'Постижения' | 'Обявления' | 'Проекти';
  author: string;
  date: string;
  imageUrl: string;
  readTime: string;
  isPinned?: boolean;
  tags: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Учебна дейност' | 'Правилници' | 'Бюджет и финанси' | 'Обществени поръчки' | 'Бланки и заявления' | 'Безопасност';
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  uploadDate: string;
  downloadUrl?: string;
  description: string;
}

export interface GalleryImage {
  url: string;
  caption: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  category: 'Празници' | 'STEM и Наука' | 'Спорт' | 'Изкуство' | 'Екскурзии';
  date: string;
  coverImage: string;
  images: GalleryImage[];
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  stage: 'Ръководство' | 'Начален етап (1-4 кл.)' | 'Прогимназиален етап (5-7 кл.)' | 'Гимназиален етап (8-12 кл.)' | 'Ресурсни специалисти';
  subjects: string[];
  email: string;
  phone?: string;
  qualification: string;
  photoUrl: string;
  consultationHours?: string;
}

export interface AdmissionProfile {
  id: string;
  gradeLevel: '1. клас' | '5. клас' | '8. клас';
  title: string;
  shortDesc: string;
  description: string;
  capacity: string;
  examSubjects: string[];
  highlights: string[];
  careerPaths: string[];
  badge: string;
}

export interface ScheduleItem {
  hour: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface ClassSchedule {
  id: string;
  className: string; // e.g. '8А', '9А', '10А'
  shift: 'Първа смяна' | 'Втора смяна';
  days: {
    [dayName: string]: ScheduleItem[];
  };
}

export interface SchoolClub {
  id: string;
  name: string;
  category: 'Наука и технологии' | 'Изкуства' | 'Спорт' | 'Гражданско образование';
  leader: string;
  targetGrades: string;
  description: string;
  schedule: string;
  imageUrl: string;
}

export interface SchoolProject {
  id: string;
  title: string;
  funder: string;
  duration: string;
  budget?: string;
  description: string;
  goals: string[];
  status: 'Активен' | 'Приключил' | 'Предстоящ';
  imageUrl: string;
}

export interface Announcement {
  id: string;
  text: string;
  type: 'urgent' | 'info' | 'holiday';
  linkText?: string;
  targetPage?: PageType;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  egnOrBirthDate: string;
  gradeApplying: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  specialNeeds?: boolean;
  notes?: string;
  submittedAt: string;
  status: 'Ново' | 'В обработка' | 'Одобрено' | 'Архивирано';
}

export interface CMSContentData {
  announcements: Announcement[];
  news: NewsItem[];
  documents: DocumentItem[];
  galleryAlbums: GalleryAlbum[];
  teachers: Teacher[];
  profiles: AdmissionProfile[];
  clubs: SchoolClub[];
  projects: SchoolProject[];
  contactMessages: ContactMessage[];
  admissionApplications: AdmissionApplication[];
}
