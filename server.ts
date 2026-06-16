import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

// Standard ESM / CommonJS robust compatibility
const _filename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
const _dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(_filename);

// Initialize Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
app.use(express.json());

const PORT = 3000;

// JSON schema helper for proposal levels (Checklist de preparación previa del facilitador)
const activitySchema = {
  type: Type.OBJECT,
  properties: {
    name: { 
      type: Type.STRING, 
      description: "Nombre de la actividad creativo y sumamente atractivo en español, relacionado con el reto." 
    },
    description: { 
      type: Type.STRING, 
      description: "Descripción general detallada de la propuesta, su estructura y su propósito, en español." 
    },
    narrative: { 
      type: Type.STRING, 
      description: "Narrativa, metáfora, analogía o contexto de la actividad que motive a los participantes (por ejemplo, '¡Somos científicos recolectando datos en los bosques de altura de Monteverde!')." 
    },
    learningObjectives: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Objetivos de aprendizaje específicos (cognitivas, prácticas, procedimentales y actitudinales)." 
    },
    stemSkills: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Competencias STEM clave que se desarrollan en esta propuesta." 
    },
    requiredMaterials: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Materiales específicos requeridos, adaptados estrictamente al presupuesto y recursos indicados." 
    },
    stepByStep: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Procedimiento paso a paso detallado, secuenciado y cronometrado, adecuado para el nivel educativo indicado." 
    },
    safetyRecommendations: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Normas y recomendaciones de seguridad física, digital o de manejo de equipos durante la sesión." 
    },
    inclusionInclusivity: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Consideraciones para la inclusión: género, adaptaciones de accesibilidad física, cognitiva o adecuación para participantes con distintos ritmos de aprendizaje." 
    },
    evaluationCriteria: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Criterios claros de evaluación formativa, autoevaluación o rúbrica de éxito para medir el logro de objetivos." 
    },
    risksAndMitigation: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Lista de imprevistos comunes en comunidades costarricenses y cómo resolverlos amigablemente." 
    },
    educatorTips: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Recomendaciones pedagógicas, preguntas generadoras y consejos didácticos para los facilitadores o voluntarios." 
    },
    preImplementationChecklist: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Lista de preparación indispensable previa: 1) preparación previa de materiales físicos, 2) pruebas técnicas y de conectividad previas recomendadas, 3) verificaciones de seguridad del aula, 4) requerimientos logísticos de espacio y 5) coordinaciones requeridas con la sede o docentes antes de iniciar." 
    }
  },
  required: [
    "name", "description", "narrative", "learningObjectives", "stemSkills", 
    "requiredMaterials", "stepByStep", "safetyRecommendations", 
    "inclusionInclusivity", "evaluationCriteria", "risksAndMitigation", 
    "educatorTips", "preImplementationChecklist"
  ]
};

// Main proposal schema (all three levels)
const proposalResponseSchema = {
  type: Type.OBJECT,
  properties: {
    conservadora: {
      ...activitySchema,
      description: "Propuesta Conservadora: Máxima factibilidad. Utiliza los materiales más sencillos, de bajo costo, reciclados o cartonera. Requiere mínimo soporte de internet u organización pesada, pero es altamente educativa."
    },
    equilibrada: {
      ...activitySchema,
      description: "Propuesta Equilibrada: Gran balance entre innovación, tecnología de costo moderado (ej. Micro:bit, Arduino, scratch) y viabilidad práctica."
    },
    innovadora: {
      ...activitySchema,
      description: "Propuesta Innovadora: Máxima creatividad vanguardista. Introduce simuladores virtuales, IoT, robótica avanzada (ej. NAO robot, servomotores avanzados, visión artificial) según amerite y sea seguro pedagógicamente."
    }
  },
  required: ["conservadora", "equilibrada", "innovadora"]
};

