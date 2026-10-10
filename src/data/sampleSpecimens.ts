import { Specimen, IdentificationResult } from '../types';

export interface SamplePreset {
  id: string;
  name: string;
  category: 'Flores' | 'Insectos';
  imageUrl: string;
  result: IdentificationResult;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'preset-monarch',
    name: 'Mariposa Monarca',
    category: 'Insectos',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    result: {
      commonName: 'Mariposa Monarca',
      scientificName: 'Danaus plexippus',
      category: 'Insectos',
      type: 'Lepidóptero ninfálido',
      family: 'Nymphalidae',
      habitat: 'Bosques de oyamel en Michoacán (México), praderas y jardines florales de América del Norte.',
      conservationStatus: 'En Peligro (EN) - Lista Roja IUCN',
      fact: 'Realizan una colosal migración transcontinental de más de 4.000 kilómetros. Sorprendentemente, ninguna mariposa individual hace el viaje completo de ida y vuelta; requiere cuatro generaciones consecutivas para completarlo.',
      description: 'Alas de color naranja vibrante delineadas con bordes negros salpicados de puntos blancos. Poseen un vuelo planeador característico y orugas que se alimentan exclusivamente de asclepias (algodoncillos).',
      confidence: '99%'
    }
  },
  {
    id: 'preset-orchid',
    name: 'Orquídea Mariposa',
    category: 'Flores',
    imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80',
    result: {
      commonName: 'Orquídea Mariposa (Phalaenopsis)',
      scientificName: 'Phalaenopsis amabilis',
      category: 'Flores',
      type: 'Planta epífita monocotiledónea',
      family: 'Orchidaceae',
      habitat: 'Selvas tropicales húmedas del sudeste asiático y norte de Australia, creciendo adherida a troncos y cortezas arbóreas.',
      conservationStatus: 'Preocupación Menor (LC)',
      fact: 'A diferencia de la mayoría de plantas terrestres, sus raíces son verdes y fotosintéticas. En su hábitat natural, absorben la humedad y los nutrientes directamente del aire neblinoso de la canopia tropical.',
      description: 'Pétalos aterciopelados dispuestos de manera simétrica semejando una mariposa en reposo. Labelo central con tonalidades amarillas y rojizas que sirven de pista de aterrizaje para polinizadores.',
      confidence: '98%'
    }
  },
  {
    id: 'preset-beetle',
    name: 'Escarabajo Rinoceronte',
    category: 'Insectos',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    result: {
      commonName: 'Escarabajo Rinoceronte Europeo',
      scientificName: 'Oryctes nasicornis',
      category: 'Insectos',
      type: 'Coleóptero escarabeido',
      family: 'Scarabaeidae',
      habitat: 'Bosques caducifolios de robles y hayas, leños en descomposición y montones de materia orgánica de Europa y cuenca mediterránea.',
      conservationStatus: 'Preocupación Menor (LC)',
      fact: 'Es uno de los seres más fuertes del planeta en relación a su peso: los machos pueden levantar hasta 850 veces su propia masa corporal con su cuerno cefálico curvado.',
      description: 'Exoesqueleto quitinoso de color castaño brillante o caoba. Los machos poseen un formidable cuerno recurvado sobre la cabeza que utilizan en rituales de combate por territorio y apareamiento.',
      confidence: '97%'
    }
  },
  {
    id: 'preset-lotus',
    name: 'Flor de Loto Sagrado',
    category: 'Flores',
    imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80',
    result: {
      commonName: 'Flor de Loto Sagrado',
      scientificName: 'Nelumbo nucifera',
      category: 'Flores',
      type: 'Planta acuática enraizada',
      family: 'Nelumbonaceae',
      habitat: 'Lagos templados, estanques lentos y humedales de Asia y Australia oriental.',
      conservationStatus: 'Preocupación Menor (LC)',
      fact: 'Sus hojas poseen una nanoestructura hidrofóbica que inspiró la nanotecnología del "Efecto Loto": las gotas de agua ruedan limpiando el polvo por completo. Sus semillas pueden germinar incluso tras más de 1.000 años de letargo.',
      description: 'Flores flotantes de pétalos rosados y blancos que se abren con la luz del alba. Centro floral coronado por un receptáculo cónico amarillo perforado característico.',
      confidence: '99%'
    }
  },
  {
    id: 'preset-bee',
    name: 'Abeja Melífera',
    category: 'Insectos',
    imageUrl: 'https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&w=800&q=80',
    result: {
      commonName: 'Abeja Melífera Occidental',
      scientificName: 'Apis mellifera',
      category: 'Insectos',
      type: 'Himenóptero social',
      family: 'Apidae',
      habitat: 'Praderas, vergeles agrícolas, laderas floridas y colmenas en casi todos los continentes habitados.',
      conservationStatus: 'Preocupación Menor (LC)',
      fact: 'Se comunican la ubicación exacta de fuentes de néctar a kilómetros de distancia mediante la "danza del ocho" (waggle dance), calculando el ángulo relativo respecto al sol y la distancia por vibración.',
      description: 'Cuerpo cubierto de vellosidades doradas que retienen granos de polen electrostáticamente, con cestillas especializadas (corbículas) en sus patas traseras para transporte.',
      confidence: '98%'
    }
  },
  {
    id: 'preset-sunflower',
    name: 'Girasol Silvestre',
    category: 'Flores',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    result: {
      commonName: 'Girasol Común',
      scientificName: 'Helianthus annuus',
      category: 'Flores',
      type: 'Planta anual herbácea',
      family: 'Asteraceae',
      habitat: 'Llanuras abiertas, campos soleados y pastizales nativos de Norteamérica, cultivada globalmente.',
      conservationStatus: 'Preocupación Menor (LC)',
      fact: 'El fenómeno del heliotropismo (seguir al sol de este a oeste) solo ocurre en brotes jóvenes; una vez maduran, las flores quedan permanentemente orientadas hacia el este para calentarse más rápido al amanecer y atraer más abejas.',
      description: 'No es una sola flor, sino una pseudoinflorescencia compuesta por cientos de diminutas flores tubulares oscuras en el disco central rodeadas por lígulas amarillas radiantes.',
      confidence: '99%'
    }
  }
];

export const INITIAL_COLLECTION_ITEMS: Specimen[] = [
  {
    ...SAMPLE_PRESETS[0].result,
    id: 'specimen-seed-1',
    imageData: SAMPLE_PRESETS[0].imageUrl,
    savedAt: Date.now() - 1000 * 60 * 60 * 18,
    notes: 'Observada en jardín botánico.'
  },
  {
    ...SAMPLE_PRESETS[1].result,
    id: 'specimen-seed-2',
    imageData: SAMPLE_PRESETS[1].imageUrl,
    savedAt: Date.now() - 1000 * 60 * 60 * 48,
    notes: 'Espécimen epífito en orquidario tropical.'
  }
];
