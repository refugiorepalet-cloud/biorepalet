import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Flower2,
  Bug,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Info
} from 'lucide-react';
import { IdentificationResult, Specimen } from '../types';

interface SpecimenCardProps {
  result: IdentificationResult;
  imageUrl: string;
  isSaved: boolean;
  onToggleSave: () => void;
  showSaveButton?: boolean;
}

export const SpecimenCard: React.FC<SpecimenCardProps> = ({
  result,
  imageUrl,
  isSaved,
  onToggleSave,
  showSaveButton = true,
}) => {
  const [justSavedNotice, setJustSavedNotice] = useState(false);

  const handleSaveClick = () => {
    onToggleSave();
    if (!isSaved) {
      setJustSavedNotice(true);
      setTimeout(() => setJustSavedNotice(false), 2800);
    }
  };

  const isInsect = result.category === 'Insectos';

  // IUCN status badge color helper
  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('peligro') || s.includes('critico') || s.includes('amenazad') || s.includes('cr') || s.includes('en')) {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (s.includes('vulnerable') || s.includes('vu')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (s.includes('preocupaci') || s.includes('menor') || s.includes('lc')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    return 'bg-stone-100 text-stone-800 border-stone-200';
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-stone-900/5 border border-stone-200/80 transition-all duration-300">
      {/* Specimen Header Image Preview */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-stone-950">
        <img
          src={imageUrl}
          alt={result.commonName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${
              isInsect
                ? 'bg-amber-500/90 text-stone-950 border border-amber-300/40'
                : 'bg-emerald-600/90 text-white border border-emerald-400/40'
            }`}
          >
            {isInsect ? (
              <Bug className="w-3.5 h-3.5" />
            ) : (
              <Flower2 className="w-3.5 h-3.5" />
            )}
            <span>{result.category}</span>
          </span>

          {result.confidence && (
            <span className="bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              Confianza: {result.confidence}
            </span>
          )}
        </div>

        {/* Bottom overlay in image */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold mb-0.5">
            Ficha Taxonómica
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
            {result.commonName}
          </h2>
          <p className="text-emerald-100/90 italic font-serif text-sm sm:text-base mt-0.5">
            {result.scientificName}
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Quick meta pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {result.family && (
            <div className="bg-stone-100 text-stone-700 px-3 py-1 rounded-xl font-medium border border-stone-200">
              Familia: <span className="font-semibold text-stone-900">{result.family}</span>
            </div>
          )}
          {result.type && (
            <div className="bg-stone-100 text-stone-700 px-3 py-1 rounded-xl font-medium border border-stone-200">
              Tipo: <span className="font-semibold text-stone-900">{result.type}</span>
            </div>
          )}
        </div>

        {/* Estado de Conservación */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-stone-500 text-xs font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Estado de Conservación</span>
          </div>
          <div
            className={`p-3 rounded-2xl border text-sm font-semibold flex items-center justify-between ${getStatusBadgeClass(
              result.conservationStatus
            )}`}
          >
            <span>{result.conservationStatus}</span>
            <span className="text-[11px] font-medium opacity-80">Categoría UICN</span>
          </div>
        </div>

        {/* Hábitat Natural */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-stone-500 text-xs font-semibold tracking-wider uppercase">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Hábitat y Distribución</span>
          </div>
          <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/80 text-stone-700 text-sm leading-relaxed">
            {result.habitat}
          </div>
        </div>

        {/* Fascinating Fact (Dato Fascinante) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-stone-50 border border-emerald-200/70 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-pulse" />
            <span>Dato Fascinante de la Especie</span>
          </div>
          <p className="text-stone-800 text-sm leading-relaxed font-medium">
            "{result.fact}"
          </p>
        </div>

        {/* Morphological description */}
        {result.description && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center space-x-1.5 text-stone-500 text-xs font-semibold tracking-wider uppercase">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Características Morfológicas</span>
            </div>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {result.description}
            </p>
          </div>
        )}

        {/* Persistence Button: Guardar en mi Colección */}
        {showSaveButton && (
          <div className="pt-2">
            <button
              onClick={handleSaveClick}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all duration-200 shadow-md active:scale-98 cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-600/70 hover:bg-emerald-100 shadow-emerald-900/10'
                  : 'bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-950/20'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                  <span>Guardado en mi Colección</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-5 h-5 stroke-[2.2]" />
                  <span>Guardar en mi Colección</span>
                </>
              )}
            </button>

            {justSavedNotice && (
              <div className="mt-2 text-center text-xs font-semibold text-emerald-700 flex items-center justify-center space-x-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Especie guardada en LocalStorage de tu navegador!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
