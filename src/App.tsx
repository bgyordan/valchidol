import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CMSProvider, useCMS } from './cms/CMSContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuickAccessBar } from './components/QuickAccessBar';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { EducationPage } from './pages/EducationPage';
import { NewsPage } from './pages/NewsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { CMSDashboardPage } from './pages/CMSDashboardPage';

const AppContent: React.FC = () => {
  const { currentPage, toast, setToast } = useCMS();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Global keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'admissions':
        return <AdmissionsPage />;
      case 'education':
        return <EducationPage />;
      case 'news':
        return <NewsPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <CMSDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-[#F5F2ED]">
      
      {/* Quick Access Utility Ribbon (hidden on Admin CMS view for focus) */}
      {currentPage !== 'admin' && <QuickAccessBar />}

      {/* Main Institution Header */}
      {currentPage !== 'admin' && (
        <Header onOpenSearch={() => setIsSearchOpen(true)} />
      )}

      {/* Page Content with Framer Motion Transition */}
      <main className="flex-1 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Institutional Footer */}
      {currentPage !== 'admin' && <Footer />}

      {/* Global Search Dialog Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Toast Notification for Headless CMS events & submissions */}
      <Toast message={toast} onClose={() => setToast(null)} />

    </div>
  );
};

export default function App() {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  );
}
