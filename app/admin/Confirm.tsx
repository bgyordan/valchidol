'use client';

// Бутон, който пита „Сигурни ли сте?“ преди да изпрати формата (за триене).
export default function Confirm({ children, text = 'Сигурни ли сте?', className = 'adm-btn danger' }: { children: React.ReactNode; text?: string; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!confirm(text)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
