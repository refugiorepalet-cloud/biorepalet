import { GoogleGenAI, Type } from '@google/genai';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg' } = await req.json().catch(() => ({}));

    if (!imageBase64) {
      return json({ error: 'Image base64 data is required.' }, 400);
    }

    const ai = new GoogleGenAI({});

    // Clean base64 string if it contains data URI prefix
    const rawBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: rawBase64,
            },
          },
          {
            text: `You are an expert botanist and entomologist. Analyze this image to identify the flower, plant, or insect.
Return accurate biological information in Spanish.
Ensure the category is strictly either "Flores" (if it is a flower, plant, tree, or fungi) or "Insectos" (if it is an insect, arachnid, butterfly, or arthropod).
Be precise with scientific and common names, habitat details, IUCN conservation status, and a fascinating, lesser-known curious fact.`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonName: {
              type: Type.STRING,
              description: 'Common name of the species in Spanish',
            },
            scientificName: {
              type: Type.STRING,
              description: 'Scientific binomial or taxonomic name in Latin',
            },
            category: {
              type: Type.STRING,
              enum: ['Flores', 'Insectos'],
              description: 'Must be "Flores" or "Insectos"',
            },
            type: {
              type: Type.STRING,
              description: 'Subtype (e.g., Flor silvestre, Lepidóptero, Coleóptero, Planta suculenta)',
            },
            family: {
              type: Type.STRING,
              description: 'Biological family (e.g., Orchidaceae, Nymphalidae)',
            },
            habitat: {
              type: Type.STRING,
              description: 'Natural habitat, climate preferences, and native geographical distribution',
            },
            conservationStatus: {
              type: Type.STRING,
              description: 'IUCN Red List status (e.g., Preocupación Menor (LC), Vulnerable (VU), En Peligro (EN), Casi Amenazado (NT))',
            },
            fact: {
              type: Type.STRING,
              description: 'A fascinating, surprising, and biologically accurate fact about this specimen',
            },
            description: {
              type: Type.STRING,
              description: 'Brief anatomical or botanical description of its distinctive visual traits',
            },
            confidence: {
              type: Type.STRING,
              description: 'Identification confidence percentage estimate (e.g., 95%)',
            },
          },
          required: [
            'commonName',
            'scientificName',
            'category',
            'habitat',
            'conservationStatus',
            'fact',
          ],
        },
      },
    });

    const text = response.text || '{}';
    return json(JSON.parse(text));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error in /api/identify:', errorMessage);
    return json({ error: 'Identification failed: ' + errorMessage }, 500);
  }
};

export const config = {
  path: '/api/identify',
};
