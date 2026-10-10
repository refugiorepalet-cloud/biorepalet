import React from 'react';
import { X, Trash2, Calendar, MapPin, Sparkles, ShieldCheck, Flower2, Bug, BookmarkCheck } from 'lucide-react';
import { Specimen } from '../types';

interface SpecimenModalProps {
  specimen: Specimen | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const SpecimenModal: React.FC<SpecimenModalProps> = ({
  specimen,
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!isOpen || !specimen) return null;

  const isInsect = specimen.category === 'Insectos';
  const savedDateStr = new Date(specimen.savedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar "${specimen.commonName}" de tu colección?`)) {
      onDelete(specimen.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-stone-200 relative my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-[16/10] w-full bg-stone-900">
          <img
            src={specimen.imageData}
            alt={specimen.commonName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                isInsect
                  ? 'bg-amber-500 text-stone-950 border border-amber-300/40'
                  : 'bg-emerald-600 text-white border border-emerald-400/40'
              }`}
            >
              {isInsect ? <Bug className="w-3.5 h-3.5" /> : <Flower2 className="w-3.5 h-3.5" />}
              <span>{specimen.category}</span>
            </span>
          </div>

          {/* Titles */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-2xl font-extrabold tracking-tight leading-tight">
              {specimen.commonName}
            </h3>
            <p className="text-emerald-300 italic font-serif text-sm mt-0.5">
              {specimen.scientificName}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
          {/* Collection Metadata */}
          <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Guardado: {savedDateStr}</span>
            </div>
            {specimen.confidence && (
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Confianza: {specimen.confidence}
              </span>
            )}
          </div>

          {/* Classification Tags */}
          <div className="flex flex-wrap gap-2 text-xs">
            {specimen.family && (
              <div className="bg-stone-100 text-stone-800 px-3 py-1 rounded-xl font-medium">
                Familia: <span className="font-bold">{specimen.family}</span>
              </div>
            )}
            {specimen.type && (
              <div className="bg-stone-100 text-stone-800 px-3 py-1 rounded-xl font-medium">
                Tipo: <span className="font-bold">{specimen.type}</span>
              </div>
            )}
          </div>

          {/* Conservation Status */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-stone-500 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Estado de Conservación</span>
            </div>
            <p className="text-sm font-semibold text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
              {specimen.conservationStatus}
            </p>
          </div>

          {/* Habitat */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-stone-500 text-xs font-semibold tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Hábitat y Distribución</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200/80 leading-relaxed">
              {specimen.habitat}
            </p>
          </div>

          {/* Fascinating Fact */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70">
            <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Dato Fascinante</span>
            </div>
            <p className="text-stone-800 text-xs sm:text-sm leading-relaxed font-medium">
              "{specimen.fact}"
            </p>
          </div>

          {/* Morphological notes */}
          {specimen.description && (
            <p className="text-xs text-stone-600 leading-relaxed pt-1">
              {specimen.description}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar de Colección</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white transition-all cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
