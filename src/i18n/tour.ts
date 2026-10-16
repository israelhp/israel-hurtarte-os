// Guided-tour copy and steps, migrated from the prototype (template lines 1479–1510).
import type { Lang } from "./index";

export type TourText = { title: string; body: string; hint?: string };
export type TourStepId =
  "intro" | "dock" | "controls" | "folders" | "terminal" | "prefs" | "pv" | "done";

export const TOUR_TEXT: Record<Lang, Record<TourStepId, TourText>> = {
  en: {
    intro: {
      title: "Welcome to ISRAEL HURTARTE.OS",
      body: "This portfolio works like a desktop operating system. Take a 1-minute interactive tour to learn how to explore it.",
    },
    dock: {
      title: "The Dock",
      body: "Every icon in the dock opens a section of the portfolio as a window. Hover an icon to see its name.",
      hint: "click the Projects folder icon.",
    },
    controls: {
      title: "Window controls",
      body: "Red closes, yellow minimizes to the dock and green maximizes. Drag the title bar to move a window anywhere.",
      hint: "press the green button to maximize.",
    },
    folders: {
      title: "Explore the content",
      body: "Use the sidebar to filter by folder and open any card to see its full details, stack and architecture.",
      hint: 'click "View Details" on any project.',
    },
    terminal: {
      title: "Developer Terminal",
      body: "Prefer the keyboard? The terminal accepts commands like help, projects or whoami — or tap the command chips.",
      hint: "open the Terminal from the dock.",
    },
    prefs: {
      title: "Language & appearance",
      body: "Switch between Spanish and English, light and dark themes, and open Settings for accent colors. The ? button replays this tour.",
      hint: "switch the language or the theme.",
    },
    pv: {
      title: "Portfolio View",
      body: "Want a classic scrolling website instead? Portfolio View shows the same information as a traditional page.",
      hint: "click Portfolio View, or press Next.",
    },
    done: {
      title: "You're all set!",
      body: "Explore freely. Reopen this tutorial anytime with the ? button in the menu bar. A few terminal commands to try:",
    },
  },
  es: {
    intro: {
      title: "Bienvenido a ISRAEL HURTARTE.OS",
      body: "Este portafolio funciona como un sistema operativo de escritorio. Haz un recorrido interactivo de 1 minuto para aprender a explorarlo.",
    },
    dock: {
      title: "El Dock",
      body: "Cada ícono del dock abre una sección del portafolio como una ventana. Pasa el cursor sobre un ícono para ver su nombre.",
      hint: "haz clic en el ícono de carpeta de Proyectos.",
    },
    controls: {
      title: "Controles de ventana",
      body: "Rojo cierra, amarillo minimiza al dock y verde maximiza. Arrastra la barra de título para mover la ventana.",
      hint: "presiona el botón verde para maximizar.",
    },
    folders: {
      title: "Explora el contenido",
      body: "Usa la barra lateral para filtrar por carpeta y abre cualquier tarjeta para ver sus detalles, stack y arquitectura.",
      hint: 'haz clic en "Ver detalles" de cualquier proyecto.',
    },
    terminal: {
      title: "Terminal de desarrollador",
      body: "¿Prefieres el teclado? La terminal acepta comandos como help, projects o whoami — o toca los botones de comandos.",
      hint: "abre la Terminal desde el dock.",
    },
    prefs: {
      title: "Idioma y apariencia",
      body: "Cambia entre español e inglés, tema claro y oscuro, y abre Configuración para elegir el color de acento. El botón ? repite este tutorial.",
      hint: "cambia el idioma o el tema.",
    },
    pv: {
      title: "Vista portafolio",
      body: "¿Prefieres un sitio web clásico? La Vista portafolio muestra la misma información como una página tradicional.",
      hint: "haz clic en Vista portafolio, o presiona Siguiente.",
    },
    done: {
      title: "¡Listo!",
      body: "Explora libremente. Vuelve a abrir este tutorial cuando quieras con el botón ? de la barra superior. Algunos comandos para probar en la terminal:",
    },
  },
};

/** Spotlight target, the event that auto-advances the step, and the window to open first. */
export const TOUR_STEPS: { id: TourStepId; target: string | null; on?: string; prep?: string }[] = [
  {
    id: "intro",
    target: null,
  },
  {
    id: "dock",
    target: ".dock",
    on: "open:projects",
  },
  {
    id: "controls",
    target: '[data-win="projects"] .lights',
    on: "max:projects",
    prep: "projects",
  },
  {
    id: "folders",
    target: '[data-win="projects"] .wbody',
    on: "detail",
    prep: "projects",
  },
  {
    id: "terminal",
    target: '[data-tour="dock-terminal"]',
    on: "open:terminal",
  },
  {
    id: "prefs",
    target: '[data-tour="prefs"]',
    on: "theme",
  },
  {
    id: "pv",
    target: '[data-tour="pv"]',
    on: "portfolio",
  },
  {
    id: "done",
    target: null,
  },
];
