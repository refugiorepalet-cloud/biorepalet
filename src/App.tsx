/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Navbar, TabType } from './components/Navbar';
import { ExplorerTab } from './components/ExplorerTab';
import { CollectionTab } from './components/CollectionTab';
import { getSavedSpecimens, removeSpecimen } from './services/storageService';
import { Specimen } from './types';
import { Leaf } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('explorer');
  const [specimens, setSpecimens] = useState<Specimen[]>([]);

  // Refresh collection state from LocalStorage
  const refreshCollection = useCallback(() => {
    const items = getSavedSpecimens();
    setSpecimens(items);
  }, []);

  // Listen to storage update events for reactive UI
  useEffect(() => {
    refreshCollection();

    const handleStorageUpdate = () => {
      refreshCollection();
    };

    window.addEventListener('biorepalet_storage_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('biorepalet_storage_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [refreshCollection]);

  const handleDeleteSpecimen = (id: string) => {
    removeSpecimen(id);
    refreshCollection();
  };

  const flowersCount = specimens.filter((s) => s.category === 'Flores').length;
  const insectsCount = specimens.filter((s) => s.category === 'Insectos').length;

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-stone-800 flex flex-col font-sans">
      {/* Nature-inspired Header */}
      <Header
        collectionCount={specimens.length}
        onNavigateToCollection={() => setActiveTab('collection')}
      />

      {/* Main Tab Switcher */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collectionCount={specimens.length}
        flowersCount={flowersCount}
        insectsCount={insectsCount}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'explorer' ? (
          <ExplorerTab onSpecimenSaved={refreshCollection} />
        ) : (
          <CollectionTab
            specimens={specimens}
            onDeleteSpecimen={handleDeleteSpecimen}
            onNavigateToExplorer={() => setActiveTab('explorer')}
            onRefreshCollection={refreshCollection}
          />
        )}
      </main>

      {/* Minimal dark-green footer; extra bottom padding on mobile clears the fixed bottom nav */}
      <footer className="bg-[#1F4A3A] border-t border-emerald-900/40 text-emerald-100/70 pt-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:py-5">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-2 text-center">
          <Leaf className="hidden sm:block w-3.5 h-3.5 shrink-0 text-emerald-400/80" />
          <p className="text-[11px] sm:text-xs leading-relaxed tracking-wide">
            © 2026 <span className="font-semibold text-emerald-50/90">BioRepalet</span>.{' '}
            <span className="block sm:inline">
              Desarrollado en colaboración con{' '}
              <span className="font-semibold text-emerald-300">crog</span>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
