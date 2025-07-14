import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { Menu, X } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface AccessibleNavbarProps {
  items: NavItem[];
  logo?: React.ReactNode;
  userMenu?: React.ReactNode;
}

export function AccessibleNavbar({ items, logo, userMenu }: AccessibleNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for main nav
  useKeyboardNavigation(navRef, {
    orientation: 'horizontal',
    enableArrowKeys: true,
    enableHomeEnd: true,
  });

  // Focus trap for mobile menu
  const focusTrapRef = useFocusTrap(isMobileMenuOpen, {
    restoreFocus: true,
  });

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      handleMobileMenuClose();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b" role="banner">
      <nav
        ref={navRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo && (
              <Link
                to="/"
                className="flex items-center focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded-md p-1"
                aria-label="Go to homepage"
              >
                {logo}
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4" role="menubar">
              {items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium transition-colors
                      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none
                      ${isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            {userMenu}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMobileMenuToggle}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            ref={focusTrapRef}
            id="mobile-menu"
            className="md:hidden"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="mobile-menu-button"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleMobileMenuClose}
                    className={`
                      block px-3 py-2 rounded-md text-base font-medium transition-colors
                      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none
                      ${isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              
              {/* Mobile User Menu */}
              <div className="border-t pt-4 mt-4">
                {userMenu}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}