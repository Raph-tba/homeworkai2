import { useState } from 'react';
import { Page } from './types';
import Navigation from './components/Navigation';
import PageAccueil from './components/PageAccueil';
import PageCorrecteur from './components/PageCorrecteur';
import PageArchitecture from './components/PageArchitecture';
import PagePrompts from './components/PagePrompts';
import PageRoadmap from './components/PageRoadmap';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('accueil');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'accueil':
        return <PageAccueil onNavigate={navigateTo} />;
      case 'correcteur':
        return <PageCorrecteur />;
      case 'architecture':
        return <PageArchitecture />;
      case 'prompts':
        return <PagePrompts />;
      case 'roadmap':
        return <PageRoadmap />;
      default:
        return <PageAccueil onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-warm-50">
      <Navigation currentPage={currentPage} onNavigate={navigateTo} />
      <main>{renderPage()}</main>

      {/* Footer simple */}
      <footer className="border-t border-warm-200/60 mt-8">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-warm-700 mb-1">HomeworkAI</p>
              <p className="text-xs text-warm-400">
                Projet open-source · Correction de devoirs par IA
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { page: 'correcteur' as Page, label: 'Correcteur' },
                { page: 'architecture' as Page, label: 'Architecture' },
                { page: 'prompts' as Page, label: 'Prompts' },
                { page: 'roadmap' as Page, label: 'Roadmap' },
              ].map((item) => (
                <button
                  key={item.page}
                  onClick={() => navigateTo(item.page)}
                  className="text-xs text-warm-400 hover:text-accent transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-warm-100">
            <p className="text-[11px] text-warm-300">
              Fait par un dev de 16 ans · 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
