import React from 'react';
import { Compass, BookmarkCheck, Flower2, Bug } from 'lucide-react';

export type TabType = 'explorer' | 'collection';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  collectionCount: number;
  flowersCount: number;
  insectsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  collectionCount,
  flowersCount,
  insectsCount,
}) => {
  return (
    <>
      {/* Top Segmented Controller on mobile/desktop */}
      <div className="max-w-md mx-auto px-4 pt-4 pb-2">
        <div className="bg-stone-200/80 p-1 rounded-2xl flex shadow-inner border border-stone-300/60 backdrop-blur-sm">
          <button
            onClick={() => onTabChange('explorer')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md shadow-emerald-950/20 scale-[1.01]'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <Compass
              className={`w-4 h-4 ${
                activeTab === 'explorer' ? 'text-emerald-300 animate-spin-slow' : 'text-stone-500'
              }`}
            />
            <span>Explorador IA</span>
          </button>

          <button
            onClick={() => onTabChange('collection')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer relative ${
              activeTab === 'collection'
                ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-md shadow-emerald-950/20 scale-[1.01]'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <BookmarkCheck
              className={`w-4 h-4 ${
                activeTab === 'collection' ? 'text-emerald-300' : 'text-stone-500'
              }`}
            />
            <span>Mi Colección</span>
            {collectionCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-extrabold transition-colors ${
                  activeTab === 'collection'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-700/80 text-white'
                }`}
              >
                {collectionCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Floating Bottom Nav for ultra-smooth one-handed mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#16382C]/95 backdrop-blur-md border-t border-emerald-900/50 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:hidden shadow-lg shadow-black/30">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          <button
            onClick={() => onTabChange('explorer')}
            className={`flex flex-col items-center py-1 px-5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'explorer'
                ? 'text-emerald-300 font-bold scale-105'
                : 'text-emerald-100/60 font-medium hover:text-emerald-100'
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                activeTab === 'explorer' ? 'bg-emerald-800/80 text-emerald-300' : ''
              }`}
            >
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5">Explorador IA</span>
          </button>

          <button
            onClick={() => onTabChange('collection')}
            className={`flex flex-col items-center py-1 px-5 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'collection'
                ? 'text-emerald-300 font-bold scale-105'
                : 'text-emerald-100/60 font-medium hover:text-emerald-100'
            }`}
          >
            <div
              className={`p-1 rounded-lg relative ${
                activeTab === 'collection' ? 'bg-emerald-800/80 text-emerald-300' : ''
              }`}
            >
              <BookmarkCheck className="w-5 h-5" />
              {collectionCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-400 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {collectionCount}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5">Mi Colección</span>
          </button>
        </div>
      </div>
    </>
  );
};
