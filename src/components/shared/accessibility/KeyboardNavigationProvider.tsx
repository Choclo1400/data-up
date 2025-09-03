import React, { createContext, useContext, useEffect, useState } from 'react';

interface KeyboardNavigationContextType {
  isKeyboardUser: boolean;
  setKeyboardUser: (isKeyboard: boolean) => void;
}

const KeyboardNavigationContext = createContext<KeyboardNavigationContextType>({
  isKeyboardUser: false,
  setKeyboardUser: () => {}
});

export function useKeyboardUser() {
  return useContext(KeyboardNavigationContext);
}

interface KeyboardNavigationProviderProps {
  children: React.ReactNode;
}

export function KeyboardNavigationProvider({ children }: KeyboardNavigationProviderProps) {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    let keyboardTimeout: NodeJS.Timeout;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Detect keyboard navigation
      if (event.key === 'Tab' || event.key.startsWith('Arrow') || event.key === 'Enter' || event.key === ' ') {
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-navigation-active');
        
        // Clear any existing timeout
        if (keyboardTimeout) {
          clearTimeout(keyboardTimeout);
        }
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.classList.remove('keyboard-navigation-active');
      
      // Set a timeout to re-enable keyboard detection after mouse interaction
      keyboardTimeout = setTimeout(() => {
        // Allow keyboard detection again after a brief delay
      }, 100);
    };

    const handleFocusIn = (event: FocusEvent) => {
      // If focus is gained without mouse interaction, assume keyboard
      if (!event.relatedTarget && event.target instanceof HTMLElement) {
        const rect = event.target.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        
        if (isVisible) {
          setIsKeyboardUser(true);
          document.body.classList.add('keyboard-navigation-active');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focusin', handleFocusIn);
      if (keyboardTimeout) {
        clearTimeout(keyboardTimeout);
      }
    };
  }, []);

  const setKeyboardUser = (isKeyboard: boolean) => {
    setIsKeyboardUser(isKeyboard);
    if (isKeyboard) {
      document.body.classList.add('keyboard-navigation-active');
    if (event.key?.length === 1 && event.key.match(/[a-zA-Z]/)) {
      document.body.classList.remove('keyboard-navigation-active');
    }
  };

  return (
    <KeyboardNavigationContext.Provider value={{ isKeyboardUser, setKeyboardUser }}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
}