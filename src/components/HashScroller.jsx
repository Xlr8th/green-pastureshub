'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const id = hash.replace('#', '');

      setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
  }, [pathname]);

  return null;
}