// Idea suggestions schema for initial cards
const suggestedIdeaSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Título breve, general y sumamente atractivo en español para la idea de actividad (ej. Agricultura Inteligente, Cohetes de Aire)." },
    icon: { type: Type.STRING, description: "Un solo emoji idóneo para la idea (ej: 🚀, 🤖, 🌱, 🌊)." },
    data: {
      type: Type.OBJECT,
      properties: {
        activityType: { type: Type.STRING, description: "Debe ser uno de los tipos de actividad de Robotifest (ej: Retos tecnológicos, Talleres STEM, Estaciones interactivas)." },
        theme: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Lista de 1 a 3 temas STEM generales integrados (ej: Aeroespacial, Internet de las Cosas)." 
        },
        audience: { type: Type.STRING, description: "Rango de público meta (ej: Primaria Alta (10-12 años), Secundaria (13-17 años))." },
        participantsCount: { type: Type.STRING, description: "Formato de grupos (ej: Parejas o tríos, Grupos pequeños)." },
        duration: { type: Type.STRING, description: "Duración aproximada (ej: 2 horas, Medio día)." },
        modality: { type: Type.STRING, description: "Presencial, Virtual o Híbrida." },
        materials: { type: Type.STRING, description: "Lista concisa de materiales genéricos y accesibles (ej: Cartón, sensores de humedad, botellas, microbit)." },
        skills: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Lista de 3 a 5 competencias de desarrollo clave." 
        },
        learningObjectives: { type: Type.STRING, description: "Objetivo instructivo general y reutilizable en español." },
        socialProblem: { type: Type.STRING, description: "Problemática genérica del entorno costarricense o latinoamericano a abordar." }
      },
      required: ["activityType", "theme", "audience", "participantsCount", "duration", "modality", "materials", "skills", "learningObjectives", "socialProblem"]
    }
  },
  required: ["title", "icon", "data"]
};

const suggestedIdeasResponseSchema = {
  type: Type.ARRAY,
  items: suggestedIdeaSchema,
  description: "Un arreglo con exactamente 3 propuestas de ideas iniciales de de diseño instruccional STEM."
};

