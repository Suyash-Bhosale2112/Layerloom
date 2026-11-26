import React from 'react';
import { Compass, GitFork, Search } from 'lucide-react';

interface HeaderProps {
  activeView: 'catalog' | 'map';
  onNavigateHome: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigateHome,
  searchQuery,
  onSearchChange
}) => (
  <header className="app-header z-30 flex h-[68px] shrink-0 items-center justify-between border-b px-5 sm:px-8">
    <button
      type="button"
      onClick={onNavigateHome}
      className="brand-lockup flex min-w-0 items-center gap-3 text-left"
      aria-label="Layerloom home"
    >
      <span className="brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <Compass className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="text-[17px] font-bold tracking-tight text-white">Layerloom</span>
          <span className="brand-tag hidden rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] sm:inline-flex">
            India GIS
          </span>
        </span>
        <span className="block truncate text-[11px] text-slate-400">
          India&apos;s open geospatial data explorer
        </span>
      </span>
    </button>

    {activeView === 'catalog' && (
      <label className="catalog-search mx-5 flex w-full max-w-[390px] items-center gap-2.5 rounded-xl border px-3.5 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search datasets, places, or themes..."
          aria-label="Search datasets"
          className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
        />
      </label>
    )}

    <nav className="flex shrink-0 items-center gap-4 text-xs font-medium">
      <button
        type="button"
        onClick={onNavigateHome}
        className={`nav-link ${activeView === 'catalog' ? 'active' : ''}`}
      >
        Explore
      </button>
      <a
        href="https://github.com/Suyash-Bhosale2112/Layerloom"
        target="_blank"
        rel="noreferrer"
        aria-label="Layerloom on GitHub"
        className="nav-github flex items-center gap-1.5"
      >
        <GitFork className="h-4 w-4" />
        <span className="hidden sm:inline">GitHub</span>
      </a>
    </nav>
  </header>
);
