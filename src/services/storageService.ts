import { Specimen } from '../types';
import { INITIAL_COLLECTION_ITEMS } from '../data/sampleSpecimens';

const STORAGE_KEY = 'biorepalet_specimens_v1';
const FIRST_VISIT_KEY = 'biorepalet_has_initialized_v1';

export function getSavedSpecimens(): Specimen[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: Seed with initial educational specimens so user sees a vibrant gallery
      const hasInitialized = localStorage.getItem(FIRST_VISIT_KEY);
      if (!hasInitialized) {
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
        saveAllSpecimens(INITIAL_COLLECTION_ITEMS);
        return INITIAL_COLLECTION_ITEMS;
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load specimens from LocalStorage', err);
    return [];
  }
}

export function saveAllSpecimens(items: Specimen[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('biorepalet_storage_updated'));
  } catch (err) {
    console.error('Failed to save specimens to LocalStorage', err);
  }
}

export function saveSpecimen(specimen: Specimen): boolean {
  try {
    const current = getSavedSpecimens();
    // Check if duplicate exists by ID or by same scientific name + category
    const existingIndex = current.findIndex(
      (item) => item.id === specimen.id || (item.scientificName === specimen.scientificName && item.category === specimen.category)
    );

    if (existingIndex >= 0) {
      // Update existing
      current[existingIndex] = { ...current[existingIndex], ...specimen, savedAt: Date.now() };
    } else {
      current.unshift(specimen);
    }
    saveAllSpecimens(current);
    return true;
  } catch (err) {
    console.error('Failed to save specimen', err);
    return false;
  }
}

export function removeSpecimen(id: string): void {
  const current = getSavedSpecimens();
  const filtered = current.filter((item) => item.id !== id);
  saveAllSpecimens(filtered);
}

export function isSpecimenSaved(scientificName: string): boolean {
  if (!scientificName) return false;
  const current = getSavedSpecimens();
  return current.some(
    (item) => item.scientificName.trim().toLowerCase() === scientificName.trim().toLowerCase()
  );
}

export function getSpecimenByScientificName(scientificName: string): Specimen | undefined {
  if (!scientificName) return undefined;
  const current = getSavedSpecimens();
  return current.find(
    (item) => item.scientificName.trim().toLowerCase() === scientificName.trim().toLowerCase()
  );
}

export function resetToSampleCollection(): Specimen[] {
  saveAllSpecimens(INITIAL_COLLECTION_ITEMS);
  return INITIAL_COLLECTION_ITEMS;
}

export function clearAllSpecimens(): void {
  saveAllSpecimens([]);
}
