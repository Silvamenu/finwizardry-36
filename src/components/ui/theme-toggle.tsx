
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useThemeEffect } from "@/hooks/useThemeEffect";

export function ThemeToggle() {
  const { preferences, updatePreferences, loading } = useUserPreferences();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useThemeEffect();
  
  // Update the mounted state once the component is mounted
  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  // Update the isDark state when the preferences change
  useEffect(() => {
    if (!loading && mounted) {
      setIsDark(preferences.theme === 'dark');
    }
  }, [preferences.theme, loading, mounted]);

  const toggleTheme = () => {
    if (loading) return;
    const newTheme = isDark ? 'light' : 'dark';
    updatePreferences({ theme: newTheme });
    setIsDark(!isDark);
  };

  // Don't render anything until the component is mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-800 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
