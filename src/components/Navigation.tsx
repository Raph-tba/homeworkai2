import { Page } from '../types';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string }[] = [
  { page: 'correcteur', label: 'Correcteur' },
  { page: 'architecture', label: 'Architecture' },
  { page: 'prompts', label: 'Prompts' },
  { page: 'roadmap', label: 'Roadmap' },
];

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-warm-200/60">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
          <button
            onClick={() => onNavigate('accueil')}
            className="text-base font-semibold text-warm-900 tracking-tight hover:opacity-70 transition-opacity"
          >
            HomeworkAI
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ page, label }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  currentPage === page
                    ? 'text-accent bg-accent-soft'
                    : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-warm-500 hover:text-warm-800"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-warm-200/60">
          <div className="px-4 py-2">
            {navItems.map(({ page, label }) => (
              <button
                key={page}
                onClick={() => {
                  onNavigate(page);
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${
                  currentPage === page
                    ? 'text-accent bg-accent-soft'
                    : 'text-warm-600 hover:text-warm-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
