import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Sparkles, 
  Settings, 
  Wrench, 
  Users, 
  Clock, 
  Layers, 
  CheckSquare, 
  AlertTriangle, 
  Printer, 
  BookOpen, 
  ArrowRight, 
  Send, 
  Download, 
  RefreshCw, 
  Award, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookmarkCheck, 
  Flame, 
  Plus, 
  X, 
  MapPin, 
  Lightbulb,
  HeartHandshake,
  Coins,
  Cpu
} from 'lucide-react';

// Define TS Interfaces for Activity Proposals
interface ActivityProposal {
  name: string;
  description: string;
  narrative: string;
  learningObjectives: string[];
  stemSkills: string[];
  requiredMaterials: string[];
  stepByStep: string[];
  safetyRecommendations: string[];
  inclusionInclusivity: string[];
  evaluationCriteria: string[];
  risksAndMitigation: string[];
  educatorTips: string[];
  preImplementationChecklist: string[];
}

interface TripleProposal {
  conservadora: ActivityProposal;
  equilibrada: ActivityProposal;
  innovadora: ActivityProposal;
}

// Reusable, general, adaptable ideas (Ideas iniciales) matching UCR and Robotifest
const INITIAL_PRESETS = [
  {
    title: "Monitoreo de Humedad Comunitaria",
    icon: "💧",
    data: {
      activityType: "Retos tecnológicos",
      theme: ["Internet de las Cosas (IoT)", "Energías Renovables"],
      audience: "Secundaria (13-17 años)",
      participantsCount: "Parejas o tríos",
      duration: "2 horas",
      modality: "Presencial",
      materials: "Sensor de humedad analógico, Micro:bit o Arduino, Cables de conexión, Muestras de tierra",
      skills: ["Pensamiento computacional", "Trabajo en equipo", "Resolución de problemas"],
      learningObjectives: "Comprender el funcionamiento de sensores físicos para medir la humedad en entornos agrícolas costarricenses.",
      socialProblem: "Optimización del recurso hídrico en áreas propensas a sequía en comunidades de Costa Rica.",
      budget: "Bajo (Materiales reciclables, cartón, costo nulo)"
    }
  },
  {
    title: "Asistente Lúdico Cognitivo con NAO",
    icon: "🤖",
    data: {
      activityType: "Talleres STEM",
      theme: ["Robótica Humanoide (NAO robot)", "Inteligencia Artificial"],
      audience: "Estudiantes Universitarios",
      participantsCount: "Grupos pequeños (4-6)",
      duration: "Medio día",
      modality: "Presencial",
      materials: "Robot NAO (o simulador de software libre), Laptop, Entorno gráfico de programación",
      skills: ["Empatía y Diseño Humano", "Pensamiento crítico", "Comunicación efectiva"],
      learningObjectives: "Desarrollar una rutina interactiva de recordatorios o juegos lúdicos aplicando lógica de robótica móvil.",
      socialProblem: "Falta de herramientas de recreación cognitiva activa para el adulto mayor en Costa Rica.",
      budget: "Alto (Sensores avanzados, NAO robot, LEGO Spike Prime, equipamiento técnico)"
    }
  },
  {
    title: "Sistemas Limpios Aeroespaciales",
    icon: "🚀",
    data: {
      activityType: "Estaciones interactivas",
      theme: ["Aeroespacial y Cohetería", "Ciencias Básicas Aplicadas"],
      audience: "Primaria Alta (10-12 años)",
      participantsCount: "Individual",
      duration: "1 hora",
      modality: "Presencial",
      materials: "Botellas de plástico reutilizadas, corchos, inflador de bicicleta, agua, cartón de desecho",
      skills: ["Lógica matemática", "Creatividad", "Pensamiento crítico"],
      learningObjectives: "Explorar conceptos de aerodinámica e impulso físico mediante la experimentación práctica con propulsión por aire comprimido.",
      socialProblem: "Incentivar la imaginación científica respecto a métodos de transporte carbono-neutrales en zonas rurales.",
      budget: "Bajo (Materiales reciclables, cartón, costo nulo)"
    }
  }
];

// Complete list of available STEM areas (catálogo de tecnologías emergentes)
const STEM_CATEGORIES = [
  "Robótica Humanoide (NAO robot)",
  "Internet de las Cosas (IoT)",
  "Aeroespacial y Cohetería",
  "Inteligencia Artificial",
  "Mecánica Básica y Engranajes",
  "Programación y Algoritmos",
  "Diseño e Impresión 3D",
  "Energías Renovables",
  "Biomimética y Biotecnología",
  "Electrónica Creativa",
  "Telecomunicaciones",
  "Ciencias Básicas Aplicadas"
];

// Complete list of UCR activity formats
const ACTIVITY_TYPES = [
  "Retos tecnológicos",
  "Talleres STEM",
  "Estaciones interactivas",
  "Charlas",
  "Conversatorios",
  "Conversatorios tipo competencia o desafío",
  "Paneles de discusión",
  "Experiencias inmersivas",
  "Actividades de divulgación científica",
  "Actividades para docentes",
  "Actividades comunitarias"
];

// Budget options definitions
const BUDGET_OPTIONS = [
  "Bajo (Materiales reciclables, cartón, costo nulo)",
  "Medio (Kits robóticos estándar, Micro:bit, Arduino)",
  "Alto (Sensores avanzados, NAO robot, LEGO Spike Prime, equipamiento técnico)"
];