// API Endpoint to generate proposals
app.post('/api/generate', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Falta la variable de entorno GEMINI_API_KEY. Configure la clave de API en el panel de Secrets de AI Studio." 
      });
    }

    const {
      activityType,
      theme,  // Can be string or string[]
      audience,
      participantsCount,
      duration,
      modality,
      materials,
      skills,
      learningObjectives,
      socialProblem,
      budget, // Optional budget category or description
      detailMode = "detallado"
    } = req.body;

    // Harmonize theme to a string descriptor
    const themeString = Array.isArray(theme) ? theme.join(", ") : (theme || "General (Robótica, Ciencia y Tecnología)");

    // Detail mode specification instructions
    const detailInstruction = detailMode === "rapido"
      ? "MODO RÁPIDO SOLICITADO: Genera propuestas altamente sintetizadas y simplificadas. Las descripciones e hilos de aprendizaje deben ser ágiles, cortos y directos al grano. En los campos de procedimiento ('stepByStep') crea únicamente entre 3 y 4 fases generales. En los campos obligatorios detallados ('safetyRecommendations', 'inclusionInclusivity', 'evaluationCriteria', 'risksAndMitigation', 'educatorTips', 'preImplementationChecklist') escribe únicamente una o dos viñetas muy cortas y resumidas por propuesta para cumplir con el esquema JSON sin sobrecargar el documento."
      : "MODO DETALLADO COMPLETO SOLICITADO: Desarrolla una planificación robusta y de máxima exhaustividad pedagógica. Describe con riqueza literaria, técnica y educativa nacional los objetivos, narrativas, procedimientos (mínimo de 5 a 6 pasos minuciosamente detallados y cronometrados), consideraciones rigurosas de seguridad escolar, inclusión de género y capacidades, rúbrica completa de evaluación, mitigación extensa de imprevistos y una lista de verificación previa ('preImplementationChecklist') con al menos 6 ítems de preparación previa del facilitador.";

    const prompt = `
Actúas como un experto diseñador instruccional STEM de la Universidad de Costa Rica (UCR), adscrito a la Escuela de Ingeniería Industrial, Coordinación Proyecto Robotifest. Tu meta es diseñar tres alternativas pedagógicas (Conservadora, Equilibrada, Innovadora) que se adapten a los requerimientos del usuario y demuestren la Acción Social de la UCR.

NIVEL DE DETALLE REQUERIDO:
${detailInstruction}

DATOS DE ENTRADA:
- Escuela: Escuela de Ingeniería Industrial, Universidad de Costa Rica (UCR)
- Proyecto: Coordinación Proyecto Robotifest
- Tipo de Actividad/Formato: ${activityType || "Reto tecnológico o taller STEM"}
- Temáticas STEM seleccionadas: ${themeString}
- Edad o Nivel Educativo del público meta: ${audience || "Comunidad en general"}
- Cantidad de participantes estimada: ${participantsCount || "Grupos pequeños o individual"}
- Duración disponible: ${duration || "2 horas"}
- Modalidad: ${modality || "Presencial"}
- Presupuesto Disponible: ${budget || "No especificado / Flexible"}
- Materiales y Recursos indicados por el usuario: ${materials || "No especificados (asume recursos básicos según presupuesto)"}
- Competencias STEM clave que se buscan desarrollar: ${skills && skills.length > 0 ? skills.join(", ") : "Pensamiento computacional, trabajo en equipo, resolución de problemas"}
- Objetivos de aprendizaje del organizador: ${learningObjectives || "Aprender fundamentos tecnológicos y aplicarlos con propósito"}
- Problemática costarricense/comunitaria a abordar: ${socialProblem || "Sostenibilidad ambiental, inclusión digital o apoyo comunitario local"}

CRITERIO CRÍTICO DE TRAZABILIDAD (REQUISITOS OBLIGATORIOS DE TEMAS SELECCIONADOS):
Las temáticas STEM indicadas (en este caso: "${themeString}") son REQUISITOS OBLIGATORIOS del diseño instruccional, NO meras referencias opcionales. La propuesta generada DEBE incorporar de manera explícita, profunda y central estas tecnologías específicas en:
1. La Descripción y Narrativa (cómo motivan el reto).
2. Los Materiales Requeridos (deben listar explícitamente el hardware, software, simuladores o herramientas indicadas en las temáticas, por ejemplo, si se elige "Robótica Humanoide (NAO robot)", listar el robot NAO o el simulador Choregraphe, etc.).
3. El Procedimiento Paso a Paso (los participantes deben configurar, interactuar, programar o diseñar directamente con la tecnología seleccionada).
4. Los Entregables y Criterios de Evaluación.
Es una falla crítica de diseño presentar una propuesta que ignore o deje de lado las temáticas seleccionadas por el usuario.

CRITERIOS FILOSÓFICOS DE ROBOTIFEST:
Todas las propuestas deben reflejar explícitamente y de manera transversal la filosofía de Robotifest:
1. Mejora de la calidad de vida y bienestar social.
2. Inclusión amplia de género, diversidad y accesibilidad.
3. Sostenibilidad ambiental activa.
4. Ciudadanía tecnológica: empoderar a las comunidades para que comprendan y controlen la tecnología de forma ética.
5. Atención de necesidades reales en el contexto de Costa Rica o Latinoamérica (por ejemplo, gestión hídrica en Guanacaste, reciclaje de insumos agrícolas en Los Santos, agricultura inteligente en zonas rurales, o reducción de la brecha digital comunitaria).

CRITERIOS DE AJUSTE PEDAGÓGICO SEGÚN EL NIVEL EDUCATIVO:
Debes garantizar una coherencia rigurosa entre el nivel educativo seleccionado y la propuesta generada. ¡No adaptes toscamente una actividad universitaria compleja!
- Primaria Baja (7-9 años): Vocabulario sumamente sencillo, lúdico y de fantasía (juegos de roles, metáforas infantiles). Retos libres de riesgo físico (sensores sin soldaduras, cartón, plastilina conductora, robótica desconectada o juguetes amigables). Pasos muy secuenciados y de corta duración por bloque. Productos directos basados en la observación directa o juego.
- Primaria Alta (10-12 años): Programación lúdica basada en bloques visuales (Scratch, Micro:bit), desafíos cooperativos con roles básicos, dinámicas de 'aprender haciendo', retos físicos de destreza motriz sin riesgos.
- Secundaria (13-17 años): Pensamiento lógico-abstracto formal. Uso de microcontroladores (Arduino, Micro:bit), lógica algorítmica básica e intermedia, diseño e impresión 3D, desafíos de investigación aplicada a problemas reales de su cantón.
- Estudiantes Universitarios / Adultos: Retos de ingeniería aplicada. Programación en código formal (Python, C++), algoritmos complejos, IoT industrial, robótica humanoide (NAO robot), diseño centrado en el usuario, análisis crítico profundo y justificaciones científicas de impacto social.
- Docentes de Primaria/Secundaria: Actividades enfocadas a la creación de unidades didácticas, metodologías activas (ABP, cooperativo), de fácil replicabilidad en aulas reales costarricenses con recursos limitados.

CRITERIOS DE INFLUENCIA DEL PRESUPUESTO:
El parámetro de Presupuesto disponible (${budget}) influye directamente de la siguiente manera:
- Presupuesto Bajo / Escaso: Priorizar materiales de reciclaje, cartón, plástico reutilizable, robótica desconectada (unplugged), simuladores interactivos online gratuitos.
- Presupuesto Medio: Sugerir microcontroladores escolares económicos (Micro:bit, Arduino básico), sensores accesibles de luz u obstáculos, herramientas manuales seguras.
- Presupuesto Alto: Incorporar robótica avanzada (kits LEGO Spike Prime, robótica humanoide como NAO robot), sensores especializados de alta precisión, actuadores industriales, herramientas avanzadas o software especializado.

INSTRUCCIONES CLAVE DE GENERACIÓN:
Genera TRES versiones independientes de la propuesta siguiendo la estructura descrita en el esquema JSON, escritas estrictamente en español natural de Costa Rica, cálido e institucional:
1. Propuesta Conservadora (conservadora): Enfocada en la máxima factibilidad práctica.
2. Propuesta Equilibrada (equilibrada): El punto óptimo de innovación y recursos.
3. Propuesta Innovadora (innovadora): Máxima vanguardia de robótica humanística o simulación (ej: interactuar con un NAO robot, sensado avanzado), manteniendo estricta la viabilidad pedagógica según el público.

Recuerda generar de forma bien estructurada y con descripciones ricas el campo 'preImplementationChecklist' de acuerdo con las 5 dimensiones detalladas en el esquema.
`;

    // We'll use "gemini-3.5-flash" for high efficiency, quality, and structured JSON generation.
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres el Diseñador Pedagógico Principal de Robotifest, Escuela de Ingeniería Industrial, Universidad de Costa Rica (UCR). Solo debes responder en formato JSON que cumpla exactamente la estructura especificada, en idioma español costarricense.",
        responseMimeType: "application/json",
        responseSchema: proposalResponseSchema,
        temperature: 0.8
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se recibió respuesta en texto del modelo de Inteligencia Artificial.");
    }

    try {
      const parsedData = JSON.parse(text.trim());
      res.json(parsedData);
    } catch (parseError) {
      console.error("Error al procesar JSON de Gemini:", parseError);
      console.log("Texto devuelto fue:", text);
      res.status(500).json({ 
        error: "La respuesta generada por la Inteligencia Artificial no tenía un formato JSON válido.", 
        details: text 
      });
    }

  } catch (error: any) {
    console.error("Error en /api/generate:", error);
    res.status(500).json({ 
      error: "Error interno del servidor al procesar la solicitud de diseño con la IA.", 
      details: error.message || error 
    });
  }
});

