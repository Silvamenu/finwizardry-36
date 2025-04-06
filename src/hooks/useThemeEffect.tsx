
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
      // Create a transition effect for multiple properties
      root.style.transition = 'background-color 0.6s ease, color 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease';
      
      // Apply the theme with enhanced transitions
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      
      // Remove the transition after the change is complete
      setTimeout(() => {
        root.style.transition = '';
      }, 600);
    };
    
    applyTheme(preferences.theme);
    
  }, [preferences.theme, loading]);
}
