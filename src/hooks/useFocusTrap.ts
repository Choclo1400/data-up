import { useEffect, useRef, useCallback } from 'react';

interface FocusTrapOptions {
  initialFocus?: HTMLElement | null;
  restoreFocus?: boolean;
  allowOutsideClick?: boolean;
}

export function useFocusTrap(
  isActive: boolean,
  options: FocusTrapOptions = {}
) {
  const {
    initialFocus,
    restoreFocus = true,
    allowOutsideClick = false
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((container: HTMLElement) => {
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

    return Array.from(container.querySelectorAll(selector))
      .filter(el => {
        const element = el as HTMLElement;
        return element.offsetParent !== null && 
               !element.hasAttribute('aria-hidden') &&
               element.tabIndex !== -1;
      }) as HTMLElement[];
  }, []);

  const handleTabKey = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [getFocusableElements]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!containerRef.current || allowOutsideClick) return;

    if (!containerRef.current.contains(event.target as Node)) {
      event.preventDefault();
      // Return focus to the first focusable element
      const focusableElements = getFocusableElements(containerRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [allowOutsideClick, getFocusableElements]);

  const activateFocusTrap = useCallback(() => {
    if (!containerRef.current) return;

    // Store the currently focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    // Focus the initial element or first focusable element
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length === 0) return;

    const elementToFocus = initialFocus || focusableElements[0];
    elementToFocus.focus();

    // Add event listeners
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('mousedown', handleClickOutside);
  }, [initialFocus, getFocusableElements, handleTabKey, handleClickOutside]);

  const deactivateFocusTrap = useCallback(() => {
    // Remove event listeners
    document.removeEventListener('keydown', handleTabKey);
    document.removeEventListener('mousedown', handleClickOutside);

    // Restore focus to the previously focused element
    if (restoreFocus && previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
    }
  }, [handleTabKey, handleClickOutside, restoreFocus]);

  useEffect(() => {
    if (isActive) {
      activateFocusTrap();
    } else {
      deactivateFocusTrap();
    }

    return () => {
      deactivateFocusTrap();
    };
  }, [isActive, activateFocusTrap, deactivateFocusTrap]);

  return containerRef;
}