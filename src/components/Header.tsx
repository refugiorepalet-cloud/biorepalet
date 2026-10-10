import React from 'react';
import { Leaf, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  collectionCount: number;
  onNavigateToCollection: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collectionCount, onNavigateToCollection }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#16382C]/95 backdrop-blur-md border-b border-emerald-900/40 text-white shadow-sm transition-all">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-950/40 text-stone-900">
            <Leaf className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                Bio<span className="text-emerald-400">Repalet</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                IA Botánica
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-medium">
              Explorador de Flores, Plantas e Insectos
            </p>
          </div>
        </div>

        {/* Collection quick counter */}
        <button
          onClick={onNavigateToCollection}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800/70 border border-emerald-700/50 text-xs font-medium text-emerald-100 transition-all active:scale-95 cursor-pointer"
          title="Ver mi colección"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xs:inline">Colección:</span>
          <span className="font-bold text-white bg-emerald-700 px-1.5 py-0.2 rounded-full text-[11px]">
            {collectionCount}
          </span>
        </button>
      </div>
    </header>
  );
};
