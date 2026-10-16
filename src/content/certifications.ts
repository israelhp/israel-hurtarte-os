// Categories come from the Claude Design prototype. The certifications below are the owner's real EDteam courses:
// each public profile page was opened on 2026-10-16 and shows a certificate in the owner's name with this exact
// course title. No page shows an issue date (only some course editions carry a year), so `date` is left out on purpose.
import type { Certification, CertCategory } from "./types";

export const certCategories: CertCategory[] = [
  {
    id: "all",
    label: {
      en: "All",
      es: "Todas",
    },
  },
  {
    id: "cloud",
    label: {
      en: "Cloud",
      es: "Nube",
    },
  },
  {
    id: "dev",
    label: {
      en: "Development",
      es: "Desarrollo",
    },
  },
  {
    id: "data",
    label: {
      en: "Data",
      es: "Datos",
    },
  },
  {
    id: "security",
    label: {
      en: "Security",
      es: "Seguridad",
    },
  },
];

/** Docker has no better fit among the four prototype categories (EDteam files it under DevOps); everything else is development. */
export const certifications: Certification[] = [
  {
    status: "verified",
    name: "HTML5 Avanzado - Progressive Web Apps",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/pwa-old",
  },
  {
    status: "verified",
    name: "HTML desde cero",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/html-old",
  },
  {
    status: "verified",
    name: "JavaScript Desde Cero",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/javascript-old",
  },
  {
    status: "verified",
    name: "Programación orientada a objetos con JavaScript",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/js-poo-old",
  },
  {
    status: "verified",
    name: "JavaScript en el navegador",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/js-dom-2018",
  },
  {
    status: "verified",
    name: "Ajax y WebSockets",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/ajax-ws",
  },
  {
    status: "verified",
    name: "Single Page Aplication con JavaScript",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/spa",
  },
  {
    status: "verified",
    name: "Responsive Web Design",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/rwd",
  },
  {
    status: "verified",
    name: "Node.js Desde Cero",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/nodejs-old2018",
  },
  {
    status: "verified",
    name: "Express y Socket IO",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/express-socketio",
  },
  {
    status: "verified",
    name: "Android Desde Cero",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/android-2019",
  },
  {
    status: "verified",
    name: "React - Manejo del estado de la aplicación",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/react-state",
  },
  {
    status: "verified",
    name: "TypeScript Desde Cero",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/typescript-2019",
  },
  {
    status: "verified",
    name: "Java Enterprise Edition (Java EE)",
    org: "EDteam",
    cat: "dev",
    link: "https://ed.team/u/israelhurtartepinto/curso/java-ee",
  },
  {
    status: "verified",
    name: "Docker desde cero",
    org: "EDteam",
    cat: "cloud",
    link: "https://ed.team/u/israelhurtartepinto/curso/docker-2020",
  },
];