// NEW API Endpoint to suggest fresh initial ideas (Ideas iniciales generales y reutilizables)
app.post('/api/suggest-ideas', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Falta la variable de entorno GEMINI_API_KEY para generar sugerencias." 
      });
    }

    const prompt = `
Genera exactamente 3 ideas iniciales de actividades STEM de inspiración inspiradas en la metodología de robótica humanista y acción social del proyecto Robotifest de la Universidad de Costa Rica (UCR).

REQUISITOS IMPORTANTES:
1. Las ideas deben ser GENERALES, REUTILIZABLES y sumamente versátiles, de forma que sirvan como puntos de partida sencillos y no como actividades sumamente específicas o complejas.
2. Deben cubrir diferentes niveles educativos (por ejemplo, una de primaria alta, otra de secundaria y otra de comunidad o universitarios).
3. Deben integrar tecnologías emergentes y áreas clave del catálogo: Aeroespacial, Internet de las Cosas (IoT), Robótica Humanoide (NAO robot, etc.), Inteligencia Artificial o energías renovables.
4. Deben estar vinculadas sutilmente a problemas reales del entorno latinoamericano o costarricense de manera positiva y constructiva (ej: ahorro de agua, reciclaje comunal, asistencia a personas de la edad dorada, agricultura eco-sostenible).
5. Debes devolver la respuesta estrictamente bajo el esquema JSON especificado, completamente en español natural costarricense.

Estructura cada una de las 3 sugerencias respetando el esquema suggestedIdeasResponseSchema proporcionado.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres un asesor pedagógico e innovador STEM de Robotifest UCR. Solo produces un archivo JSON adecuado en español que representa un arreglo de exactamente tres ideas iniciales de inspiración general.",
        responseMimeType: "application/json",
        responseSchema: suggestedIdeasResponseSchema,
        temperature: 0.95
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se recibió respuesta interactiva.");
    }

    try {
      const parsedData = JSON.parse(text.trim());
      res.json(parsedData);
    } catch (parseError) {
      console.error("Error parsing suggested ideas JSON:", parseError);
      res.status(500).json({
        error: "Error al descodificar la sugerencia generada.",
        details: text
      });
    }

  } catch (error: any) {
    console.error("Error en /api/suggest-ideas:", error);
    res.status(500).json({
      error: "Error del servidor al buscar ideas nuevas.",
      details: error.message || error
    });
  }
});

// Single-proposal refinement endpoint (Refinamiento interactivo)
app.post('/api/refine', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Falta la variable de entorno GEMINI_API_KEY." 
      });
    }

    const { currentProposal, feedback, levelName } = req.body;

    const prompt = `
