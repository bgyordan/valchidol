import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Search, 
  FileCheck, 
  Calendar, 
  HardDrive, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye
} from 'lucide-react';
import { useCMS } from '../cms/CMSContext';
import { DocumentItem } from '../types';

export const DocumentsPage: React.FC = () => {
  const { data } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('Всички');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const categories = [
    'Всички',
    'Учебна дейност',
    'Правилници',
    'Бюджет и финанси',
    'Обществени поръчки',
    'Бланки и заявления',
    'Безопасност',
  ];

  const filteredDocuments = data.documents.filter((doc) => {
    const matchesCat = selectedCategory === 'Всички' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (doc: DocumentItem) => {
    // Generate simple dummy blob or mock trigger
    alert(`Изтегляне на официален документ: "${doc.title}" (${doc.fileType}, ${doc.fileSize})`);
  };

  return (
    <div className="w-full space-y-12 pb-16">
      
      {/* 1. Header Banner */}
      <section className="bg-[#1A1A1A] text-[#F5F2ED] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#C5A059]"></span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B8378]">
              Официален архив & Прозрачност
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic tracking-tight text-[#F5F2ED]">
            Училищни документи & <br />
            <span className="text-[#C5A059] not-italic font-normal">Нормативна уредба</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D9D5CD] max-w-3xl leading-relaxed">
            Учебни планове, правилници за вътрешния ред, финансови отчети, бланки за заявления и нормативни актове на СУ „Васил Левски“, гр. Вълчи дол.
          </p>
        </div>
      </section>

      {/* 2. Filter & Search Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xs border border-[#1A1A1A]/10 shadow-xs">
          
          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xs text-[11px] uppercase tracking-wider font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1A1A1A] text-[#F5F2ED] shadow-xs'
                    : 'bg-[#FAF8F5] text-[#4A4540] hover:bg-[#E6E2D9] border border-[#1A1A1A]/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8B8378] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Търси документ по заглавие..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xs border border-[#1A1A1A]/10 focus:border-[#1A1A1A] outline-hidden bg-[#FAF8F5] focus:bg-white text-[#1A1A1A]"
            />
          </div>

        </div>
      </section>

      {/* 3. Documents List Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xs border border-[#1A1A1A]/10 p-8">
            <FileText className="w-12 h-12 text-[#8B8378] mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">Няма намерени документи</h3>
            <p className="text-xs text-[#4A4540] mt-1">
              Няма намерени документи в тази категория или с посочената ключова дума.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xs p-6 border border-[#1A1A1A]/10 shadow-xs hover:border-[#1A1A1A]/30 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A1A1A] bg-[#E6E2D9] px-2.5 py-1 rounded-xs">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#FAF8F5] text-[#8B8378] border border-[#1A1A1A]/10">
                      {doc.fileType} • {doc.fileSize}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A] leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-[#4A4540] leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1A1A1A]/5 space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8B8378]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#C5A059]" />
                      <span>Качен на: {doc.uploadDate}</span>
                    </div>
                    <span>Официален образец</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="py-2 px-3 rounded-xs bg-[#FAF8F5] hover:bg-[#E6E2D9] text-[#1A1A1A] text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 border border-[#1A1A1A]/10"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#8B8378]" />
                      <span>Преглед</span>
                    </button>

                    <button
                      onClick={() => handleDownload(doc)}
                      className="py-2 px-3 rounded-xs bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Изтегли</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Transparency & Public Information Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] text-[#F5F2ED] rounded-xs p-8 border border-[#1A1A1A] space-y-4">
          <div className="flex items-center gap-2 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Институционална прозрачност & ЗДОИ</span>
          </div>

          <h3 className="text-xl font-serif italic text-[#F5F2ED]">
            Достъп до обществена информация и финансова отчетност
          </h3>

          <p className="text-xs sm:text-sm text-[#D9D5CD] leading-relaxed max-w-4xl">
            СУ „Васил Левски“, гр. Вълчи дол осигурява пълен публичен достъп до своите тримесечни финансови отчети, изпълнение на делегирания бюджет, протоколи от проведени обществени поръчки и решения на Педагогическия съвет. Заявления по Закона за достъп до обществена информация (ЗДОИ) могат да се подават в канцеларията или на имейл: info-400112@edu.mon.bg.
          </p>
        </div>
      </section>

      {/* 5. Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/80 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FAF8F5] rounded-xs shadow-2xl border border-[#1A1A1A]/20 max-w-xl w-full p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xs bg-[#1A1A1A] text-[#C5A059]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8B8378] bg-[#E6E2D9] px-2.5 py-0.5 rounded-xs">
                    {previewDoc.category}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mt-1">
                    {previewDoc.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xs bg-white border border-[#1A1A1A]/10 space-y-2 text-xs text-[#4A4540]">
              <div><strong>Описание:</strong> {previewDoc.description}</div>
              <div><strong>Тип файл:</strong> {previewDoc.fileType} (Официален цифров формат)</div>
              <div><strong>Размер:</strong> {previewDoc.fileSize}</div>
              <div><strong>Дата на качване:</strong> {previewDoc.uploadDate}</div>
              <div><strong>Издател:</strong> СУ "Васил Левски", гр. Вълчи дол</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2.5 rounded-xs border border-[#1A1A1A]/20 text-[#4A4540] text-[10px] uppercase tracking-wider font-semibold hover:bg-white transition-colors"
              >
                Затвори
              </button>
              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-5 py-2.5 rounded-xs bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#1A1A1A] text-[#F5F2ED] text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4 text-[#C5A059]" />
                <span>Изтегли файла</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
