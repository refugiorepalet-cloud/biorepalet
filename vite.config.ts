import 'dotenv/config';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { GoogleGenAI, Type } from '@google/genai';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-identify-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Redirect root request to base path
        if (req.url === '/' || req.url === '/index.html') {
          res.writeHead(302, { Location: '/biorepalet/' });
          res.end();
          return;
        }

        const isIdentifyRoute =
          req.url === '/api/identify' ||
          req.url === '/biorepalet/api/identify' ||
          req.url?.startsWith('/api/identify?') ||
          req.url?.startsWith('/biorepalet/api/identify?');

        if (isIdentifyRoute && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const { imageBase64, mimeType = 'image/jpeg' } = JSON.parse(body || '{}');

              if (!imageBase64) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Image base64 data is required.' }));
                return;
              }

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    error: 'GEMINI_API_KEY is not configured on the server.',
                  })
                );
                return;
              }

              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              // Clean base64 string if it contains data URI prefix
              const rawBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
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
              const parsed = JSON.parse(text);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(parsed));
            } catch (err: unknown) {
              const errorMessage = err instanceof Error ? err.message : String(err);
              console.error('Error in /api/identify:', errorMessage);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  error: 'Identification failed: ' + errorMessage,
                })
              );
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/biorepalet/',
    plugins: [geminiApiPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