Eres un diseñador y asesor pedagógico STEM para Robotifest UCR. El usuario tiene una propuesta de nivel "${levelName}" y quiere refinarla o hacerle un ajuste basado en la siguiente solicitud:

COMENTARIO / PETICIÓN DE REFINE DEL USUARIO:
"${feedback}"

PROPUESTA ACTUAL A AJUSTAR:
${JSON.stringify(currentProposal, null, 2)}

INSTRUCCIONES:
Ajusta la propuesta actual incorporando el feedback del usuario con gran criterio pedagógico, cuidando mantener la coherencia de todos los campos que componen la propuesta (objetivos, materiales, paso a paso, etc.). Responde únicamente con un objeto JSON que siga exactamente el esquema de una propuesta (activitySchema):
- name (Nombre)
- description (Descripción general)
- narrative (Narrativa)
- learningObjectives (Objetivos)
- stemSkills (Competencias)
- requiredMaterials (Materiales)
- stepByStep (Paso a paso)
- safetyRecommendations (Seguridad)
- inclusionInclusivity (Inclusión)
- evaluationCriteria (Evaluación)
- risksAndMitigation (Riesgos y mitigación)
- educatorTips (Tips de educador)
- preImplementationChecklist (Checklist)

Asegúrate de que la respuesta esté estructurada correctamente como este objeto en formato JSON en español.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Solamente genera un objeto JSON en español que represente la propuesta refinada con todos los campos correspondientes.",
        responseMimeType: "application/json",
        responseSchema: activitySchema,
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se recibió respuesta en texto del modelo de Inteligencia Artificial.");
    }

    try {
      const parsedData = JSON.parse(text.trim());
      res.json(parsedData);
    } catch (parseError) {
      console.error("Error parsing refined proposal JSON:", parseError);
      res.status(500).json({ 
        error: "La respuesta de refinamiento no se generó como un JSON válido.", 
        details: text 
      });
    }

  } catch (error: any) {
    console.error("Error en /api/refine:", error);
    res.status(500).json({ 
      error: "Error al refinar la propuesta interactiva.", 
      details: error.message || error 
    });
  }
});

// Setup Asset Pipelines (Development vs Production)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    
    // Serve Vite in dev mode
    app.use(vite.middlewares);
    
    // Fallback for HTML5 routing
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(
          path.resolve(_dirname, 'index.html'),
          'utf-8',
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve production static assets
    app.use(express.static(path.resolve(_dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(_dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

// We need 'fs' to read index.html in dev mode
import fs from 'fs';
startServer().catch((err) => {
  console.error("Failed to start server", err);
});
