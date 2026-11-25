import React from 'react';
import { Search, Compass, GitFork } from 'lucide-react';

interface HeaderProps {
  activeView: 'catalog' | 'map';
  onNavigateHome: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigateHome,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="h-16 bg-[#121417] border-b border-neutral-800 px-6 flex items-center justify-between select-none z-30">
      {/* Brand Logo */}
      <div 
        onClick={onNavigateHome}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-white tracking-tight">
              Layerloom
            </span>
            <span className="text-[10px] font-mono uppercase bg-orange-950 text-orange-400 px-1.5 py-0.5 rounded border border-orange-800">
              Atlas
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 -mt-0.5">India's Open Geospatial Data Explorer</p>
        </div>
      </div>

      {/* Global Search Bar (visible in catalog view) */}
      {activeView === 'catalog' && (
        <div className="flex-1 max-w-md mx-8 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search districts, rivers, highways, hospitals, forests..."
            className="w-full bg-[#181a1f] border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex items-center gap-5 text-xs font-medium text-neutral-300">
        <button 
          onClick={onNavigateHome}
          className={`${activeView === 'catalog' ? 'text-orange-400 font-bold' : 'hover:text-white'} transition-colors`}
        >
          Layers
        </button>
        <a 
          href="https://github.com/Suyash-Bhosale2112/Layerloom"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
        >
          <GitFork className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
};
