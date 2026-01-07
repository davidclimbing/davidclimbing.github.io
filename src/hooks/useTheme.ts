import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants';

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 저장된 테마 또는 시스템 설정 확인
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEYS.THEME, newValue ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newValue);
      return newValue;
    });
  };

  return { isDark, toggleTheme };
}
