
import { useEffect } from 'react';
import { useUserPreferences } from './useUserPreferences';

export function useThemeEffect() {
  const { preferences, loading } = useUserPreferences();
  
  useEffect(() => {
    if (loading) return;
    
    // Get the HTML element
    const root = window.document.documentElement;
    
    // Apply theme based on user preferences
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (preferences.theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      
      // Listen for changes in system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (mediaQuery.matches) {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme, loading]);
}
