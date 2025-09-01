import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean;
  enableHomeEnd?: boolean;
  enableTypeAhead?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  onEscape?: () => void;
}

export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  options: KeyboardNavigationOptions = {}
) {
  const {
    enableArrowKeys = true,
    enableHomeEnd = true,
    enableTypeAhead = false,
    orientation = 'both',
    loop = true,
    onEscape
  } = options;

  const typeAheadRef = useRef('');
  const typeAheadTimeoutRef = useRef<NodeJS.Timeout>();

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([aria-disabled="true"])',
      '[role="menuitem"]:not([aria-disabled="true"])',
      '[role="option"]:not([aria-disabled="true"])'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(selector))
      .filter(el => {
        const element = el as HTMLElement;
        return element.offsetParent !== null && 
               !element.hasAttribute('aria-hidden') &&
               element.tabIndex !== -1;
      }) as HTMLElement[];
  }, [containerRef]);

  const moveFocus = useCallback((direction: 'next' | 'previous' | 'first' | 'last') => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    const currentIndex = elements.findIndex(el => el === document.activeElement);
    let nextIndex: number;

    switch (direction) {
      case 'next':
        nextIndex = currentIndex + 1;
        if (nextIndex >= elements.length) {
          nextIndex = loop ? 0 : elements.length - 1;
        }
        break;
      case 'previous':
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = loop ? elements.length - 1 : 0;
        }
        break;
      case 'first':
        nextIndex = 0;
        break;
      case 'last':
        nextIndex = elements.length - 1;
        break;
      default:
        return;
    }

    elements[nextIndex]?.focus();
  }, [getFocusableElements, loop]);

  const handleTypeAhead = useCallback((char: string) => {
    if (!enableTypeAhead) return;

    const elements = getFocusableElements();
    if (elements.length === 0) return;

    // Clear previous timeout
    if (typeAheadTimeoutRef.current) {
      clearTimeout(typeAheadTimeoutRef.current);
    }

    // Add character to search string
    typeAheadRef.current += char.toLowerCase();

    // Find matching element
    const currentIndex = elements.findIndex(el => el === document.activeElement);
    const searchElements = [...elements.slice(currentIndex + 1), ...elements.slice(0, currentIndex + 1)];
    
    const matchingElement = searchElements.find(el => {
      const text = el.textContent?.toLowerCase() || el.getAttribute('aria-label')?.toLowerCase() || '';
      return text.startsWith(typeAheadRef.current);
    });

    if (matchingElement) {
      matchingElement.focus();
    }

    // Clear search string after delay
    typeAheadTimeoutRef.current = setTimeout(() => {
      typeAheadRef.current = '';
    }, 500);
  }, [enableTypeAhead, getFocusableElements]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current?.contains(event.target as Node)) return;

    switch (event.key) {
      case 'ArrowDown':
        if (enableArrowKeys && (orientation === 'vertical' || orientation === 'both')) {
          event.preventDefault();
          moveFocus('next');
        }
        break;
      case 'ArrowUp':
        if (enableArrowKeys && (orientation === 'vertical' || orientation === 'both')) {
          event.preventDefault();
          moveFocus('previous');
        }
        break;
      case 'ArrowRight':
        if (enableArrowKeys && (orientation === 'horizontal' || orientation === 'both')) {
          event.preventDefault();
          moveFocus('next');
        }
        break;
      case 'ArrowLeft':
        if (enableArrowKeys && (orientation === 'horizontal' || orientation === 'both')) {
          event.preventDefault();
          moveFocus('previous');
        }
        break;
      case 'Home':
        if (enableHomeEnd) {
          event.preventDefault();
          moveFocus('first');
        }
        break;
      case 'End':
        if (enableHomeEnd) {
          event.preventDefault();
          moveFocus('last');
        }
        break;
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
      default:
        // Handle type-ahead
        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          handleTypeAhead(event.key);
        }
        break;
    }
  }, [enableArrowKeys, enableHomeEnd, orientation, moveFocus, onEscape, handleTypeAhead, containerRef]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (typeAheadTimeoutRef.current) {
        clearTimeout(typeAheadTimeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  return {
    moveFocus,
    getFocusableElements
  };
}