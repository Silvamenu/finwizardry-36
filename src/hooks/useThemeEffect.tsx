
import { useEffect } from 'react';
import { useUserPreferences } from './useUserPreferences';

export function useThemeEffect() {
  const { preferences, loading } = useUserPreferences();
  
  useEffect(() => {
    if (loading) return;
    
    // Get the HTML element
    const root = window.document.documentElement;
    
    // Apply theme based on user preferences - removed system preference detection
    // Now we only apply light or dark directly
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      // Default to light mode for any other value including 'light' and 'system'
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
  }, [preferences.theme, loading]);
}
