'use client';

import { useState } from 'react';

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    // Native share (телефон/модерен браузър) — отваря Facebook, Viber, имейл и т.н.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // ако откаже — минаваме към копиране
      }
    }
    // Fallback — копира линка
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // нищо
    }
  };

  const fbShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=500');
  };

  return (
    <div className="share-box">
      <span className="share-label">Споделете:</span>
      <div className="share-btns">
        <button onClick={fbShare} className="share-btn fb" aria-label="Сподели във Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.68 4.53-4.68 1.31 0 2.68.23 2.68.23v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
          Facebook
        </button>
        <button onClick={share} className="share-btn native" aria-label="Сподели">
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              Копирано!
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5"/></svg>
              Сподели
            </>
          )}
        </button>
      </div>
    </div>
  );
}
