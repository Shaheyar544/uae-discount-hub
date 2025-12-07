'use client';

import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg hover:bg-secondary transition-all duration-300 group"
            aria-label="Toggle theme"
        >
            <div className="relative w-6 h-6">
                {/* Sun Icon */}
                <SunIcon
                    className={`absolute inset-0 w-6 h-6 text-accent transition-all duration-300 ${theme === 'light'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 rotate-90 scale-0'
                        }`}
                />
                {/* Moon Icon */}
                <MoonIcon
                    className={`absolute inset-0 w-6 h-6 text-primary transition-all duration-300 ${theme === 'dark'
                            ? 'opacity-100 rotate-0 scale-100'
                            : 'opacity-0 -rotate-90 scale-0'
                        }`}
                />
            </div>
        </button>
    );
}
