import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Results', href: '#results' },
  { label: 'Security', href: '#security' },
  { label: 'Dependencies', href: '#dependencies' },
  { label: 'History', href: '#history' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'About', href: '#about' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-bg/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold text-accent-light tracking-tight">
          ChainLens
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted hover:text-text transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://github.com/VarunGore36/ChainLens-Results"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-text transition-colors"
          >
            GitHub
          </a>
        </nav>
        <button
          className="md:hidden text-muted hover:text-text"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-bg px-6 py-4 flex flex-col gap-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted hover:text-text"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
