// Generated once from the Claude Design prototype data (template lines 1086–1417); this file is now the source of truth.
import type { Category, Skill } from "./types";

export const categories: Category[] = [
  {
    id: "frontend",
    short: "FE",
    label: {
      en: "Frontend",
      es: "Frontend",
    },
  },
  {
    id: "backend",
    short: "BE",
    label: {
      en: "Backend",
      es: "Backend",
    },
  },
  {
    id: "mobile",
    short: "MO",
    label: {
      en: "Mobile",
      es: "Móvil",
    },
  },
  {
    id: "databases",
    short: "DB",
    label: {
      en: "Databases",
      es: "Bases de datos",
    },
  },
  {
    id: "devops",
    short: "DO",
    label: {
      en: "DevOps",
      es: "DevOps",
    },
  },
];

export const categoryDescriptions = {
  frontend: {
    en: "User interfaces, component systems and the client-side experience.",
    es: "Interfaces de usuario, sistemas de componentes y la experiencia del lado del cliente.",
  },
  backend: {
    en: "Business logic, services and APIs that power the product.",
    es: "Lógica de negocio, servicios y APIs que impulsan el producto.",
  },
  mobile: {
    en: "Cross-platform mobile apps for iOS and Android.",
    es: "Aplicaciones móviles multiplataforma para iOS y Android.",
  },
  databases: {
    en: "Data modeling, persistence, querying and performance.",
    es: "Modelado de datos, persistencia, consultas y rendimiento.",
  },
  devops: {
    en: "Versioning, automation, delivery and infrastructure.",
    es: "Versionado, automatización, entrega e infraestructura.",
  },
} satisfies Record<Category["id"], Skill["desc"]>;

