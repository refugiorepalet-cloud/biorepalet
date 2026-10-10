import React, { useState } from 'react';
import {
  Flower2,
  Bug,
  Search,
  Trash2,
  ExternalLink,
  Sparkles,
  Compass,
  BookmarkCheck,
  RefreshCw,
  Calendar,
  ShieldCheck,
  Download
} from 'lucide-react';
import { Specimen } from '../types';
import { SpecimenModal } from './SpecimenModal';
import { resetToSampleCollection } from '../services/storageService';

interface CollectionTabProps {
  specimens: Specimen[];
  onDeleteSpecimen: (id: string) => void;
  onNavigateToExplorer: () => void;
  onRefreshCollection: () => void;
}

export const CollectionTab: React.FC<CollectionTabProps> = ({
  specimens,
  onDeleteSpecimen,
  onNavigateToExplorer,
  onRefreshCollection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Flores' | 'Insectos'>('all');
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(null);

  // Filter items by search query
  const filteredSpecimens = specimens.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.commonName.toLowerCase().includes(q) ||
      item.scientificName.toLowerCase().includes(q) ||
      item.habitat.toLowerCase().includes(q) ||
      (item.family && item.family.toLowerCase().includes(q))
    );
  });

  // Separate automatically into the two required subsections
  const flowerSpecimens = filteredSpecimens.filter((item) => item.category === 'Flores');
  const insectSpecimens = filteredSpecimens.filter((item) => item.category === 'Insectos');

  const totalFlowers = specimens.filter((item) => item.category === 'Flores').length;
  const totalInsects = specimens.filter((item) => item.category === 'Insectos').length;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(specimens, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `biorepalet_coleccion_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRestoreSamples = () => {
    resetToSampleCollection();
    onRefreshCollection();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-24 sm:pb-12">
      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-stone-200/80">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Mi Colección Botánica</span>
            <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
              {specimens.length} {specimens.length === 1 ? 'espécimen' : 'especímenes'}
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organizada automáticamente por Flores & Plantas e Insectos
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {specimens.length > 0 && (
            <button
              onClick={handleExportJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-700 transition-all cursor-pointer shadow-xs"
              title="Descargar copia de respaldo en JSON"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Exportar</span>
            </button>
          )}

          {specimens.length === 0 && (
            <button
              onClick={handleRestoreSamples}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cargar Ejemplos</span>
            </button>
          )}
        </div>
      </div>

      {/* Search bar and Filter pills */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre común, científico, hábitat o familia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 px-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter tags */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Todos ({specimens.length})
          </button>

          <button
            onClick={() => setActiveFilter('Flores')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'Flores'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span>Flores & Plantas ({totalFlowers})</span>
          </button>

          <button
            onClick={() => setActiveFilter('Insectos')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'Insectos'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Insectos & Artrópodos ({totalInsects})</span>
          </button>
        </div>
      </div>

      {/* Global Empty State (no items saved yet) */}
      {specimens.length === 0 && (
        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-stone-200/90 shadow-xs space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <BookmarkCheck className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-stone-900">Tu colección está vacía</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Explora y fotografía flores, plantas o insectos con el Explorador IA para guardarlos
              en tu herbario y catálogo digital.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <button
              onClick={onNavigateToExplorer}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar ahora</span>
            </button>
            <button
              onClick={handleRestoreSamples}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-all cursor-pointer"
            >
              Cargar especímenes de muestra
            </button>
          </div>
        </div>
      )}

      {/* Search No Results */}
      {specimens.length > 0 && filteredSpecimens.length === 0 && (
        <div className="text-center py-10 bg-white rounded-3xl border border-stone-200 p-6 space-y-2">
          <p className="text-sm font-bold text-stone-700">
            No se encontraron especies con "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* SUBSECTION 1: FLORES */}
      {(activeFilter === 'all' || activeFilter === 'Flores') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Flower2 className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-lg text-stone-900 tracking-tight">
                Flores & Plantas
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {flowerSpecimens.length}
              </span>
            </div>
            <span className="text-[11px] text-stone-400 font-medium">Reino Plantae</span>
          </div>

          {flowerSpecimens.length === 0 ? (
            <div className="p-6 bg-emerald-50/40 rounded-2xl border border-dashed border-emerald-200 text-center space-y-2">
              <p className="text-xs text-emerald-900 font-semibold">
                No hay flores guardadas en esta sección todavía.
              </p>
              <button
                onClick={onNavigateToExplorer}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                + Fotografiar una flor o planta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {flowerSpecimens.map((specimen) => (
                <SpecimenGridItem
                  key={specimen.id}
                  specimen={specimen}
                  onSelect={() => setSelectedSpecimen(specimen)}
                  onDelete={() => onDeleteSpecimen(specimen.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* SUBSECTION 2: INSECTOS */}
      {(activeFilter === 'all' || activeFilter === 'Insectos') && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                <Bug className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-lg text-stone-900 tracking-tight">
                Insectos & Artrópodos
              </h3>
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {insectSpecimens.length}
              </span>
            </div>
            <span className="text-[11px] text-stone-400 font-medium">Reino Animalia</span>
          </div>

          {insectSpecimens.length === 0 ? (
            <div className="p-6 bg-amber-50/40 rounded-2xl border border-dashed border-amber-200 text-center space-y-2">
              <p className="text-xs text-amber-900 font-semibold">
                No hay insectos guardados en esta sección todavía.
              </p>
              <button
                onClick={onNavigateToExplorer}
                className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
              >
                + Fotografiar un insecto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {insectSpecimens.map((specimen) => (
                <SpecimenGridItem
                  key={specimen.id}
                  specimen={specimen}
                  onSelect={() => setSelectedSpecimen(specimen)}
                  onDelete={() => onDeleteSpecimen(specimen.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Detailed Specimen Modal */}
      <SpecimenModal
        specimen={selectedSpecimen}
        isOpen={!!selectedSpecimen}
        onClose={() => setSelectedSpecimen(null)}
        onDelete={onDeleteSpecimen}
      />
    </div>
  );
};

interface SpecimenGridItemProps {
  specimen: Specimen;
  onSelect: () => void;
  onDelete: () => void;
}

const SpecimenGridItem: React.FC<SpecimenGridItemProps> = ({ specimen, onSelect, onDelete }) => {
  const isInsect = specimen.category === 'Insectos';

  return (
    <div
      onClick={onSelect}
      className="group relative bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col active:scale-99"
    >
      {/* Thumbnail + Overlays */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
        <img
          src={specimen.imageData}
          alt={specimen.commonName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category tag */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
              isInsect
                ? 'bg-amber-500 text-stone-950 border border-amber-300/40'
                : 'bg-emerald-600 text-white border border-emerald-400/40'
            }`}
          >
            {isInsect ? <Bug className="w-3 h-3" /> : <Flower2 className="w-3 h-3" />}
            <span>{specimen.category}</span>
          </span>
        </div>

        {/* Delete action button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`¿Eliminar "${specimen.commonName}" de tu colección?`)) {
              onDelete();
            }
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
          title="Eliminar de colección"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Bottom titles inside image */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <h4 className="font-extrabold text-base tracking-tight leading-snug truncate drop-shadow-xs">
            {specimen.commonName}
          </h4>
          <p className="text-emerald-300 italic font-serif text-xs truncate">
            {specimen.scientificName}
          </p>
        </div>
      </div>

      {/* Card Info Snippet */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 bg-stone-50/40">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="truncate max-w-[150px] font-medium">
              {specimen.family ? `Fam: ${specimen.family}` : specimen.type}
            </span>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
              {specimen.conservationStatus.split(' ')[0]}
            </span>
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {specimen.fact}
          </p>
        </div>

        <div className="pt-1 flex items-center justify-between border-t border-stone-200/60 text-[11px] text-stone-600 font-medium">
          <span className="text-emerald-800 group-hover:text-emerald-950 font-bold flex items-center gap-1">
            Ver ficha completa →
          </span>
          <span className="text-stone-600">
            {new Date(specimen.savedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
