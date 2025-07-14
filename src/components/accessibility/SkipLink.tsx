import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={`skip-link ${className}`}
      onFocus={(e) => {
        // Ensure the skip link is visible when focused
        e.currentTarget.style.top = '6px';
      }}
      onBlur={(e) => {
        // Hide the skip link when focus is lost
        e.currentTarget.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
}

// Skip Links Container Component
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      <SkipLink href="#navigation">
        Skip to navigation
      </SkipLink>
      <SkipLink href="#search">
        Skip to search
      </SkipLink>
    </div>
  );
}