export const skills: Skill[] = [
  {
    name: "React",
    mono: "Re",
    cat: "frontend",
    desc: {
      en: "Component-based UI library for interactive interfaces.",
      es: "Librería de UI basada en componentes para interfaces interactivas.",
    },
  },
  {
    name: "Next.js",
    mono: "Nx",
    cat: "frontend",
    desc: {
      en: "React framework with routing, SSR and server components.",
      es: "Framework de React con rutas, SSR y server components.",
    },
  },
  {
    name: "JavaScript",
    mono: "JS",
    cat: "frontend",
    desc: {
      en: "The language of the web, on client and server.",
      es: "El lenguaje de la web, en cliente y servidor.",
    },
  },
  {
    name: "TypeScript",
    mono: "TS",
    cat: "frontend",
    desc: {
      en: "Typed JavaScript for safer, scalable codebases.",
      es: "JavaScript tipado para código más seguro y escalable.",
    },
  },
  {
    name: "HTML5",
    mono: "H5",
    cat: "frontend",
    desc: {
      en: "Semantic, accessible markup.",
      es: "Marcado semántico y accesible.",
    },
  },
  {
    name: "CSS3",
    mono: "C3",
    cat: "frontend",
    desc: {
      en: "Layout, theming and motion for the web.",
      es: "Layout, temas y animación para la web.",
    },
  },
  {
    name: "Tailwind CSS",
    mono: "Tw",
    cat: "frontend",
    desc: {
      en: "Utility-first styling for fast, consistent UI.",
      es: "Estilos utility-first para UI rápida y consistente.",
    },
  },
  {
    name: "Redux",
    mono: "Rx",
    cat: "frontend",
    desc: {
      en: "Predictable global state management.",
      es: "Manejo predecible de estado global.",
    },
  },
  {
    name: "Vite",
    mono: "Vi",
    cat: "frontend",
    desc: {
      en: "Lightning-fast dev server and bundler.",
      es: "Servidor de desarrollo y bundler ultrarrápido.",
    },
  },
  {
    name: "Node.js",
    mono: "No",
    cat: "backend",
    desc: {
      en: "JavaScript runtime for servers and tooling.",
      es: "Runtime de JavaScript para servidores y herramientas.",
    },
  },
  {
    name: "Express",
    mono: "Ex",
    cat: "backend",
    desc: {
      en: "Minimal HTTP framework for Node.js.",
      es: "Framework HTTP minimalista para Node.js.",
    },
  },
  {
    name: "NestJS",
    mono: "Ne",
    cat: "backend",
    desc: {
      en: "Modular, structured Node.js backend framework.",
      es: "Framework backend modular y estructurado para Node.js.",
    },
  },
  {
    name: "C++",
    mono: "C+",
    cat: "backend",
    desc: {
      en: "High-performance systems programming.",
      es: "Programación de sistemas de alto rendimiento.",
    },
  },
  {
    name: "Java / Spring Boot",
    mono: "Jv",
    cat: "backend",
    desc: {
      en: "JVM language and framework for enterprise backends.",
      es: "Lenguaje y framework de la JVM para backends empresariales.",
    },
  },
  {
    name: "C# / .NET Core",
    mono: "C#",
    cat: "backend",
    desc: {
      en: "Microsoft's managed language and platform for services and APIs.",
      es: "Lenguaje y plataforma de Microsoft para servicios y APIs.",
    },
  },
  {
    name: "REST APIs",
    mono: "AP",
    cat: "backend",
    desc: {
      en: "Resource-oriented HTTP API design.",
      es: "Diseño de APIs HTTP orientadas a recursos.",
    },
  },
  {
    name: "React Native",
    mono: "RN",
    cat: "mobile",
    desc: {
      en: "Native mobile apps written in React.",
      es: "Apps móviles nativas escritas en React.",
    },
  },
  {
    name: "Expo",
    mono: "Eo",
    cat: "mobile",
    desc: {
      en: "Toolchain to build and ship React Native apps.",
      es: "Herramientas para construir y publicar apps React Native.",
    },
  },
  {
    name: "SQL Server",
    mono: "MS",
    cat: "databases",
    desc: {
      en: "Enterprise relational database engine.",
      es: "Motor de base de datos relacional empresarial.",
    },
  },
  {
    name: "PostgreSQL",
    mono: "Pg",
    cat: "databases",
    desc: {
      en: "Powerful open-source relational database.",
      es: "Potente base de datos relacional open source.",
    },
  },
  {
    name: "SQL",
    mono: "SQ",
    cat: "databases",
    desc: {
      en: "Standard language for querying and managing relational data.",
      es: "Lenguaje estándar para consultar y administrar datos relacionales.",
    },
  },
  {
    name: "MongoDB",
    mono: "Mg",
    cat: "databases",
    desc: {
      en: "Document-oriented NoSQL database.",
      es: "Base de datos NoSQL orientada a documentos.",
    },
  },
  {
    name: "Redis",
    mono: "Rd",
    cat: "databases",
    desc: {
      en: "In-memory store for caching and queues.",
      es: "Almacén en memoria para caché y colas.",
    },
  },
  {
    name: "Supabase",
    mono: "Sb",
    cat: "databases",
    desc: {
      en: "Postgres platform with auth, storage and RLS.",
      es: "Plataforma Postgres con auth, storage y RLS.",
    },
  },
  {
    name: "Prisma",
    mono: "Pr",
    cat: "databases",
    desc: {
      en: "Type-safe ORM for Node.js and TypeScript.",
      es: "ORM con tipado seguro para Node.js y TypeScript.",
    },
  },
  {
    name: "Docker",
    mono: "Dk",
    cat: "devops",
    desc: {
      en: "Containers for reproducible environments.",
      es: "Contenedores para entornos reproducibles.",
    },
  },
  {
    name: "Git",
    mono: "Gt",
    cat: "devops",
    desc: {
      en: "Distributed version control.",
      es: "Control de versiones distribuido.",
    },
  },
  {
    name: "GitHub",
    mono: "GH",
    cat: "devops",
    desc: {
      en: "Code hosting, reviews and collaboration.",
      es: "Alojamiento de código, revisiones y colaboración.",
    },
  },
  {
    name: "GitHub Actions",
    mono: "GA",
    cat: "devops",
    desc: {
      en: "Workflow automation for CI/CD.",
      es: "Automatización de flujos para CI/CD.",
    },
  },
  {
    name: "Linux",
    mono: "Lx",
    cat: "devops",
    desc: {
      en: "The operating system behind most servers.",
      es: "El sistema operativo detrás de la mayoría de servidores.",
    },
  },
  {
    name: "Vercel",
    mono: "Vc",
    cat: "devops",
    desc: {
      en: "Frontend cloud for previews and deployments.",
      es: "Nube frontend para previews y despliegues.",
    },
  },
  {
    name: "CI/CD",
    mono: "CI",
    cat: "devops",
    desc: {
      en: "Automated build, test and release pipelines.",
      es: "Pipelines automatizados de build, pruebas y release.",
    },
  },
];
