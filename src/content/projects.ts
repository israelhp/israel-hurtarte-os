// Generated once from the Claude Design prototype data (template lines 1086–1417); this file is now the source of truth.
import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "commerce",
    cover: 1,
    name: "Commerce Dashboard",
    tags: ["featured", "professional", "web", "databases"],
    primary: "web",
    desc: {
      en: "Admin web app to manage products, stock and inventory movements.",
      es: "App web de administración para gestionar productos, stock y movimientos de inventario.",
    },
    objective: {
      en: "Give store operators one fast place to track catalog and inventory.",
      es: "Dar a los operadores un único lugar rápido para controlar catálogo e inventario.",
    },
    features: {
      en: [
        "Product catalog with search and filters",
        "Inventory movements and low-stock alerts",
        "Role-based dashboard views",
        "Sales overview charts",
      ],
      es: [
        "Catálogo de productos con búsqueda y filtros",
        "Movimientos de inventario y alertas de stock bajo",
        "Vistas de dashboard por rol",
        "Gráficas de resumen de ventas",
      ],
    },
    stack: ["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    arch: "React SPA  →  REST API (Node.js)  →  PostgreSQL\n          ↳ auth middleware · validation · audit log",
    challenges: {
      en: [
        "Keeping stock consistent under concurrent updates",
        "Fast filtering over large catalogs",
      ],
      es: [
        "Mantener el stock consistente con actualizaciones concurrentes",
        "Filtrado rápido sobre catálogos grandes",
      ],
    },
    demoUrl: "",
    repoUrl: "",
    status: "demo",
    statusLabel: {
      en: "Demo · Completed",
      es: "Demo · Completado",
    },
  },
  {
    id: "fitness",
    cover: 2,
    name: "Fitness Tracker",
    tags: ["featured", "personal", "mobile"],
    primary: "mobile",
    desc: {
      en: "Mobile app to log workouts and visualize progress over time.",
      es: "App móvil para registrar entrenamientos y visualizar el progreso.",
    },
    objective: {
      en: "Make logging a workout take less than 30 seconds.",
      es: "Que registrar un entrenamiento tome menos de 30 segundos.",
    },
    features: {
      en: [
        "Workout templates and quick logging",
        "Progress charts per exercise",
        "Offline-first sync",
        "Personal records",
      ],
      es: [
        "Plantillas de rutina y registro rápido",
        "Gráficas de progreso por ejercicio",
        "Sincronización offline-first",
        "Récords personales",
      ],
    },
    stack: ["React Native", "Expo", "Supabase"],
    arch: "Expo app (React Native)  →  Supabase\n   ↳ local cache · auth · Postgres + RLS",
    challenges: {
      en: ["Conflict resolution for offline edits", "Smooth charts on low-end devices"],
      es: [
        "Resolución de conflictos en ediciones offline",
        "Gráficas fluidas en dispositivos de gama baja",
      ],
    },
    demoUrl: "",
    repoUrl: "",
    status: "demo",
    statusLabel: {
      en: "Demo · In progress",
      es: "Demo · En progreso",
    },
  },
  {
    id: "api",
    cover: 3,
    name: "Enterprise API",
    tags: ["featured", "professional", "backend", "databases"],
    primary: "backend",
    desc: {
      en: "Backend system with a modular architecture and clear domain boundaries.",
      es: "Sistema backend con arquitectura modular y límites de dominio claros.",
    },
    objective: {
      en: "Provide a maintainable API foundation that teams can extend safely.",
      es: "Ofrecer una base de API mantenible que los equipos puedan extender con seguridad.",
    },
    features: {
      en: [
        "Domain modules with DTO validation",
        "Versioned REST endpoints",
        "Centralized error handling and logging",
        "Containerized local environment",
      ],
      es: [
        "Módulos de dominio con validación de DTOs",
        "Endpoints REST versionados",
        "Manejo centralizado de errores y logs",
        "Entorno local en contenedores",
      ],
    },
    stack: ["Node.js", "NestJS", "SQL Server", "Docker"],
    arch: "Client  →  NestJS (controllers → services → repositories)\n                 →  SQL Server\nDocker Compose for local services",
    challenges: {
      en: ["Designing module boundaries that scale", "Transactional consistency across services"],
      es: ["Diseñar límites de módulos que escalen", "Consistencia transaccional entre servicios"],
    },
    demoUrl: "",
    repoUrl: "",
    status: "demo",
    statusLabel: {
      en: "Demo · Completed",
      es: "Demo · Completado",
    },
  },
  {
    id: "dblab",
    cover: 4,
    name: "Database Performance Lab",
    tags: ["personal", "databases", "devops"],
    primary: "databases",
    desc: {
      en: "Tooling to analyze and optimize queries and indexes.",
      es: "Herramientas para analizar y optimizar consultas e índices.",
    },
    objective: {
      en: "Compare query plans and index strategies side by side.",
      es: "Comparar planes de ejecución y estrategias de índices lado a lado.",
    },
    features: {
      en: [
        "Reproducible benchmark datasets",
        "Execution plan comparison",
        "Index suggestions report",
      ],
      es: [
        "Datasets de benchmark reproducibles",
        "Comparación de planes de ejecución",
        "Reporte de sugerencias de índices",
      ],
    },
    stack: ["SQL Server", "PostgreSQL", "Docker"],
    arch: "Docker (SQL Server + PostgreSQL)\n   ↳ seed scripts → benchmark runner → report",
    challenges: {
      en: [
        "Making benchmarks reproducible across engines",
        "Reading plans consistently between SQL Server and PostgreSQL",
      ],
      es: [
        "Hacer benchmarks reproducibles entre motores",
        "Interpretar planes de forma consistente entre SQL Server y PostgreSQL",
      ],
    },
    demoUrl: "",
    repoUrl: "",
    status: "demo",
    statusLabel: {
      en: "Demo · Prototype",
      es: "Demo · Prototipo",
    },
  },
  {
    id: "cicd",
    cover: 5,
    name: "CI/CD Automation",
    tags: ["personal", "devops", "web"],
    primary: "devops",
    desc: {
      en: "Demonstration of automated build, test and deployment pipelines.",
      es: "Demostración de pipelines automatizados de build, pruebas y despliegue.",
    },
    objective: {
      en: "Ship every merge to production safely and automatically.",
      es: "Llevar cada merge a producción de forma segura y automática.",
    },
    features: {
      en: [
        "Lint, test and build on every PR",
        "Preview deployments per branch",
        "Container image publishing",
      ],
      es: [
        "Lint, pruebas y build en cada PR",
        "Deploys de preview por rama",
        "Publicación de imágenes de contenedor",
      ],
    },
    stack: ["GitHub Actions", "Docker", "Vercel"],
    arch: "push / PR  →  GitHub Actions (lint · test · build)\n          →  Docker image  ·  Vercel preview → production",
    challenges: {
      en: ["Keeping pipelines fast with caching", "Managing secrets safely across environments"],
      es: [
        "Mantener pipelines rápidos con caché",
        "Manejar secretos de forma segura entre entornos",
      ],
    },
    demoUrl: "",
    repoUrl: "",
    status: "demo",
    statusLabel: {
      en: "Demo · Completed",
      es: "Demo · Completado",
    },
  },
];
