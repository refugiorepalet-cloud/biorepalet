export type SpecimenCategory = 'Flores' | 'Insectos';

export interface IdentificationResult {
  commonName: string;
  scientificName: string;
  category: SpecimenCategory;
  type?: string;
  family?: string;
  habitat: string;
  conservationStatus: string;
  fact: string;
  description?: string;
  confidence?: string;
}

export interface Specimen extends IdentificationResult {
  id: string;
  imageData: string; // Base64 data URL or preset URL
  savedAt: number; // Unix timestamp
  notes?: string;
}
