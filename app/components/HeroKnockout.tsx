'use client';

import { useEffect } from 'react';

// Мотото „минава“ през снимките в херото: там, където снимка застъпва надписа, буквите се виждат бели.
// Във всяка снимка се слага бяло копие на мотото, наместено точно върху оригинала; снимката го изрязва по своя контур.
// Копието е само украса (aria-hidden), не е заглавие. На телефон снимките не застъпват мотото и копията са скрити.
export default function HeroKnockout() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hx');
    const title = hero?.querySelector<HTMLElement>('.hx-title');
    if (!hero || !title) return;
    const photos = Array.from(hero.querySelectorAll<HTMLElement>('.pt-ph'));

    const copies = photos.map((ph) => {
      const ko = document.createElement('div');
      ko.className = 'pt-ko';
      ko.setAttribute('aria-hidden', 'true');
      ko.innerHTML = `<div class="hx-title">${title.innerHTML}</div>`;
      ph.appendChild(ko);
      return ko;
    });

    const place = () => {
      const t = title.getBoundingClientRect();
      photos.forEach((ph, i) => {
        const r = ph.getBoundingClientRect();
        const ko = copies[i];
        ko.style.left = `${t.left - r.left - ph.clientLeft}px`;
        ko.style.top = `${t.top - r.top - ph.clientTop}px`;
        ko.style.width = `${t.width}px`;
      });
    };

    // наместване след като снимките и мотото са се появили, после при всяка промяна на размера
    const timer = window.setTimeout(() => { place(); hero.classList.add('ko-on'); }, 1500);
    document.fonts?.ready.then(place);
    const ro = new ResizeObserver(place);
    ro.observe(hero);
    window.addEventListener('resize', place);

    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener('resize', place);
      copies.forEach((c) => c.remove());
      hero.classList.remove('ko-on');
    };
  }, []);

  return null;
}
