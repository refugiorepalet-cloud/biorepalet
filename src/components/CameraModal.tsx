import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasError, setHasError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Start camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    setIsStarting(true);
    setHasError(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      console.warn('Camera access error:', err);
      setHasError(
        'No se pudo acceder a la cámara en vivo. Asegúrate de conceder permisos o usa la opción de subir foto.'
      );
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  const switchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Stop stream and close
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    onCapture(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 select-none">
      {/* Top Header controls */}
      <div className="flex items-center justify-between text-white pt-2 px-2 z-10">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm tracking-wide">Cámara Botánica en Vivo</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Viewfinder area */}
      <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden rounded-3xl bg-stone-950 border border-stone-800">
        {hasError ? (
          <div className="max-w-xs text-center p-6 bg-stone-900/90 rounded-2xl border border-red-500/30 text-stone-200">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-sm font-medium mb-4">{hasError}</p>
            <button
              onClick={() => startCamera(facingMode)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-white font-semibold text-xs transition-all cursor-pointer"
            >
              Reintentar permiso
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />

            {/* Botanical viewfinder target framing */}
            <div className="absolute inset-8 pointer-events-none flex flex-col justify-between items-center">
              <div className="w-full flex justify-between">
                <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
              </div>

              <div className="text-center bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-emerald-300 text-xs font-medium border border-emerald-500/30">
                Centra la flor, hoja o insecto
              </div>

              <div className="w-full flex justify-between">
                <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Bottom Shutter Controls */}
      <div className="flex items-center justify-around pb-6 pt-2 z-10 max-w-sm mx-auto w-full">
        {/* Switch camera button */}
        <button
          onClick={switchCamera}
          disabled={!!hasError || isStarting}
          className="p-3.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-white transition-all active:scale-90 disabled:opacity-40 cursor-pointer"
          title="Cambiar cámara frontal/trasera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* Big Shutter button */}
        <button
          onClick={handleCapture}
          disabled={!!hasError || isStarting}
          className="relative group p-1.5 rounded-full bg-stone-100 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-40 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full border-4 border-stone-900 bg-emerald-500 group-hover:bg-emerald-400 flex items-center justify-center transition-colors">
            <div className="w-6 h-6 rounded-full bg-white shadow-sm" />
          </div>
        </button>

        {/* Spacer for symmetry */}
        <div className="w-12 h-12" />
      </div>
    </div>
  );
};
