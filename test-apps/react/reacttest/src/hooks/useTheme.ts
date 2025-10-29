import { useState, useEffect } from 'react';
import type { ThemeType } from '../types';

/**
 * Hook to manage theme state
 */
export function useTheme(initialTheme: ThemeType = 'light') {
    const [theme, setTheme] = useState<ThemeType>(initialTheme);

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return {
        theme,
        setTheme,
        toggleTheme,
    };
}