export default function App() {
  // Input states - multiple themes matching
  const [activityType, setActivityType] = useState('Retos tecnológicos');
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['Internet de las Cosas (IoT)']);
  const [audience, setAudience] = useState('Secundaria (13-17 años)');
  const [participantsCount, setParticipantsCount] = useState('Grupos pequeños (4-6)');
  const [duration, setDuration] = useState('2 horas');
  const [modality, setModality] = useState('Presencial');
  const [materials, setMaterials] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [socialProblem, setSocialProblem] = useState('');
  const [budget, setBudget] = useState('Bajo (Materiales reciclables, cartón, costo nulo)');
  
  // Custom skills selection
  const [skills, setSkills] = useState<string[]>([
    'Pensamiento computacional',
    'Trabajo en equipo',
    'Resolución de problemas',
    'Creatividad'
  ]);

  const availableSkills = [
    'Pensamiento computacional',
    'Trabajo en equipo',
    'Resolución de problemas',
    'Creatividad',
    'Pensamiento crítico',
    'Lógica matemática',
    'Empatía y Diseño Humano',
    'Comunicación efectiva'
  ];

  // Ideas iniciales dynamic list state
  const [presets, setPresets] = useState(INITIAL_PRESETS);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // App logical states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposals, setProposals] = useState<TripleProposal | null>(null);
  const [activeLevel, setActiveLevel] = useState<'conservadora' | 'equilibrada' | 'innovadora'>('equilibrada');
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0);

  // Proposal detail level and preset collapsible visibility state
  const [detailMode, setDetailMode] = useState<'rapido' | 'detallado'>('detallado');
  const [isPresetsExpanded, setIsPresetsExpanded] = useState(true);

  // Checklist interactiva local por propuesta para ayudar a facilitadores
  const [checklistChecked, setChecklistChecked] = useState<{ [key: string]: boolean }>({});
  const [stepsCompleted, setStepsCompleted] = useState<{ [key: string]: boolean }>({});

  // Chat-refinement interactive states for tweaking suggestions
  const [feedbackText, setFeedbackText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refinementHistory, setRefinementHistory] = useState<{
    [key in 'conservadora' | 'equilibrada' | 'innovadora']?: string[];
  }>({});

  // STEM Inspiring Quotes for Costa Rican teachers
  const loadingQuotes = [
    "«La tecnología debe estar al servicio de la gente». — Acción Social UCR",
    "Estableciendo analogías pedagógicas con café, humedales, manglares y ríos de Costa Rica...",
    "Estructurando rúbricas de éxito acordes con el Pensamiento Computacional e inclusión...",
    "Diseñando la propuesta Conservadora orientada a la máxima factibilidad cartonera...",
    "Equilibrando la propuesta de tecnologías intermedias y viabilidad escolar real...",
    "Generando la propuesta Innovadora con sensores avanzados y robótica humanística...",
    "Alineando el reto con el marco pedagógico de Robotifest de la Universidad de Costa Rica..."
  ];

  // Rotate quotes during loading
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setLoadingQuoteIndex((prev) => (prev + 1) % loadingQuotes.length);
      }, 5000);
    } else {
      setLoadingQuoteIndex(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  // Load from LocalStorage if available
  useEffect(() => {
    const cached = localStorage.getItem('robotifest_activity_designer_data');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setProposals(parsed.proposals);
        setActiveLevel(parsed.activeLevel || 'equilibrada');
        if (parsed.detailMode) setDetailMode(parsed.detailMode);
        setIsPresetsExpanded(false); // Collapse presets if we have saved designs
      } catch (e) {
        console.error("Error cargando caché local:", e);
      }
    }
  }, []);

  // Save to LocalStorage when proposals change
  const saveToLocalStorage = (data: TripleProposal, level: typeof activeLevel, mode: typeof detailMode) => {
    localStorage.setItem('robotifest_activity_designer_data', JSON.stringify({
      proposals: data,
      activeLevel: level,
      detailMode: mode
    }));
  };

  const handleToggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleToggleTheme = (themeName: string) => {
    if (selectedThemes.includes(themeName)) {
      setSelectedThemes(selectedThemes.filter(t => t !== themeName));
    } else {
      setSelectedThemes([...selectedThemes, themeName]);
    }
  };

  const handleSuggestIdeas = async () => {
    setIsSuggesting(true);
    setError(null);
    try {
      const response = await fetch('/api/suggest-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('No se pudo establecer conexión para sugerencias.');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (Array.isArray(data) && data.length > 0) {
        setPresets(data);
      }
    } catch (e: any) {
      console.error("Error al generar sugerencias:", e);
      setError(`No se pudieron generar nuevas ideas sugeridas: ${e.message || e}`);
    } finally {
      setIsSuggesting(false);
    }
  };

  const applyPreset = (preset: typeof INITIAL_PRESETS[number]) => {
    setActivityType(preset.data.activityType);
    setSelectedThemes(Array.isArray(preset.data.theme) ? preset.data.theme : [preset.data.theme as string]);
    setAudience(preset.data.audience);
    setParticipantsCount(preset.data.participantsCount);
    setDuration(preset.data.duration);
    setModality(preset.data.modality);
    setMaterials(preset.data.materials);
    setSkills(preset.data.skills);
    setLearningObjectives(preset.data.learningObjectives);
    setSocialProblem(preset.data.socialProblem);
    setBudget(preset.data.budget || 'Bajo (Materiales reciclables, cartón, costo nulo)');
    
    // Smooth scroll to form fields
    const configPanel = document.getElementById('configurator-panel');
    if (configPanel) {
      configPanel.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setChecklistChecked({});
    setStepsCompleted({});
    setRefinementHistory({});

    // Enforce selection of at least one theme
    if (selectedThemes.length === 0) {
      setError("Por favor, seleccione al menos una temática STEM para su actividad.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityType,
          theme: selectedThemes,
          audience,
          participantsCount,
          duration,
          modality,
          materials,
          skills,
          learningObjectives,
          socialProblem,
          budget,
          detailMode // Send required detail mode
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: Sucedió el código ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setProposals(data);
      setActiveLevel('equilibrada'); // Default focus
      setIsPresetsExpanded(false); // Collapse presets automatically upon generation
      saveToLocalStorage(data, 'equilibrada', detailMode);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Se produjo un error al generar las propuestas. Intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!feedbackText.trim() || !proposals) return;
    setIsRefining(true);
    setError(null);

    const currentProposal = proposals[activeLevel];

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentProposal,
          feedback: feedbackText,
          levelName: activeLevel === 'conservadora' ? 'Conservadora' : activeLevel === 'equilibrada' ? 'Equilibrada' : 'Innovadora'
        }),
      });

      if (!response.ok) {
        throw new Error(`Error de refinamiento: ${response.status}`);
      }

      const updatedProposalObj = await response.json();
      if (updatedProposalObj.error) {
        throw new Error(updatedProposalObj.error);
      }

      // Merge updated proposal back into full state
      const updatedProposals = {
        ...proposals,
        [activeLevel]: updatedProposalObj
      };

      // Add feedback to history check list
      const levelHistory = refinementHistory[activeLevel] || [];
      const updatedHistory = {
        ...refinementHistory,
        [activeLevel]: [...levelHistory, feedbackText]
      };

      setProposals(updatedProposals);
      setRefinementHistory(updatedHistory);
      setFeedbackText('');
      
      // Clear interactive checklist since design updated
      const prefix = `${activeLevel}-`;
      const cleanedChecklist = Object.keys(checklistChecked)
        .filter(k => !k.startsWith(prefix))
        .reduce((acc, cur) => ({ ...acc, [cur]: checklistChecked[cur] }), {});
      setChecklistChecked(cleanedChecklist);

      // Save locally
      saveToLocalStorage(updatedProposals, activeLevel, detailMode);
    } catch (err: any) {
      console.error(err);
      setError(`Error en el ajuste: ${err.message || err}`);
    } finally {
      setIsRefining(false);
    }
  };

  const copyProposalMarkdown = () => {
    if (!proposals) return;
    const prop = proposals[activeLevel];
    const levelTitle = activeLevel === 'conservadora' ? 'CONSERVADORA' : activeLevel === 'equilibrada' ? 'EQUILIBRADA' : 'INNOVADORA';
    
    const markdown = `
# ${prop.name}
*Versión Propuesta: ${levelTitle}*
*Diseñado con Robotifest Challenge & Activity Designer*

## Descripción General
${prop.description}

## Narrativa o Contexto de Aprendizaje
> ${prop.narrative}

## Objetivos de Aprendizaje
${prop.learningObjectives.map(obj => `- ${obj}`).join('\n')}

## Competencias STEM Desarrolladas
${prop.stemSkills.map(s => `- ${s}`).join('\n')}

## Materiales Requeridos
${prop.requiredMaterials.map(m => `- ${m}`).join('\n')}

## Procedimiento Paso a Paso
${prop.stepByStep.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

## Recomendaciones de Seguridad
${prop.safetyRecommendations.map(s => `- ${s}`).join('\n')}

## Inclusión y Accesibilidad
${prop.inclusionInclusivity.map(i => `- ${i}`).join('\n')}

## Criterios de Evaluación / Éxito
${prop.evaluationCriteria.map(e => `- ${e}`).join('\n')}

## Riesgos y Mitigación
${prop.risksAndMitigation.map(r => `- ${r}`).join('\n')}

## Consejos del Facilitador
${prop.educatorTips.map(t => `- ${t}`).join('\n')}

## Checklist de Implementación
${prop.preImplementationChecklist.map(c => `- [ ] ${c}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(markdown)
      .then(() => alert("¡Propuesta copiada en formato Markdown en tu portapapeles!"))
      .catch((e) => alert("Error al copiar texto: " + e));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (window.confirm("¿Estás seguro de que deseas restablecer el diseñador? Se borrarán las propuestas actuales.")) {
      setProposals(null);
      setChecklistChecked({});
      setStepsCompleted({});
      setRefinementHistory({});
      localStorage.removeItem('robotifest_activity_designer_data');
    }
  };

  const downloadTextFile = () => {
    if (!proposals) return;
    const prop = proposals[activeLevel];
    const levelTitle = activeLevel === 'conservadora' ? 'Conservadora' : activeLevel === 'equilibrada' ? 'Equilibrada' : 'Innovadora';
    
    const content = `
ROBOTIFEST CHALLENGE & ACTIVITY DESIGNER (UCR - Acción Social)
========================================================================
Propuesta: ${levelTitle.toUpperCase()}
Actividad: ${prop.name}
------------------------------------------------------------------------

Descripción General:
${prop.description}

Narrativa y contexto motivacional:
${prop.narrative}

Objetivos de aprendizaje:
${prop.learningObjectives.map((o, i) => `${i+1}. ${o}`).join('\n')}

Competencias STEM clave:
${prop.stemSkills.map(s => `- ${s}`).join('\n')}

Materiales requeridos:
${prop.requiredMaterials.map(m => `- ${m}`).join('\n')}

Paso a paso detallado:
${prop.stepByStep.map((s, i) => `[Paso ${i+1}] ${s}`).join('\n')}

Recomendaciones de seguridad:
${prop.safetyRecommendations.map(s => `- ${s}`).join('\n')}

Inclusión y Accesibilidad:
${prop.inclusionInclusivity.map(i => `- ${i}`).join('\n')}

Rúbrica / Criterios de evaluación:
${prop.evaluationCriteria.map(e => `- ${e}`).join('\n')}

Riesgos y planes de mitigación:
${prop.risksAndMitigation.map(r => `- ${r}`).join('\n')}

Consejos pedagógicos para facilitadores:
${prop.educatorTips.map(t => `- ${t}`).join('\n')}

Checklist previo al día de la actividad:
${prop.preImplementationChecklist.map((c, i) => `[ ] Checklist ${i+1}: ${c}`).join('\n')}

========================================================================
Diseñado interactivamente de forma digital con Inteligencia Artificial.
Robotifest - Universidad de Costa Rica.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Robotifest_Reto_${prop.name.replace(/\s+/g, "_")}_${levelTitle}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDFFile = () => {
    if (!proposals) return;
    const prop = proposals[activeLevel];
    const levelTitle = activeLevel === 'conservadora' ? 'Conservadora' : activeLevel === 'equilibrada' ? 'Equilibrada' : 'Innovadora';
    
    // Create jsPDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let pageNumber = 1;
    const marginX = 20;
    const pageWidth = 210;
    const contentWidth = pageWidth - (marginX * 2); // 170mm
    let y = 20;

    // Helper to draw UCR / Robotifest Header Decoration on each page
    const drawPageHeader = (pNum: number) => {
      // Top colored bar
      doc.setFillColor(0, 93, 164); // UCR Blue (#005DA4)
      doc.rect(0, 0, pageWidth, 5, 'F');
      
      doc.setFillColor(0, 166, 206); // Robotifest Cyan (#00A6CE)
      doc.rect(0, 5, pageWidth, 1.5, 'F');

      // Header branding text
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(0, 93, 164); // UCR Blue
      doc.text("UNIVERSIDAD DE COSTA RICA • ESCUELA DE INGENIERÍA INDUSTRIAL", marginX, 13);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(110, 120, 130);
      doc.text("COORDINACIÓN PROYECTO ROBOTIFEST — PLANIFICACIÓN PEDAGÓGICA STEM UCR", marginX, 17);
      
      // Bottom thin line for header
      doc.setDrawColor(220, 225, 230);
      doc.setLineWidth(0.3);
      doc.line(marginX, 19, pageWidth - marginX, 19);

      // Footer
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(110, 120, 130);
      doc.text("Proyecto Robotifest - Acción Social UCR (Planificador Pedagógico)", marginX, 285);
      doc.text(`Página ${pNum}`, pageWidth - marginX - 10, 285);
      
      // Secondary thin line for footer
      doc.setDrawColor(220, 225, 230);
      doc.line(marginX, 281, pageWidth - marginX, 281);
    };

    // Helper to check page overflow and add a new page
    const ensureSpace = (height: number) => {
      if (y + height > 270) {
        doc.addPage();
        pageNumber++;
        drawPageHeader(pageNumber);
        y = 26; // reset y on new page
      }
    };

    // Draw initial header for page 1
    drawPageHeader(pageNumber);
    y = 28;

    // Title Block
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59); // Dark slate
    const titleLines = doc.splitTextToSize(prop.name, contentWidth);
    doc.text(titleLines, marginX, y);
    y += (titleLines.length * 6.0) + 3;

    // Subtitle & Level
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 93, 164); // UCR Blue
    const themeStr = selectedThemes.join(", ") || "General STEM";
    const levelLabel = `Nivel: ${levelTitle} • Temas: ${themeStr} • Detalle: ${detailMode === 'rapido' ? 'MODO RÁPIDO' : 'MODO DETALLADO'}`;
    doc.text(levelLabel.toUpperCase(), marginX, y);
    y += 5;

    // Line Spacer
    doc.setDrawColor(0, 93, 164);
    doc.setLineWidth(1.0);
    doc.line(marginX, y, marginX + 35, y);
    y += 7;

    // General Parameters Box (Metadata Table)
    ensureSpace(35);
    doc.setFillColor(245, 247, 251); // soft light blue-gray
    doc.setDrawColor(218, 225, 233);
    doc.setLineWidth(0.3);
    doc.rect(marginX, y, contentWidth, 32, 'DF'); // Draw filled rectangle with border

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    
    // Row 1
    doc.text("Tipo de Actividad:", marginX + 4, y + 6);
    doc.text("Público Meta:", marginX + 90, y + 6);
    
    // Row 2
    doc.text("Participantes:", marginX + 4, y + 14);
    doc.text("Duración:", marginX + 90, y + 14);

    // Row 3
    doc.text("Modalidad:", marginX + 4, y + 22);
    doc.text("Presupuesto:", marginX + 90, y + 22);

    // Dynamic Values inside the gray box
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);

    const valAct = doc.splitTextToSize(activityType || "Taller STEM", 50);
    const valAud = doc.splitTextToSize(audience || "Comunidad en general", 50);
    const valPart = doc.splitTextToSize(participantsCount || "Grupos pequeños", 50);
    const valDur = doc.splitTextToSize(duration || "2 horas", 50);
    const valMod = doc.splitTextToSize(modality || "Presencial", 50);
    const valBud = doc.splitTextToSize(budget || "Flexible", 50);

    doc.text(valAct[0] || "", marginX + 32, y + 6);
    doc.text(valAud[0] || "", marginX + 115, y + 6);
    doc.text(valPart[0] || "", marginX + 32, y + 14);
    doc.text(valDur[0] || "", marginX + 115, y + 14);
    doc.text(valMod[0] || "", marginX + 32, y + 22);
    doc.text(valBud[0] || "", marginX + 115, y + 22);

    y += 37;

    // Helper function to draw headings
    const drawHeading = (title: string, icon = "") => {
      ensureSpace(18);
      y += 2;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 93, 164); // UCR Blue
      doc.text(`${icon ? icon + ' ' : ''}${title}`.trim().toUpperCase(), marginX, y);
      y += 3;
      
      doc.setDrawColor(0, 166, 206); // Robotifest Cyan line
      doc.setLineWidth(0.4);
      doc.line(marginX, y, marginX + 25, y);
      y += 6;
    };

    // 1. Descripción de la Propuesta / Idea General
    drawHeading("1. Descripción General e Idea Principal", "💡");
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    const descLines = doc.splitTextToSize(prop.description, contentWidth);
    ensureSpace(descLines.length * 5.0);
    doc.text(descLines, marginX, y);
    y += (descLines.length * 5.0) + 4;

    // Narrative
    ensureSpace(15);
    doc.setFillColor(242, 248, 253); // extremely light blue highlighting narrative
    const narrLines = doc.splitTextToSize(`"Narrativa motivacional costarricense: ${prop.narrative}"`, contentWidth - 8);
    const narrBoxHeight = (narrLines.length * 4.8) + 8;
    ensureSpace(narrBoxHeight);
    doc.rect(marginX, y, contentWidth, narrBoxHeight, 'F');
    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(narrLines, marginX + 4, y + 6);
    y += narrBoxHeight + 8;

    // 2. Objetivos de Aprendizaje
    drawHeading("2. Objetivos de Aprendizaje", "🎯");
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    prop.learningObjectives.forEach((obj, idx) => {
      const objLines = doc.splitTextToSize(`${idx + 1}. ${obj}`, contentWidth);
      ensureSpace(objLines.length * 5.0);
      doc.text(objLines, marginX, y);
      y += (objLines.length * 5.0) + 2.0;
    });
    y += 4;

    // 3. Competencias STEM Desarrolladas
    drawHeading("3. Competencias STEM de la Actividad", "🛠️");
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    prop.stemSkills.forEach((skill, idx) => {
      const skillLines = doc.splitTextToSize(`• ${skill}`, contentWidth);
      ensureSpace(skillLines.length * 5.0);
      doc.text(skillLines, marginX, y);
      y += (skillLines.length * 5.0) + 2.0;
    });
    y += 4;

    // 4. Materiales Requeridos
    drawHeading("4. Materiales del Taller STEM", "📦");
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    prop.requiredMaterials.forEach((material, idx) => {
      const matLines = doc.splitTextToSize(`• ${material}`, contentWidth);
      ensureSpace(matLines.length * 5.0);
      doc.text(matLines, marginX, y);
      y += (matLines.length * 5.0) + 2.0;
    });
    y += 5;

    // 5. Procedimiento / Fases
    const procTitle = detailMode === 'rapido' ? "5. Resumen de Implementación Rápida" : "5. Procedimiento Paso a Paso del Taller";
    drawHeading(procTitle, "⏳");
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    prop.stepByStep.forEach((step, idx) => {
      const prefix = detailMode === 'rapido' ? `Fase ${idx + 1}: ` : `Paso ${idx + 1}: `;
      const stepLines = doc.splitTextToSize(`${prefix}${step}`, contentWidth - 6);
      ensureSpace(stepLines.length * 5.0 + 3);
      
      doc.setFillColor(0, 93, 164); // Accent indicator on the left of each step
      doc.rect(marginX, y, 1.2, stepLines.length * 5.0, 'F');
      
      doc.text(stepLines, marginX + 4, y + 4);
      y += (stepLines.length * 5.0) + 4.0;
    });
    y += 4;

    // IF DETAILED MODE - Draw everything else under headers
    if (detailMode === 'detallado') {
      // 6. Seguridad durante la Actividad
      drawHeading("6. Seguridad y Cuidado Físico", "🛡️");
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      prop.safetyRecommendations.forEach((rec) => {
        const lines = doc.splitTextToSize(`• ${rec}`, contentWidth);
        ensureSpace(lines.length * 5.0);
        doc.text(lines, marginX, y);
        y += (lines.length * 5.0) + 2.0;
      });
      y += 4;

      // 7. Inclusión y Accesibilidad
      drawHeading("7. Ajustes de Inclusión y Diversidad Escolar", "🤝");
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      prop.inclusionInclusivity.forEach((inc) => {
        const lines = doc.splitTextToSize(`✔ ${inc}`, contentWidth);
        ensureSpace(lines.length * 5.0);
        doc.text(lines, marginX, y);
        y += (lines.length * 5.0) + 2.0;
      });
      y += 4;

      // 8. Criterios de Evaluación y Éxito
      drawHeading("8. Evaluación del Reto Tecnológico", "🏆");
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      prop.evaluationCriteria.forEach((crit) => {
        const lines = doc.splitTextToSize(`» ${crit}`, contentWidth);
        ensureSpace(lines.length * 5.0);
        doc.text(lines, marginX, y);
        y += (lines.length * 5.0) + 2.0;
      });
      y += 4;

      // 9. Riesgos y Soluciones de Mitigación
      drawHeading("9. Gestión de Riesgos e Imprevistos", "⚠️");
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      prop.risksAndMitigation.forEach((risk) => {
        const lines = doc.splitTextToSize(`• ${risk}`, contentWidth);
        ensureSpace(lines.length * 5.0);
        doc.text(lines, marginX, y);
        y += (lines.length * 5.0) + 2.0;
      });
      y += 4;

      // 10. Caja de Herramientas para Facilitadores
      drawHeading("10. Caja de Herramientas del Docente / Preguntas", "🏫");
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      prop.educatorTips.forEach((tip) => {
        const lines = doc.splitTextToSize(`» ${tip}`, contentWidth);
        ensureSpace(lines.length * 5.0);
        doc.text(lines, marginX, y);
        y += (lines.length * 5.0) + 2.0;
      });
      y += 4;

      // 11. Checklist previo al día X (Preparación Previa)
      drawHeading("11. Checklist del Facilitador (Preparación Previa)", "☑️");
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      prop.preImplementationChecklist.forEach((chk) => {
        const lines = doc.splitTextToSize(`[  ] ${chk}`, contentWidth);
        ensureSpace(lines.length * 5.0);
        doc.text(lines, marginX, y);
        y += (lines.length * 5.0) + 2.0;
      });
    }

    // Save/Download PDF
    const safeTitle = prop.name.toLowerCase().replace(/\s+/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    doc.save(`Propuesta_Robotifest_${safeTitle}_${levelTitle.toLowerCase()}.pdf`);
  };

  // Quick helper to see progress in checklists
  const getCompletedCount = (level: typeof activeLevel, listType: 'checklist' | 'steps') => {
    if (!proposals) return { completed: 0, total: 0 };
    const prop = proposals[level];
    const prefix = `${level}-`;
    const arrayLength = listType === 'checklist' ? prop.preImplementationChecklist.length : prop.stepByStep.length;
    
    const count = Object.keys(listType === 'checklist' ? checklistChecked : stepsCompleted)
      .filter(key => key.startsWith(prefix) && (listType === 'checklist' ? checklistChecked[key] : stepsCompleted[key]))
      .length;
    
    return { completed: count, total: arrayLength };
  };

  return (
    <div className="min-h-screen flex flex-col bg-natural-bg text-natural-text-main selection:bg-natural-accent/10 selection:text-natural-accent print:bg-white print:text-black">
      {/* Header Banner - UCR Context */}
      <header id="header-branding" className="bg-natural-panel text-natural-text-main border-b border-natural-border shadow-xs print:hidden transition-all duration-300 relative overflow-hidden">
        {/* Subtle academic background vectors mimicking technology nodes */}
        <div className="absolute top-0 right-0 opacity-[0.06] pointer-events-none">
          <svg className="w-96 h-96 text-natural-accent" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="20" />
            <line x1="10" y1="50" x2="90" y2="50" />
            <line x1="50" y1="10" x2="50" y2="90" />
            <circle cx="50" cy="10" r="2" fill="currentColor" />
            <circle cx="50" cy="90" r="2" fill="currentColor" />
            <circle cx="10" cy="50" r="2" fill="currentColor" />
            <circle cx="90" cy="50" r="2" fill="currentColor" />
            {/* Tiny robot orbits */}
            <circle cx="50" cy="20" r="1.5" fill="currentColor" />
            <circle cx="80" cy="50" r="1.5" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-natural-bg-accent rounded-2xl border border-natural-border flex items-center justify-center relative">
                <Cpu className="h-8 w-8 text-natural-accent animate-spin-slow" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00A6CE] rounded-full animate-ping"></div>
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-natural-accent">Escuela de Ingeniería Industrial</span>
                  <span className="text-xs bg-natural-bg-accent text-natural-accent px-2.5 py-0.5 rounded-full border border-natural-border font-bold">UCR</span>
                  <span className="text-[10px] text-natural-text-muted font-bold block uppercase tracking-wide">Coordinación Proyecto Robotifest</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3.5xl text-natural-accent font-sans">
                  Diseñador de Actividades y Retos Robotifest
                </h1>
                <p className="text-xs font-semibold text-natural-text-muted italic">Universidad de Costa Rica • Acción Social</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 max-w-xs text-right hidden sm:flex">
              <div className="flex items-center gap-2 bg-natural-bg-accent px-4 py-2 rounded-lg border border-natural-border">
                <div className="w-2.5 h-2.5 rounded-full bg-natural-accent animate-pulse"></div>
                <p className="text-xs text-natural-text-muted font-mono font-bold">Metodología de Robótica Humanística</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-natural-text-muted max-w-4xl leading-relaxed border-t border-natural-border/65 pt-3">
            Plataforma instruccional avanzada para organizadores, voluntarios y facilitadores. Diseña retos tecnológicos, lecciones interactivas y talleres STEM contextualizados a la Acción Social que impulsan la ciudadanía tecnológica, inclusión, sostenibilidad activa y el bienestar humano en Costa Rica.
          </p>
        </div>
      </header>

      {/* Main Sandbox */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Print Only Header branding */}
        <div className="hidden print:block mb-8 border-b-2 border-natural-text-main pb-4">
          <p className="text-xs font-mono tracking-widest text-[#005DA4] uppercase font-bold">UNIVERSIDAD DE COSTA RICA • ESCUELA DE INGENIERÍA INDUSTRIAL • ROBOTIFEST</p>
          <h1 className="text-3xl font-extrabold text-natural-text-main">Planificación Pedagógica de Actividad STEM</h1>
          <p className="text-sm mt-1 text-natural-text-muted font-medium">Coordinación Proyecto Robotifest — Reporte Oficial de Acción Social</p>
        </div>

        {/* Dynamic Ideas Iniciales (Presets) - Collapsible & Always Accessible */}
        <section id="preset-gallery" className="bg-natural-panel rounded-2xl border border-natural-border p-5 shadow-xs space-y-4 print:hidden transition-all duration-300 relative overflow-hidden">
          {/* Subtle technological circuit line overlay */}
          <div className="absolute top-0 right-0 opacity-15 pointer-events-none select-none translate-x-12 -translate-y-12">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="#005DA4" strokeWidth="0.5">
              <path d="M10,50 L40,50 L50,60 L90,60" />
              <path d="M30,30 L60,30 L70,40 L90,40" />
              <circle cx="10" cy="50" r="1.5" fill="#005DA4" />
              <circle cx="90" cy="60" r="1.5" fill="#005DA4" />
              <circle cx="30" cy="30" r="1.5" fill="#005DA4" />
              <circle cx="90" cy="40" r="1.5" fill="#005DA4" />
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-natural-border pb-3.5 relative">
            <button
              type="button"
              onClick={() => setIsPresetsExpanded(!isPresetsExpanded)}
              className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group flex-1 select-none"
            >
              <div className="p-2 bg-natural-bg-accent rounded-xl border border-natural-border text-lg font-bold group-hover:scale-105 transition-transform duration-200">
                💡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-natural-accent group-hover:text-natural-accent-hover transition-colors">
                    Ideas sugeridas de inspiración
                  </h2>
                  <span className="text-[10px] bg-[#00A6CE]/10 text-[#00A6CE] font-extrabold px-1.5 py-0.5 rounded uppercase">
                    Metodología UCR
                  </span>
                </div>
                <p className="text-xs text-natural-text-muted">
                  Propuestas generales, reutilizables y fáciles de adaptar a cualquier contexto.
                </p>
              </div>
            </button>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {isPresetsExpanded && (
                <button
                  type="button"
                  onClick={handleSuggestIdeas}
                  disabled={isSuggesting}
                  className="text-xs font-bold px-4 py-2 bg-natural-bg-accent hover:bg-natural-border/60 text-natural-accent rounded-xl border border-natural-border flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xs active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-natural-accent ${isSuggesting ? 'animate-spin' : ''}`} />
                  {isSuggesting ? "Generando Nuevas..." : "Generar Nuevas Sugerencias con IA"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsPresetsExpanded(!isPresetsExpanded)}
                className="p-2 hover:bg-natural-bg-accent rounded-xl text-natural-accent cursor-pointer transition-colors"
                title={isPresetsExpanded ? "Minimizar sugerencias" : "Expandir sugerencias"}
              >
                {isPresetsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {isPresetsExpanded && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-natural-text-muted leading-relaxed">
                Haga clic en cualquiera de las siguientes ideas generales para completar los parámetros de diseño instruccional del formulario:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="group flex items-start gap-3.5 p-4 rounded-xl border border-natural-border bg-white hover:bg-natural-bg-accent hover:border-natural-accent text-left transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer relative"
                  >
                    <span className="text-3.5xl p-2 bg-natural-bg-accent rounded-xl group-hover:bg-natural-border transition-colors shrink-0">
                      {preset.icon}
                    </span>
                    <div className="space-y-1.5 flex-1 overflow-hidden">
                      <h3 className="font-bold text-natural-text-main text-sm group-hover:text-natural-accent transition-colors block leading-tight">
                        {preset.title}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(preset.data.theme) ? (
                          preset.data.theme.slice(0, 2).map((t, themeIdx) => (
                            <span key={themeIdx} className="text-[9px] bg-[#005DA4]/5 text-[#005DA4] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide border border-[#005DA4]/10">
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] bg-[#005DA4]/5 text-[#005DA4] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide border border-[#005DA4]/10">
                            {preset.data.theme}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-natural-text-muted leading-relaxed line-clamp-2 italic">
                        "{preset.data.learningObjectives}"
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Main Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input form configurator */}
          <section 
            id="configurator-panel" 
            className={`lg:col-span-4 bg-natural-panel rounded-2xl border border-natural-border shadow-xs overflow-hidden print:hidden transition-all duration-300 ${proposals ? 'lg:sticky lg:top-4' : ''}`}
          >
            <div className="p-5 border-b border-natural-border bg-natural-bg-accent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-natural-accent animate-spin-slow" />
                <h2 className="font-bold text-natural-accent">Parámetros del Reto</h2>
              </div>
              {proposals && (
                <button
                  type="button"
                  onClick={downloadPDFFile}
                  className="text-xs font-bold px-3 py-1.5 bg-natural-accent hover:bg-natural-accent-hover text-white rounded-xl border border-natural-accent flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 animate-fade-in"
                  title="Exportar esta propuesta instruccional directamente a un archivo PDF listo para su impresión"
                >
                  <Printer className="w-3.5 h-3.5" /> Exportar a PDF
                </button>
              )}
            </div>

            <form onSubmit={handleGenerate} className="p-5 space-y-5">
              {/* Form Campo: Tipo de Actividad */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Tipo de Actividad / Formato</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full text-sm bg-natural-bg border border-natural-border rounded-lg px-3 py-2.5 text-natural-text-main focus:ring-2 focus:ring-natural-accent/20 focus:border-natural-accent transition-all outline-none"
                >
                  {ACTIVITY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Form Campo: Nivel de Detalle de la Propuesta */}
              <div className="space-y-1.5 flex flex-col pt-0.5">
                <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Nivel de Detalle</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailMode('rapido')}
                    className={`text-xs font-bold py-2 px-3 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${detailMode === 'rapido' ? 'bg-natural-accent text-white border-natural-accent shadow-xs font-black' : 'bg-natural-bg hover:bg-natural-bg-accent text-natural-text-muted border-natural-border'}`}
                  >
                    ⚡ Modo Rápido
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailMode('detallado')}
                    className={`text-xs font-bold py-2 px-3 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${detailMode === 'detallado' ? 'bg-natural-accent text-white border-natural-accent shadow-xs font-black' : 'bg-natural-bg hover:bg-natural-bg-accent text-natural-text-muted border-natural-border'}`}
                  >
                    📝 Modo Detallado
                  </button>
                </div>
                <span className="text-[10px] text-natural-text-muted leading-relaxed italic block mt-0.5">
                  {detailMode === 'rapido' 
                    ? "Genera una propuesta simplificada con idea general, objetivos, competencias, materiales y resumen del taller." 
                    : "Genera la propuesta completa de Robotifest (procedimiento detallado, normas de seguridad, inclusión, imprevistos y checklist)."}
                </span>
              </div>

              {/* Form Campo: Temáticas STEM (Multi-select) */}
              <div className="space-y-2 flex flex-col">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Temáticas STEM (Multi-selección)</label>
                  <span className="text-[10px] bg-natural-bg-accent text-natural-accent font-bold px-1.5 rounded">{selectedThemes.length} seleccionadas</span>
                </div>
                <div className="max-h-56 overflow-y-auto border border-natural-border p-2 rounded-lg bg-natural-bg space-y-1">
                  {STEM_CATEGORIES.map((category) => {
                    const isSelected = selectedThemes.includes(category);
                    return (
                      <button
                        type="button"
                        key={category}
                        onClick={() => handleToggleTheme(category)}
                        className={`w-full text-left font-sans text-xs px-2.5 py-1.5 rounded transition-all flex items-center justify-between cursor-pointer ${isSelected ? 'bg-natural-accent text-white font-bold' : 'hover:bg-natural-border/30 text-natural-text-muted'}`}
                      >
                        <span>{category}</span>
                        {isSelected && <span className="text-[10px] block font-black">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] text-natural-text-muted italic block">Puedes combinar temas (ej. Internet de las Cosas e Inteligencia Artificial).</span>
              </div>

              {/* Form Campo: Edad / Nivel */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Público o Nivel Educativo</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full text-sm bg-natural-bg border border-natural-border rounded-lg px-3 py-2.5 text-natural-text-main focus:ring-2 focus:ring-natural-accent/20 focus:border-natural-accent transition-all outline-none"
                >
                  <option value="Primaria Baja (7-9 años)">Primaria Baja (7-9 años)</option>
                  <option value="Primaria Alta (10-12 años)">Primaria Alta (10-12 años)</option>
                  <option value="Secundaria (13-17 años)">Secundaria (13-17 años)</option>
                  <option value="Estudiantes Universitarios">Estudiantes Universitarios</option>
                  <option value="Familias y Comunidad General">Familias y Comunidad General</option>
                  <option value="Docentes de Primaria/Secundaria">Docentes de Primaria/Secundaria</option>
                </select>
              </div>

              {/* Grid: Cantidad participantes + Duración */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Participantes</label>
                  <select
                    value={participantsCount}
                    onChange={(e) => setParticipantsCount(e.target.value)}
                    className="w-full text-sm bg-natural-bg border border-natural-border rounded-lg px-2 py-2.5 text-natural-text-main focus:ring-2 focus:ring-natural-accent/20 focus:border-natural-accent transition-all outline-none"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Parejas o tríos">Parejas o tríos</option>
                    <option value="Grupos pequeños (4-6)">Grupos pequeños (4-6)</option>
                    <option value="Grupos grandes (7+)">Grupos grandes (7+)</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Duración</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full text-sm bg-natural-bg border border-natural-border rounded-lg px-2 py-2.5 text-natural-text-main focus:ring-2 focus:ring-natural-accent/20 focus:border-natural-accent transition-all outline-none"
                  >
                    <option value="1 hora">1 hora o menos</option>
                    <option value="2 horas">2 horas (Sesión base)</option>
                    <option value="Medio día">Medio día (4 hrs)</option>
                    <option value="Día completo">Día completo (8 hrs)</option>
                    <option value="Semanal / Proyecto">Modular (Varias sesiones)</option>
                  </select>
                </div>
              </div>

              {/* Form Campo: Modalidad */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Modalidad de Impartición</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Presencial', 'Virtual', 'Híbrida'].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setModality(m)}
                      className={`text-xs font-bold py-2 px-1.5 rounded-lg border transition-all cursor-pointer ${modality === m ? 'bg-natural-accent text-white border-natural-accent' : 'bg-natural-bg hover:bg-natural-bg-accent text-natural-text-muted border-natural-border'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Campo: Presupuesto Disponible (Nuevo / Opcional) */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Presupuesto Sugerido (Opcional)</label>
                  <Coins className="w-3.5 h-3.5 text-natural-accent" />
                </div>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-sm bg-natural-bg border border-natural-border rounded-lg px-3 py-2.5 text-natural-text-main focus:ring-2 focus:ring-natural-accent/20 focus:border-natural-accent transition-all outline-none"
                >
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="text-[10px] text-natural-text-muted italic block">Alinea la selección de materiales y el hardware tecnológico aconsejable.</span>
              </div>

              {/* Form Campo: Materiales disponibles */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Materiales del Taller (Opcional)</label>
                  <span className="text-[10px] bg-natural-bg-accent text-natural-accent font-bold px-1.5 py-0.5 rounded border border-natural-border">Preferencias</span>
                </div>
                <textarea
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="Ej: Sensores de humedad, cartón, botellas plásticas vacías, goma escolar caliente, micro:bit..."
                  rows={2}
                  className="w-full text-sm bg-natural-bg border border-natural-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-natural-accent/20 focus:border-natural-accent transition-all outline-none resize-none font-sans text-natural-text-main"
                />
              </div>

              {/* Form Campo: Objetivos del usuario */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Mis Objetivos de Aprendizaje</label>
                <textarea
                  value={learningObjectives}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                  placeholder="¿Qué te gustaría específicamente que los participantes se lleven o comprendan al final de la actividad?"
                  rows={2}
                  className="w-full text-sm bg-natural-bg border border-natural-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-natural-accent/20 focus:border-natural-accent transition-all outline-none resize-none font-sans text-natural-text-main"
                />
              </div>

              {/* Form Campo: Problemática o Contexto Costarricense */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Problemática Social / Bienestar</label>
                  <MapPin className="w-3.5 h-3.5 text-natural-accent" />
                </div>
                <textarea
                  value={socialProblem}
                  onChange={(e) => setSocialProblem(e.target.value)}
                  placeholder="Ej: Sequía local, optimización del reciclaje cantonal o fomento del envejecimiento activo."
                  rows={2}
                  className="w-full text-sm bg-natural-bg border border-natural-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-natural-accent/20 focus:border-natural-accent transition-all outline-none resize-none font-sans text-natural-text-main"
                />
                <span className="text-[10px] text-natural-text-muted italic block mt-1">Conecta la robótica con necesidades de Costa Rica según la Acción Social UCR.</span>
              </div>

              {/* Form Campo: Competencias STEM */}
              <div className="space-y-2 flex flex-col">
                <label className="text-[11px] font-bold text-natural-text-muted tracking-wider uppercase block">Competencias de Desarrollo</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSkills.map((skill) => {
                    const isSelected = skills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer ${isSelected ? 'bg-natural-accent text-white border-natural-accent shadow-xs' : 'bg-natural-bg-accent hover:bg-natural-border/50 text-natural-text-muted border-natural-border'}`}
                      >
                        {skill} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-natural-accent hover:bg-natural-accent-hover disabled:bg-natural-text-muted text-white font-bold text-sm py-3 px-4 rounded-full shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                     <RefreshCw className="w-4 h-4 animate-spin" />
                     <span>Planificando Actividad Robotifest...</span>
                  </>
                ) : (
                  <>
                     <Sparkles className="w-4 h-4 text-white animate-pulse" />
                     <span>Generar Propuestas Robotifest</span>
                  </>
                )}
              </button>
            </form>
          </section>

          {/* RIGHT COLUMN: Output display */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* 1. Loading State */}
            {isLoading && (
              <div className="bg-natural-panel rounded-3xl border border-natural-border shadow-xs p-8 sm:p-12 text-center space-y-6 animate-pulse">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-full bg-natural-bg-accent border border-natural-border flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-natural-accent animate-spin-slow" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-natural-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-natural-accent"></span>
                  </span>
                </div>
                
                <div className="space-y-2 max-w-lg mx-auto">
                  <h3 className="text-xl font-bold font-serif text-natural-accent">Iniciando Laboratorio de Co-Diseño STEM</h3>
                  <p className="text-sm text-natural-accent font-mono italic animate-pulse h-6">
                    {loadingQuotes[loadingQuoteIndex]}
                  </p>
                  <p className="text-xs text-natural-text-muted">
                    Nuestros algoritmos están consultando las metodologías de robótica de la Universidad de Costa Rica para crear tres planes secuenciados por nivel de madurez técnica. Esto tardará unos 10 segundos...
                  </p>
                </div>

                <div className="w-full max-w-md mx-auto bg-natural-bg-accent rounded-full h-2 overflow-hidden border border-natural-border">
                  <div className="bg-natural-accent h-full rounded-full animate-progress-bar"></div>
                </div>
              </div>
            )}

            {/* 2. Error State */}
            {error && (
              <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 text-rose-900 flex items-start gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">No pudimos procesar tu propuesta</h4>
                  <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
                  <p className="text-xs text-rose-600 font-medium mt-1">Sugerencia: Intente verificar que su llave de API "GEMINI_API_KEY" esté colocada en la sección de Secretos.</p>
                </div>
              </div>
            )}

            {/* 3. Empty State (Initial screen) */}
            {!proposals && !isLoading && (
              <div className="bg-natural-panel rounded-3xl border border-dashed border-natural-border p-8 sm:p-16 text-center shadow-xs">
                <div className="w-16 h-16 bg-natural-bg-accent rounded-2xl flex items-center justify-center mx-auto mb-5 border border-natural-border text-natural-accent">
                  <BookOpen className="w-8 h-8 text-natural-accent" />
                </div>
                <div className="max-w-md mx-auto space-y-3">
                  <h3 className="text-xl font-bold font-serif text-natural-accent">Estudio Pedagógico Vacío</h3>
                  <p className="text-sm text-natural-text-muted leading-relaxed">
                    Usa el panel lateral izquierdo para ingresar los requerimientos técnicos y de comunidad de tu taller, o carga uno de nuestros ejemplos para crear un espectacular instructivo.
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-natural-accent font-semibold bg-natural-bg-accent px-3 py-1.5 rounded-full border border-natural-border">
                      <Flame className="w-3.5 h-3.5 fill-natural-bg-accent" /> Co-creando robótica inclusiva en Costa Rica
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Main Results Block */}
            {proposals && !isLoading && (
              <div id="proposal-results-block" className="space-y-6 transition-all duration-500">
                
                {/* Proposal Tabs Segmenter */}
                <div className="bg-natural-panel p-2 rounded-xl border border-natural-border flex flex-col sm:flex-row gap-1 shadow-xs print:hidden">
                  
                  {/* Conservadora Tab */}
                  <button
                    onClick={() => setActiveLevel('conservadora')}
                    className={`flex-1 flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${activeLevel === 'conservadora' ? 'bg-natural-bg-accent border border-natural-border text-natural-text-main shadow-xs font-semibold' : 'hover:bg-natural-bg-accent text-natural-text-muted border border-transparent'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md ${activeLevel === 'conservadora' ? 'bg-[#4a5c71] text-white' : 'bg-natural-bg text-natural-text-muted'}`}>
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide opacity-80 font-serif">Nivel 1</p>
                        <h4 className="text-sm font-bold font-serif">Conservadora</h4>
                      </div>
                    </div>
                    
                    <span className="text-[10px] font-bold bg-natural-bg text-natural-text-muted px-2 py-0.5 rounded-full border border-natural-border">
                      Máxima Factibilidad
                    </span>
                  </button>

                  {/* Equilibrada Tab */}
                  <button
                    onClick={() => setActiveLevel('equilibrada')}
                    className={`flex-1 flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${activeLevel === 'equilibrada' ? 'bg-natural-bg-accent border border-natural-border text-natural-text-main shadow-xs font-semibold' : 'hover:bg-natural-bg-accent text-natural-text-muted border border-transparent'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md ${activeLevel === 'equilibrada' ? 'bg-natural-accent text-white' : 'bg-natural-bg text-natural-text-muted'}`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide opacity-80 font-serif">Nivel 2</p>
                        <h4 className="text-sm font-bold font-serif">Equilibrada</h4>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-natural-bg text-natural-text-muted px-2 py-0.5 rounded-full border border-natural-border">
                      Balance Innovación
                    </span>
                  </button>

                  {/* Innovadora Tab */}
                  <button
                    onClick={() => setActiveLevel('innovadora')}
                    className={`flex-1 flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${activeLevel === 'innovadora' ? 'bg-natural-bg-accent border border-natural-border text-natural-text-main shadow-xs font-semibold' : 'hover:bg-natural-bg-accent text-natural-text-muted border border-transparent'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md ${activeLevel === 'innovadora' ? 'bg-[#002244] text-white' : 'bg-natural-bg text-natural-text-muted'}`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide opacity-80 font-serif">Nivel 3</p>
                        <h4 className="text-sm font-bold font-serif">Innovadora</h4>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-natural-bg text-natural-text-muted px-2 py-0.5 rounded-full border border-natural-border">
                      Alta Creatividad
                    </span>
                  </button>
                </div>

                {/* Main Selected Proposal Layout */}
                <article className={`bg-natural-panel rounded-3xl border shadow-xs overflow-hidden transition-all duration-300 ${
                  activeLevel === 'conservadora' ? 'border-natural-border focus-within:ring-natural-badge-basic/20' : 
                  activeLevel === 'equilibrada' ? 'border-natural-border focus-within:ring-natural-accent/20' : 
                  'border-natural-border focus-within:ring-natural-badge-high/20'
                }`}>
                  
                  {/* Proposal Top Accent Banner */}
                  <div className={`p-6 text-white ${
                    activeLevel === 'conservadora' ? 'bg-gradient-to-r from-slate-500 to-slate-700' : 
                    activeLevel === 'equilibrada' ? 'bg-gradient-to-r from-[#005DA4] to-[#00457A]' : 
                    'bg-gradient-to-r from-[#002244] to-[#005DA4]'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase bg-white/20 text-white px-3 py-1 rounded-full mb-3 border border-white/10 backdrop-blur-xs font-serif">
                          {activeLevel === 'conservadora' && <Wrench className="w-3 h-3" />}
                          {activeLevel === 'equilibrada' && <Layers className="w-3 h-3" />}
                          {activeLevel === 'innovadora' && <Sparkles className="w-3 h-3" />}
                          Propuesta {activeLevel === 'conservadora' ? 'Conservadora (Nivel 1)' : activeLevel === 'equilibrada' ? 'Equilibrada (Nivel 2)' : 'Innovadora (Nivel 3)'}
                        </div>
                        <h2 className="text-2xl font-bold font-serif leading-tight tracking-tight sm:text-3xl">
                          {proposals[activeLevel].name}
                        </h2>
                      </div>

                      {/* Export Actions (Hidden in Print) */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center print:hidden">
                        <button
                          onClick={downloadTextFile}
                          className="flex items-center gap-1 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full border border-white/10 transition-all active:scale-95 cursor-pointer"
                          title="Descargar archivo en texto"
                        >
                          <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Descargar</span>
                        </button>
                        <button
                          onClick={copyProposalMarkdown}
                          className="flex items-center gap-1 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full border border-white/10 transition-all active:scale-95 cursor-pointer"
                          title="Copiar formato Markdown"
                        >
                          <Award className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Markdown</span>
                        </button>
                        <button
                          onClick={downloadPDFFile}
                          className="flex items-center gap-1 text-xs font-bold bg-white text-natural-text-main hover:bg-natural-bg-accent px-3 py-2 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer"
                          title="Exportar esta propuesta a un archivo PDF profesional"
                        >
                          <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">PDF</span>
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-white/90 leading-relaxed font-sans max-w-4xl">
                      {proposals[activeLevel].description}
                    </p>
                  </div>

                  {/* Proposal Core Body content area */}
                  <div className="p-6 sm:p-8 space-y-8 font-sans">
                    
                    {/* Metaphor / Narrative Banner */}
                    <section id="proposal-narrative" className="relative p-6 rounded-2xl bg-natural-bg-accent border border-natural-border overflow-hidden shadow-xs">
                      <div className="absolute right-0 bottom-0 text-natural-border p-0 transform translate-x-12 translate-y-12 select-none pointer-events-none">
                        <Sparkles className="w-48 h-48 opacity-[0.03]" />
                      </div>
                      <div className="flex gap-4 relative">
                        <div className="text-3xl select-none mt-1 shrink-0">✨</div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-natural-text-muted font-sans">Narrativa y Metáfora Motivacional</span>
                          <p className="text-sm sm:text-base font-semibold italic text-natural-text-main leading-relaxed font-sans">
                            « {proposals[activeLevel].narrative} »
                          </p>
                          <p className="text-xs text-natural-text-muted pt-1 block font-sans">
                            Usa esta historia ficticia o analogía comunitaria de Costa Rica al inicio de la sesión para involucrar afectivamente a los chicos.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Double-column summary metadata container */}
                    <div className={`grid grid-cols-1 ${detailMode === 'detallado' ? 'md:grid-cols-2' : ''} gap-8`}>
                      
                      {/* Left side: Objectives, Skills, Materials */}
                      <div className="space-y-8">
                        
                        {/* Objectives List */}
                        <section id="learning-objectives-section" className="space-y-3">
                          <div className="flex items-center gap-2 border-b border-natural-border pb-1.5">
                            <BookOpen className="w-4.5 h-4.5 text-natural-accent" />
                            <h3 className="text-sm font-bold tracking-wider text-natural-accent uppercase font-serif">Objetivos de Aprendizaje</h3>
                          </div>
                          <ul className="space-y-2 font-sans">
                            {proposals[activeLevel].learningObjectives.map((obj, i) => (
                              <li key={i} className="flex gap-2 text-xs sm:text-sm text-natural-text-main leading-relaxed items-start">
                                <span className={`w-5 h-5 rounded-md inline-flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                                  activeLevel === 'conservadora' ? 'bg-[#4a5c71]/20 text-[#4a5c71]' :
                                  activeLevel === 'equilibrada' ? 'bg-[#005DA4]/20 text-[#005DA4]' :
                                  'bg-[#002244]/20 text-[#002244]'
                                }`}>
                                  {i + 1}
                                </span>
                                <span className="font-medium">{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </section>

                        {/* STEM competencies developed */}
                        <section id="skills-section" className="space-y-3">
                          <div className="flex items-center gap-2 border-b border-natural-border pb-1.5">
                            <Award className="w-4.5 h-4.5 text-natural-accent" />
                            <h3 className="text-sm font-bold tracking-wider text-natural-accent uppercase font-serif">Competencias STEM Desarrolladas</h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5 font-sans">
                            {proposals[activeLevel].stemSkills.map((v, i) => (
                              <span 
                                key={i} 
                                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-natural-bg-accent text-natural-text-main border border-natural-border inline-flex items-center gap-1 hover:bg-natural-border/30 transition-all duration-150"
                              >
                                🎯 {v}
                              </span>
                            ))}
                          </div>
                        </section>

                        {/* Materials Section */}
                        <section id="materials-section" className="space-y-3">
                          <div className="flex items-center gap-2 border-b border-natural-border pb-1.5">
                            <Wrench className="w-4.5 h-4.5 text-natural-accent" />
                            <h3 className="text-sm font-bold tracking-wider text-natural-accent uppercase font-serif">Materiales y Recursos Necesarios</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans">
                            {proposals[activeLevel].requiredMaterials.map((mat, i) => (
                              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-natural-bg-accent border border-natural-border rounded-lg text-xs font-medium text-natural-text-main">
                                <span className="w-1.5 h-1.5 rounded-full bg-natural-accent shrink-0"></span>
                                <span className="truncate" title={mat}>{mat}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>

                      {/* Right side: Safety, Inclusivity, and Evaluation (Only in Detailed Mode) */}
                      {detailMode === 'detallado' && (
                        <div className="space-y-8">
                          
                          {/* Recommendations of safety */}
                          <section id="safety-section" className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-natural-border pb-1.5">
                              <AlertTriangle className="w-4.5 h-4.5 text-natural-accent" />
                              <h3 className="text-sm font-bold tracking-wider text-natural-accent uppercase font-serif">Seguridad durante la Actividad</h3>
                            </div>
                            <ul className="space-y-2 font-sans">
                              {proposals[activeLevel].safetyRecommendations.map((rec, i) => (
                                <li key={i} className="flex gap-2 text-xs sm:text-sm text-natural-text-main leading-relaxed items-start">
                                  <span className="text-natural-accent font-bold shrink-0 mt-0.5">•</span>
                                  <span className="font-sans font-medium">{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </section>

                          {/* Inclusion and Inclusivity section */}
                          <section id="inclusion-section" className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-natural-border pb-1.5">
                              <HeartHandshake className="w-4.5 h-4.5 text-natural-accent" />
                              <h3 className="text-sm font-bold tracking-wider text-natural-accent uppercase font-serif">Inclusión y Diseños Flexibles</h3>
                            </div>
                            <ul className="space-y-2 font-sans">
                              {proposals[activeLevel].inclusionInclusivity.map((item, i) => (
                                <li key={i} className="flex gap-2 text-xs sm:text-sm text-natural-text-main leading-relaxed items-start">
                                  <span className="text-natural-accent font-bold shrink-0 mt-0.5">✔</span>
                                  <span className="font-sans font-medium text-natural-text-main">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </section>

                          {/* Evaluation Rubric / Criteria */}
                          <section id="evaluation-section" className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-natural-border pb-1.5">
                              <BookmarkCheck className="w-4.5 h-4.5 text-natural-accent" />
                              <h3 className="text-sm font-bold tracking-wider text-natural-accent uppercase font-serif">Criterios de Éxito y Evaluación</h3>
                            </div>
                            <div className="bg-natural-bg-accent p-4 rounded-xl border border-natural-border space-y-2 font-sans">
                              {proposals[activeLevel].evaluationCriteria.map((crit, i) => (
                                <div key={i} className="flex gap-2.5 text-xs text-natural-text-main items-start font-medium leading-relaxed">
                                  <span className="text-natural-accent shrink-0 mt-0.5">🏆</span>
                                  <span>{crit}</span>
                                </div>
                              ))}
                            </div>
                          </section>
                        </div>
                      )}
                    </div>

                    {/* Sequential step by step procedure with interactive checklists */}
                    <section id="procedure-section" className="space-y-4 pt-4 border-t border-natural-border">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-natural-border pb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-natural-accent" />
                          <h3 className="text-md font-bold tracking-wide text-natural-accent uppercase font-serif">
                            {detailMode === 'rapido' ? 'Resumen de Implementación Escolar' : 'Procedimiento de Implementación Paso a Paso'}
                          </h3>
                        </div>
                        
                        {/* Progress Indicator */}
                        <span className="text-xs font-bold text-natural-text-muted bg-natural-bg px-2.5 py-1 rounded-full print:hidden border border-natural-border">
                          {detailMode === 'rapido' ? 'Fases de la propuesta' : 'Progreso del taller'}: {getCompletedCount(activeLevel, 'steps').completed} / {getCompletedCount(activeLevel, 'steps').total} completados
                        </span>
                      </div>

                      <p className="text-xs text-natural-text-muted leading-relaxed pb-1 print:hidden font-sans">
                        {detailMode === 'rapido'
                          ? "Fases de implementación sugeridas para coordinar la sesión con facilidad:"
                          : "Marca los pasos educativos conforme avances durante la facilitación en el aula para mantener un control del tiempo sugerido:"}
                      </p>

                      <div className="space-y-3 font-sans">
                        {proposals[activeLevel].stepByStep.map((step, i) => {
                          const stepKey = `${activeLevel}-step-${i}`;
                          const isDone = stepsCompleted[stepKey] || false;
                          return (
                            <div 
                              key={i}
                              onClick={() => {
                                setStepsCompleted({
                                  ...stepsCompleted,
                                  [stepKey]: !isDone
                                });
                              }}
                              className={`flex gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all duration-150 ${isDone ? 'bg-natural-bg-accent/40 border-natural-border opacity-60' : 'bg-natural-panel hover:bg-natural-bg-accent/50 border-natural-border shadow-xs'}`}
                            >
                              <div className="mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => {}} // Controlled click on outer container
                                  className="w-4 h-4 rounded-md text-natural-accent focus:ring-0 cursor-pointer pointer-events-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${
                                  isDone ? 'bg-natural-border text-natural-text-muted font-sans' : 'bg-natural-bg text-natural-accent font-sans border border-natural-border'
                                }`}>
                                  {detailMode === 'rapido' ? 'Fase' : 'Paso'} {i + 1}
                                </span>
                                <p className={`text-xs sm:text-sm text-natural-text-main leading-relaxed font-medium ${isDone ? 'line-through text-natural-text-muted' : ''}`}>
                                  {step}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    {/* Detailed-Only Sections */}
                    {detailMode === 'detallado' && (
                      <>
                        {/* Risk mitigations alert boxes */}
                        <section id="risks-mitigation-section" className="p-5 rounded-2xl bg-[#FAF8F2] border border-natural-border/80 space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-natural-accent" />
                            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-natural-accent uppercase font-serif">Riesgos y Soluciones de Mitigación</h3>
                          </div>
                          <p className="text-xs text-natural-text-muted leading-relaxed font-sans">
                            Durante la Acción Social, es vital anticipar los imprevistos en comunidades. Los siguientes son riesgos comunes y cómo los facilitadores pueden actuar el día del reto:
                          </p>
                          <ul className="space-y-1.5 font-sans pl-1">
                            {proposals[activeLevel].risksAndMitigation.map((risk, i) => (
                               <li key={i} className="text-xs font-semibold text-natural-text-main leading-relaxed list-disc list-inside">
                                 {risk}
                               </li>
                            ))}
                          </ul>
                        </section>

                        {/* Educator tips and generating questions */}
                        <section id="educator-tips-section" className="space-y-3 pt-4 border-t border-natural-border">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-natural-accent" />
                            <h3 className="text-md font-bold tracking-wide text-natural-accent uppercase font-serif">Caja de Herramientas para el Facilitador</h3>
                          </div>
                          <p className="text-xs text-natural-text-muted leading-relaxed font-sans">
                            Preguntas generadoras que puedes hacer en el aula costarricense para guiar el pensamiento de los grupos sin darles directamente la respuesta técnica:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                            {proposals[activeLevel].educatorTips.map((tip, i) => (
                              <div key={i} className="p-4 rounded-xl border border-natural-border bg-natural-bg-accent/40 flex items-start gap-2.5">
                                <span className="text-xl select-none shrink-0 font-sans">💡</span>
                                <p className="text-xs sm:text-sm text-natural-text-main font-medium leading-relaxed font-sans">
                                  {tip}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* Pre-implementation checklist before implementing */}
                        <section id="checklist-section" className="p-5 rounded-2xl bg-natural-bg-accent border border-natural-border shadow-xs space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <CheckSquare className="w-5 h-5 text-natural-accent animate-pulse" />
                              <h3 className="text-sm font-bold tracking-wider text-natural-accent uppercase font-serif">Antes de implementar la actividad: Preparación previa del facilitador</h3>
                            </div>
                            <span className="text-xs font-bold text-natural-accent bg-natural-bg px-2 py-0.5 rounded-md border border-[#005DA4]/20 font-serif">
                              Completado: {getCompletedCount(activeLevel, 'checklist').completed} / {getCompletedCount(activeLevel, 'checklist').total}
                            </span>
                          </div>
                          <p className="text-xs text-natural-text-muted font-semibold leading-relaxed font-sans">
                            Complete esta lista de verificación previa para comprobar la preparación anticipada de materiales, pruebas de software/conectividad, normas de seguridad física, requisitos del espacio o aula y coordinaciones indispensables con la sede o docentes antes de iniciar:
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans">
                            {proposals[activeLevel].preImplementationChecklist.map((item, i) => {
                              const chkKey = `${activeLevel}-chk-${i}`;
                              const isChecked = checklistChecked[chkKey] || false;
                              return (
                                <label 
                                  key={i} 
                                  className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                                    isChecked ? 'bg-natural-bg-accent/40 border-natural-border text-natural-text-muted/60' : 'bg-natural-panel hover:bg-natural-bg-accent/10 border-natural-border text-natural-text-main'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      setChecklistChecked({
                                        ...checklistChecked,
                                        [chkKey]: !isChecked
                                      });
                                    }}
                                    className="w-4.5 h-4.5 rounded-sm text-natural-accent focus:ring-0 mt-0.5"
                                  />
                                  <span className={`text-xs ml-0.5 font-semibold leading-normal font-sans ${isChecked ? 'line-through text-natural-text-muted' : ''}`}>
                                    {item}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </section>
                      </>
                    )}

                    {/* PRINT FORMAT FOOTER */}
                    <div className="hidden print:block text-center pt-8 border-t border-natural-border text-xs text-natural-text-muted font-mono">
                      Plan pedagógico generado el {new Date().toLocaleDateString('es-CR')} utilizando Robotifest Challenge & Activity Designer UCR.
                    </div>

                  </div>

                  {/* Refinement Chat System: Interactive modification */}
                  <div className="p-5 border-t border-natural-border bg-natural-bg-accent flex flex-col gap-4 print:hidden">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-natural-accent animate-spin-slow" />
                        <h4 className="text-xs font-bold tracking-wide text-natural-text-main uppercase font-serif">AJUSTAR ESTA VERSIÓN CON INTELIGENCIA ARTIFICIAL</h4>
                      </div>
                      <p className="text-xs text-natural-text-muted leading-relaxed font-sans">
                        ¿Quieres cambiar algo? Pide a la IA que modifique esta propuesta {activeLevel === 'conservadora' ? 'Conservadora' : activeLevel === 'equilibrada' ? 'Equilibrada' : 'Innovadora'} (ej: "Sujeta los materiales solo a cartón", "Acorta los pasos para durar solo 1 hora", etc.).
                      </p>
                    </div>

                    {/* History of changes for this level if any */}
                    {refinementHistory[activeLevel] && refinementHistory[activeLevel]!.length > 0 && (
                      <div className="bg-natural-panel p-3 rounded-xl border border-natural-border space-y-1.5 max-h-24 overflow-y-auto">
                        <p className="text-[10px] font-extrabold text-natural-text-muted uppercase tracking-widest font-sans">Historial de ajustes aplicados:</p>
                        {refinementHistory[activeLevel]!.map((hist, idx) => (
                          <div key={idx} className="flex gap-2 text-[11px] font-semibold text-natural-accent leading-normal font-sans">
                            <span>✦</span> <span className="italic">"{hist}"</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 font-sans">
                      <input
                        type="text"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder={`Ej: "Modifica el paso 2 para que utilicen materiales de reciclaje y no requiera internet"`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRefine();
                        }}
                        disabled={isRefining || isLoading}
                        className="flex-1 text-xs sm:text-sm bg-natural-bg border border-natural-border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-natural-accent/20 focus:border-natural-accent outline-none transition-all placeholder:text-natural-text-muted text-natural-text-main font-medium font-sans"
                      />
                      <button
                        onClick={handleRefine}
                        disabled={isRefining || !feedbackText.trim() || isLoading}
                        className="bg-natural-accent hover:bg-natural-accent-hover disabled:bg-natural-border text-white font-bold text-xs px-4 rounded-full flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer disabled:cursor-not-allowed font-sans"
                      >
                        {isRefining ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Refinando...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Ajustar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </article>
              </div>
            )}

          </section>

        </div>
      </main>

      {/* Primary educational footer */}
      <footer className="mt-auto border-t border-natural-border bg-natural-panel py-8 px-4 text-center text-natural-text-muted text-xs font-medium space-y-2 print:hidden transition-all duration-300">
        <p className="flex items-center justify-center gap-1 text-natural-text-main font-bold font-sans">
          <span>Robotifest Costa Rica</span>
          <span className="text-natural-text-muted">•</span>
          <span>Universidad de Costa Rica (UCR)</span>
          <span className="text-natural-text-muted">•</span>
          <span>Acción Social con Tecnología Humanista</span>
        </p>
        <p className="max-w-xl mx-auto leading-relaxed font-sans">
          Diseñado para facilitadores independientes, mentores de robótica comunal y talleres escolares bajo la metodología del aprendizaje cooperativo sustentable.
        </p>
        <p className="text-[10px] text-natural-text-muted/85 font-mono">
          © 2026 Universidad de Costa Rica. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
