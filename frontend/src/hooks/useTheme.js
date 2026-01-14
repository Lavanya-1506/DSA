import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('dsa-theme') || 'dark';
    setTheme(savedTheme);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dsa-theme', theme);
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setCustomTheme = (newTheme) => {
    if (['dark', 'light', 'blue', 'green', 'purple'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return {
    theme,
    toggleTheme,
    setTheme: setCustomTheme,
    isLoaded
  };
};

// Theme configurations
export const themeConfigs = {
  dark: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
    background: '#1a1a1a',
    text: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)'
  },
  light: {
    primary: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    secondary: 'linear-gradient(45deg, #fd79a8, #e84393)',
    background: '#ffffff',
    text: '#2d3436',
    glass: 'rgba(0, 0, 0, 0.1)',
    glassBorder: 'rgba(0, 0, 0, 0.2)'
  },
  blue: {
    primary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    secondary: 'linear-gradient(45deg, #43e97b, #38f9d7)',
    background: '#0a1929',
    text: '#e3f2fd',
    glass: 'rgba(79, 172, 254, 0.1)',
    glassBorder: 'rgba(79, 172, 254, 0.3)'
  },
  green: {
    primary: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    secondary: 'linear-gradient(45deg, #fa709a, #fee140)',
    background: '#0d1f0d',
    text: '#e8f5e8',
    glass: 'rgba(67, 233, 123, 0.1)',
    glassBorder: 'rgba(67, 233, 123, 0.3)'
  },
  purple: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(45deg, #f093fb, #f5576c)',
    background: '#1a0d2e',
    text: '#f3e5f5',
    glass: 'rgba(102, 126, 234, 0.1)',
    glassBorder: 'rgba(102, 126, 234, 0.3)'
  }
};

export const applyThemeStyles = (theme) => {
  const config = themeConfigs[theme] || themeConfigs.dark;
  
  const styles = `
    :root[data-theme="${theme}"] {
      --primary-gradient: ${config.primary};
      --secondary-gradient: ${config.secondary};
      --background: ${config.background};
      --text-primary: ${config.text};
      --glass-bg: ${config.glass};
      --glass-border: ${config.glassBorder};
    }
  `;
  
  return styles;
};

export default useTheme;
