import { useEffect, useState } from 'react';
import { useLocation, useMatches } from 'react-router-dom';

const AccessibilityManager = () => {
  const location = useLocation();
  const matches = useMatches();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const handleAnnounce = (e: any) => {
      setAnnouncement(e.detail);
      // Clear after a while so the same message can be announced again if needed
      setTimeout(() => setAnnouncement(''), 1000);
    };

    window.addEventListener('app-announce', handleAnnounce);
    return () => window.removeEventListener('app-announce', handleAnnounce);
  }, []);

  useEffect(() => {
    // 1. Update document title
    const currentMatch = matches.find((m) => m.handle && (m.handle as any).title);
    if (currentMatch) {
      const title = (currentMatch.handle as any).title;
      document.title = `${title} | Lab12`;
      setAnnouncement(`Navigated to ${title} page`);
    }

    // 2. Set focus for the first interactive element or h1
    const timer = setTimeout(() => {
      const h1 = document.querySelector('h1');
      if (h1) {
        h1.setAttribute('tabindex', '-1');
        h1.focus();
      } else {
        const firstInteractive = document.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        if (firstInteractive) {
          firstInteractive.focus();
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location, matches]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
};

export default AccessibilityManager;
