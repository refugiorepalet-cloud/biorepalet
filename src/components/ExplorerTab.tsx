import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Flower2,
  Bug,
  Leaf,
  ScanLine
} from 'lucide-react';
import { CameraModal } from './CameraModal';
import { SpecimenCard } from './SpecimenCard';
import { SAMPLE_PRESETS, SamplePreset } from '../data/sampleSpecimens';
import { identifySpecimenImage } from '../services/geminiService';
import { isSpecimenSaved, saveSpecimen, removeSpecimen } from '../services/storageService';
import { IdentificationResult, Specimen } from '../types';

interface ExplorerTabProps {
  onSpecimenSaved: () => void;
}

const SCAN_STEPS = [
  'Iniciando escaneo biométrico botánico...',
  'Analizando pigmentación foliar y morfología...',
  'Consultando catálogo de taxonomía y entomología...',
  'Verificando clasificación en la Lista Roja UICN...',
  'Extrayendo datos biológicos y hechos curiosos...',
];

export const ExplorerTab: React.FC<ExplorerTabProps> = ({ onSpecimenSaved }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze the given image
  const analyzeImage = async (base64Image: string, mimeType: string = 'image/jpeg') => {
    setSelectedImage(base64Image);
    setSelectedMimeType(mimeType);
    setResult(null);
    setError(null);
    setIsScanning(true);
    setScanStepIndex(0);

    // Rotate status messages every 700ms
    const interval = setInterval(() => {
      setScanStepIndex((prev) => (prev + 1) % SCAN_STEPS.length);
    }, 700);

    try {
      const identifiedResult = await identifySpecimenImage(base64Image, mimeType);
      setResult(identifiedResult);
    } catch (err: unknown) {
      console.error('Error analyzing image:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg ||
          'No pudimos identificar la especie. Asegúrate de que la imagen sea nítida y muestre una flor, planta o insecto.'
      );
    } finally {
      clearInterval(interval);
      setIsScanning(false);
    }
  };

  // Handle file input upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimeType = file.type || 'image/jpeg';
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        analyzeImage(reader.result, mimeType);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be selected again
    e.target.value = '';
  };

  // Handle camera capture
  const handleCameraCapture = (base64Data: string) => {
    analyzeImage(base64Data, 'image/jpeg');
  };

  // Handle preset sample selection
  const handleSelectPreset = (preset: SamplePreset) => {
    analyzeImage(preset.imageUrl, 'image/jpeg');
  };

  // Reset to analyze another specimen
  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setIsScanning(false);
  };

  // Check if current result is already in collection
  const isCurrentSaved = result ? isSpecimenSaved(result.scientificName) : false;

  const handleToggleSave = () => {
    if (!result || !selectedImage) return;

    if (isCurrentSaved) {
      // Find and remove
      // Or toggle
      const specimen: Specimen = {
        ...result,
        id: `specimen-${Date.now()}`,
        imageData: selectedImage,
        savedAt: Date.now(),
      };
      saveSpecimen(specimen);
    } else {
      const newSpecimen: Specimen = {
        ...result,
        id: `specimen-${Date.now()}`,
        imageData: selectedImage,
        savedAt: Date.now(),
      };
      saveSpecimen(newSpecimen);
    }
    onSpecimenSaved();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-6 pb-10 sm:pb-12">
      {/* Intro hero banner */}
      {!selectedImage && !isScanning && (
        <div className="text-center space-y-2 py-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold border border-emerald-300/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Reconocimiento Inteligente Multimodal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Descubre los Secretos de la Naturaleza
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Toma una foto en vivo o sube una imagen de cualquier flor, planta o insecto. Nuestro
            experto botánico y entomólogo IA te revelará su especie, hábitat y datos fascinantes.
          </p>
        </div>
      )}

      {/* Main capture action cards (when no image selected) */}
      {!selectedImage && !isScanning && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Live Camera Button */}
            <button
              onClick={() => setIsCameraOpen(true)}
              className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-[#1B4D3E] to-[#0F382A] text-white shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:shadow-emerald-950/30 transition-all duration-200 active:scale-98 cursor-pointer overflow-hidden border border-emerald-800/60"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-emerald-400/30">
                <Camera className="w-7 h-7 text-emerald-300 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-base tracking-tight">Tomar Foto en Vivo</span>
              <span className="text-xs text-emerald-200/80 mt-1 font-medium">
                Cámara en tiempo real
              </span>
            </button>

            {/* Upload File Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-white text-stone-900 shadow-lg shadow-stone-900/5 hover:shadow-xl hover:shadow-stone-900/10 transition-all duration-200 active:scale-98 cursor-pointer border border-stone-200/90"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-emerald-200/70">
                <Upload className="w-7 h-7 text-emerald-700 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-base tracking-tight">Subir desde Galería</span>
              <span className="text-xs text-stone-500 mt-1 font-medium">
                Fotos o archivos de imagen
              </span>
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Sample specimens carousel for quick testing */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                O explora especímenes de prueba:
              </span>
              <span className="text-[11px] text-stone-600 font-medium">Toca para analizar</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-stone-200 hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all p-2 text-left flex items-center space-x-2.5 active:scale-95 cursor-pointer"
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 pr-1">
                    <p className="text-xs font-bold text-stone-900 truncate leading-snug group-hover:text-emerald-800 transition-colors">
                      {preset.name}
                    </p>
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold mt-0.5 px-1.5 py-0.2 rounded ${
                        preset.category === 'Insectos'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {preset.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scanning / Loading state */}
      {isScanning && selectedImage && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200/90 text-center space-y-5 animate-pulse">
          <div className="relative aspect-video max-w-sm mx-auto rounded-2xl overflow-hidden shadow-inner bg-stone-900">
            <img
              src={selectedImage}
              alt="Analizando muestra"
              className="w-full h-full object-cover opacity-75 blur-xs"
            />
            {/* Visual scanning line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent animate-bounce opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg animate-spin-slow">
                <ScanLine className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-emerald-800 font-bold text-sm bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Analizando espécimen con IA...</span>
            </div>
            <p className="text-xs font-semibold text-stone-600 transition-all duration-300">
              {SCAN_STEPS[scanStepIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isScanning && (
        <div className="bg-amber-50/90 rounded-3xl p-5 border border-amber-200 text-stone-800 space-y-3 shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-900">
                No pudimos completar la identificación
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Intentar con otra foto
            </button>
            {selectedImage && (
              <button
                onClick={() => analyzeImage(selectedImage, selectedMimeType)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reintentar</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result Card Presentation */}
      {result && selectedImage && !isScanning && (
        <div className="space-y-4 animate-fadeIn">
          {/* Action bar to scan another */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Identificar otra especie</span>
            </button>

            <span className="text-[11px] font-medium text-stone-500">
              Identificación botánica & entomológica
            </span>
          </div>

          <SpecimenCard
            result={result}
            imageUrl={selectedImage}
            isSaved={isCurrentSaved}
            onToggleSave={handleToggleSave}
            showSaveButton={true}
          />
        </div>
      )}

      {/* Camera Live Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};
