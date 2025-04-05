
import { useEffect } from 'react';
import { useUserPreferences } from './useUserPreferences';

export function useThemeEffect() {
  const { preferences, loading } = useUserPreferences();
  
  useEffect(() => {
    if (loading) return;
    
    // Get the HTML element
    const root = window.document.documentElement;
    
    // Apply theme based on user preferences with a smooth transition
    const applyTheme = (theme: string) => {
      // Create a transition effect
      root.style.transition = 'background-color 0.5s ease, color 0.5s ease';
      
      // Apply the theme
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      
      // Remove the transition after the change is complete to avoid affecting other transitions
      setTimeout(() => {
        root.style.transition = '';
      }, 500);
    };
    
    applyTheme(preferences.theme);
    
  }, [preferences.theme, loading]);
}
