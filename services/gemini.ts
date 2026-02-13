
import { GoogleGenAI } from "@google/genai";
import { COURSES } from "../constants";

const resolvedApiKey = (() => {
  const metaEnv = (typeof import.meta !== "undefined" ? (import.meta as Record<string, any>)?.env : undefined) ?? {};
  const clientKey = typeof metaEnv.VITE_GEMINI_API_KEY === "string" ? metaEnv.VITE_GEMINI_API_KEY : undefined;
  const serverKey = typeof process !== "undefined" ? process.env?.API_KEY ?? process.env?.GEMINI_API_KEY : undefined;
  return (clientKey ?? serverKey ?? "").trim();
})();

const ai = resolvedApiKey ? new GoogleGenAI({ apiKey: resolvedApiKey }) : null;
const MISSING_API_KEY_MESSAGE = "A Nina não está disponível no momento, mas você pode falar conosco pelos nossos canais oficiais. 🎂";

// Contexto dos workshops
const WORKSHOPS_CONTEXT = `
AGENDA DE CURSOS PRESENCIAIS (WORKSHOPS):
1. Aula Promocional: Bolos de Pote - 15 Out (Caxias) - Restam 3 vagas.
2. Festival de Salgadinhos - 18 Out (Caxias) - 10 vagas.
3. Arco de Balões Orgânico - 05 Nov (Bangu) - ESGOTADO.
4. Confeitaria Iniciante: Chantininho (Bolo) - 10 Nov (Bangu) - 5 vagas.
5. Workshop de Macarons - 22 Out (Campo Grande) - 8 vagas.
6. Panetones Artesanais - 01 Dez (Campo Grande) - 12 vagas.
`;

const ONLINE_COURSES_CONTEXT = COURSES.map(c => `- ${c.title} (${c.category}): ${c.description}`).join('\n');

export async function getPartyAdvice(prompt: string, userName?: string) {
  try {
    if (!ai) {
      console.warn("Gemini API key não encontrada. Assistente em modo offline.");
      return MISSING_API_KEY_MESSAGE;
    }

    const userContext = userName ? `O NOME DO CLIENTE É: ${userName}. Trate-o pelo nome para ser mais pessoal.` : '';

    const systemInstruction = `
      Você é a Nina, a assistente virtual amigável, especialista e entusiasta da 'Sonho da Festa'.
      
      ${userContext}

      SEU TOM DE VOZ:
      - Seja simpática, acolhedora e educada. Use emojis moderadamente (🎂, ✨, 🎈).
      - Responda de forma natural, como uma vendedora atenciosa na loja.
      - Não seja "seca" ou grosseira. Evite respostas monossilábicas.
      - Seja objetiva, mas JAMAIS deixe uma frase incompleta. Termine seu raciocínio.

      DADOS REAIS PARA CONSULTA (Use isso para responder sobre vagas e temas):
      ${WORKSHOPS_CONTEXT}

      CURSOS COMPLETOS/ONLINE:
      ${ONLINE_COURSES_CONTEXT}

      INSTRUÇÃO ESPECÍFICA:
      Se perguntarem sobre vagas de bolo, verifique na lista de WORKSHOPS quais têm relação com bolo/confeitaria e informe a quantidade de vagas e o local.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6, 
        maxOutputTokens: 1000, // Aumentado de 250 para 1000 para evitar cortes
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ops! Tive um pequeno problema técnico aqui na cozinha. Poderia perguntar novamente? 🎂";
  }
}
