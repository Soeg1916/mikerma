import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function ScrollRestoration() {
  const [location] = useLocation();

  // When location changes, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Handle page refresh and browser back/forward navigation
  useEffect(() => {
    // Save scroll position before unloading
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', '0');
    };

    // Restore scroll position on page load
    const restoreScrollPosition = () => {
      const scrollPosition = sessionStorage.getItem('scrollPosition');
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', restoreScrollPosition);

    // Run once on component mount to ensure we start at the top
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', restoreScrollPosition);
    };
  }, []);

  return null;
}