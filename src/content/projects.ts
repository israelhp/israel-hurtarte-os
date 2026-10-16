// Real projects supplied by the owner. The prototype's five fictional demo projects were removed on 2026-10-16
// at the owner's request (they are still visible in design/source/).
import type { Project } from "./types";

export const projects: Project[] = [
  // Real project supplied by the owner on 2026-10-16 (text as written by the owner; English is a faithful translation).
  // The site was opened the same day: "Zona de Ventas — Audio · Sorteos · Inmuebles". Folders "professional",
  // "personal" and "featured" are deliberately NOT assigned.
  {
    id: "zona-de-ventas-gt",
    status: "verified",
    cover: 3,
    name: "Zona de Ventas GT",
    tags: ["professional", "web", "backend", "databases"],
    primary: "web",
    statusLabel: { en: "Live", es: "En línea" },
    desc: {
      en: "Commercial web platform that centralizes products, promotions, raffles and real-estate listings.",
      es: "Plataforma web comercial que centraliza productos, promociones, sorteos y propiedades inmobiliarias.",
    },
    objective: {
      en: "Build a commercial web platform that centralizes the presentation of products, promotions, raffles and real-estate listings, offering an intuitive, modern browsing experience that adapts to different devices.",
      es: "Desarrollar una plataforma web comercial para centralizar la presentación de productos, promociones, sorteos y propiedades inmobiliarias, ofreciendo una experiencia de navegación intuitiva, moderna y adaptable a distintos dispositivos.",
    },
    features: {
      en: [
        "Digital catalog of products and services.",
        "Specialized sections for audio, raffles and real estate.",
        "Display of commercial information and listings.",
        "Responsive interface for mobile and desktop devices.",
        "Content organized by categories.",
      ],
      es: [
        "Catálogo digital de productos y servicios.",
        "Secciones especializadas en audio, sorteos e inmuebles.",
        "Visualización de información comercial y publicaciones.",
        "Interfaz responsive para dispositivos móviles y escritorio.",
        "Organización de contenido por categorías.",
      ],
    },
    stack: ["React", "TypeScript", "Node.js", "Supabase", "PostgreSQL", "SQL"],
    arch: "React + TypeScript (reusable components)  →  Node.js (backend services)\n          →  Supabase · PostgreSQL (relational persistence)",
    archNote: {
      en: "Web architecture based on reusable components with React and TypeScript, backend services with Node.js and relational persistence through Supabase and PostgreSQL.",
      es: "Arquitectura web basada en componentes reutilizables con React y TypeScript, servicios backend con Node.js y persistencia relacional mediante Supabase y PostgreSQL.",
    },
    challenges: {
      en: [
        "Designing a solution that adapts to different types of commercial content.",
        "Organizing relational data.",
        "Optimizing the user experience.",
        "Keeping a modular, scalable code structure.",
      ],
      es: [
        "Diseño de una solución adaptable a diferentes tipos de contenido comercial.",
        "Organización de datos relacionales.",
        "Optimización de la experiencia de usuario.",
        "Mantenimiento de una estructura de código modular y escalable.",
      ],
    },
    demoUrl: "https://www.zonadeventasgt.com/",
    repoUrl: "",
  },
  // Supplied by the owner on 2026-10-16 as a professional project (text as written; English is a faithful translation).
  {
    id: "visionbitt",
    status: "verified",
    cover: 2,
    name: "VisionBitt — Digital Agency Website",
    tags: ["professional", "web"],
    primary: "web",
    statusLabel: { en: "Live", es: "En línea" },
    desc: {
      en: "Corporate website for a web development and digital marketing agency, built to win new clients.",
      es: "Sitio web corporativo para una agencia de desarrollo web y marketing digital, orientado a captar nuevos clientes.",
    },
    objective: {
      en: "Build a corporate web platform for VisionBitt that strengthens its digital presence, presents its web development and digital marketing services, and makes it easier to win new clients through a modern, interactive, adaptable interface.",
      es: "Desarrollar una plataforma web corporativa para VisionBitt, orientada a fortalecer su presencia digital, presentar sus servicios de desarrollo web y marketing digital, y facilitar la captación de nuevos clientes mediante una interfaz moderna, interactiva y adaptable.",
    },
    features: {
      en: [
        "Corporate landing page with a modern visual identity.",
        "Presentation of web development and digital marketing services.",
        "Display of commercial plans and their benefits.",
        "Calls to action to attract clients.",
        "Testimonials and commercial references section.",
        "Access to educational content and promotions.",
        "Intuitive navigation between sections.",
      ],
      es: [
        "Landing page corporativa con identidad visual moderna.",
        "Presentación de servicios de desarrollo web y marketing digital.",
        "Visualización de planes comerciales y sus beneficios.",
        "Integración de llamadas a la acción para captar clientes.",
        "Sección de testimonios y referencias comerciales.",
        "Acceso a contenido educativo y promociones.",
        "Navegación intuitiva entre las diferentes secciones.",
      ],
    },
    stack: ["JavaScript", "HTML5", "CSS3"],
    arch: "Independent sections + UI components + visual assets\n          →  Responsive design (multiple devices)",
    archNote: {
      en: "Corporate website organized into independent sections, interface components and visual assets, focused on maintainability, user experience and adaptation to multiple devices.",
      es: "Sitio web corporativo organizado mediante secciones independientes, componentes de interfaz y recursos visuales, con un enfoque en mantenibilidad, experiencia de usuario y adaptación a múltiples dispositivos.",
    },
    challenges: {
      en: [
        "Designing a visually attractive interface.",
        "Organizing commercial content.",
        "Optimizing navigation.",
        "Responsive adaptation.",
        "Structuring the elements needed to communicate the company's services and value propositions.",
      ],
      es: [
        "Diseño de una interfaz visualmente atractiva.",
        "Organización de contenido comercial.",
        "Optimización de la navegación.",
        "Adaptación responsive.",
        "Estructuración de los elementos necesarios para comunicar los servicios y propuestas de valor de la empresa.",
      ],
    },
    demoUrl: "https://www.visionbitt.net/",
    repoUrl: "",
  },
  // Supplied by the owner on 2026-10-16 as a "web development project | Frontend Development" (text as written; English
  // is a faithful translation). The owner confirmed afterwards that it is a personal project.
  {
    id: "vetcare",
    status: "verified",
    cover: 4,
    name: "VetCare — Veterinary Website",
    tags: ["personal", "web"],
    primary: "web",
    statusLabel: { en: "Live", es: "En línea" },
    desc: {
      en: "Website for the veterinary sector that presents a clinic's animal care and wellness services.",
      es: "Página web para el sector veterinario que presenta los servicios de atención y bienestar animal de una clínica.",
    },
    objective: {
      en: "Build a website for the veterinary sector that presents animal care and wellness services, strengthens a clinic's digital presence and offers pet owners an intuitive, accessible experience.",
      es: "Desarrollar una página web para el sector veterinario que permita presentar servicios de atención y bienestar animal, fortalecer la presencia digital de una clínica y proporcionar una experiencia intuitiva y accesible para los propietarios de mascotas.",
    },
    features: {
      en: [
        "Presentation of the clinic's institutional information.",
        "Visual organization of veterinary services.",
        "Intuitive navigation between sections.",
        "Web design that adapts to different devices.",
        "Contact elements and calls to action.",
      ],
      es: [
        "Presentación de información institucional de la clínica.",
        "Organización visual de los servicios veterinarios.",
        "Navegación intuitiva entre secciones.",
        "Diseño web adaptable a diferentes dispositivos.",
        "Elementos de contacto y llamadas a la acción.",
      ],
    },
    stack: ["JavaScript", "HTML5", "CSS3", "Vercel"],
    arch: "Modular frontend (reusable components)\n          →  Vercel (deployment)",
    archNote: {
      en: "Website with a modular frontend architecture, oriented to component reuse, content organization and ease of maintenance, deployed with Vercel.",
      es: "Sitio web con arquitectura frontend modular, orientada a la reutilización de componentes, organización de contenido y facilidad de mantenimiento, con despliegue mediante Vercel.",
    },
    challenges: {
      en: [
        "Designing an attractive interface for the veterinary sector.",
        "Organizing informational content.",
        "Adapting to mobile devices.",
        "Optimizing visual resources.",
        "Implementing a simple browsing experience.",
      ],
      es: [
        "Diseño de una interfaz atractiva para el sector veterinario.",
        "Organización del contenido informativo.",
        "Adaptación a dispositivos móviles.",
        "Optimización de recursos visuales.",
        "Implementación de una experiencia de navegación sencilla.",
      ],
    },
    demoUrl: "https://pg-veterinaria.vercel.app/",
    repoUrl: "",
  },
  // Supplied by the owner on 2026-10-16 as an academic project (text as written; English is a faithful translation).
  // Not published: no URL. Its screen recording goes in public/videos/quetxal-tv.mp4 (see docs/content/EDITING.md).
  // Academic: neither the "personal" nor the "professional" folder is assigned.
  {
    id: "quetxal-tv",
    status: "verified",
    cover: 5,
    name: "Quetxal TV — Video Streaming Platform",
    tags: ["web", "backend", "databases", "devops"],
    primary: "web",
    statusLabel: { en: "Academic project", es: "Proyecto académico" },
    video: { src: "/videos/quetxal-tv.mp4" },
    desc: {
      en: "Netflix-inspired video-on-demand platform built on a distributed, polyglot microservices architecture.",
      es: "Plataforma de video bajo demanda inspirada en Netflix, construida sobre una arquitectura distribuida de microservicios políglota.",
    },
    objective: {
      en: "Design and develop a video-on-demand streaming platform, inspired by Netflix, using a distributed microservices architecture to manage multimedia content, users, subscriptions, playback history and personalized recommendations.",
      es: "Diseñar y desarrollar una plataforma de streaming de video bajo demanda, inspirada en Netflix, utilizando una arquitectura distribuida de microservicios para gestionar contenido multimedia, usuarios, suscripciones, historial de reproducción y recomendaciones personalizadas.",
    },
    features: {
      en: [
        "User authentication and multiple profile management.",
        "Catalog of movies and series with search and filters.",
        "Subscription and commercial plan management.",
        "Media playback with history and progress tracking.",
        "Personalized recommendation system.",
        "Content ratings and reviews.",
        "Parental controls and per-profile restrictions.",
        "Watch Party rooms for synchronized playback.",
        "Automatic email notifications.",
        "Administrative panel for content management and audits.",
      ],
      es: [
        "Autenticación de usuarios y gestión de múltiples perfiles.",
        "Catálogo de películas y series con búsqueda y filtros.",
        "Gestión de suscripciones y planes comerciales.",
        "Reproducción multimedia con historial y seguimiento del progreso.",
        "Sistema de recomendaciones personalizadas.",
        "Calificaciones y valoraciones de contenido.",
        "Control parental y restricciones por perfil.",
        "Salas Watch Party para reproducción sincronizada.",
        "Notificaciones automáticas por correo electrónico.",
        "Panel administrativo para gestión de contenido y auditorías.",
      ],
    },
    // card: the technologies that best describe the project (the detail lists all 21)
    cardStack: ["React", "NestJS", "Go", "Kubernetes"],
    stack: [
      "React",
      "Vite",
      "TypeScript",
      "Node.js",
      "NestJS",
      "Go",
      "Python",
      "PostgreSQL",
      "Redis",
      "gRPC",
      "Protocol Buffers",
      "Docker",
      "Kubernetes",
      "Google Cloud Platform",
      "Terraform",
      "Ansible",
      "Helm",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
      "ELK Stack",
    ],
    arch: "React + Vite (web client)  →  NestJS (API Gateway)\n          →  gRPC · Protocol Buffers  →  TypeScript · Go · Python services  →  PostgreSQL (per service)\n          →  Docker · Kubernetes (GKE) · Helm · Terraform · Ansible  →  GitHub Actions · Prometheus · Grafana · ELK",
    archNote: {
      en: "Polyglot microservices architecture with services written in TypeScript, Go and Python. Internal communication through gRPC and Protocol Buffers, a NestJS-based API Gateway and independent persistence with PostgreSQL. Infrastructure designed for Google Kubernetes Engine, using Docker, Kubernetes, Helm, Terraform and Ansible, with CI/CD pipelines on GitHub Actions and observability tools such as Prometheus, Grafana and the ELK Stack.",
      es: "Arquitectura de microservicios políglota con servicios desarrollados en TypeScript, Go y Python. Comunicación interna mediante gRPC y Protocol Buffers, API Gateway basado en NestJS y persistencia independiente con PostgreSQL. Infraestructura diseñada para Google Kubernetes Engine, utilizando Docker, Kubernetes, Helm, Terraform y Ansible, con pipelines CI/CD mediante GitHub Actions y herramientas de observabilidad como Prometheus, Grafana y ELK Stack.",
    },
    challenges: {
      en: [
        "Designing a distributed architecture.",
        "Standardizing contracts across multiple languages.",
        "Coordinating data between independent services.",
        "Implementing security mechanisms.",
        "Real-time playback synchronization.",
        "Deployment automation.",
        "Configuring scalability and monitoring strategies.",
      ],
      es: [
        "Diseño de una arquitectura distribuida.",
        "Estandarización de contratos entre múltiples lenguajes.",
        "Coordinación de datos entre servicios independientes.",
        "Implementación de mecanismos de seguridad.",
        "Sincronización de reproducción en tiempo real.",
        "Automatización de despliegues.",
        "Configuración de estrategias de escalabilidad y monitoreo.",
      ],
    },
    demoUrl: "",
    repoUrl: "",
  },
  // Supplied by the owner on 2026-10-16 as a personal frontend project (text as written; English is a faithful
  // translation). The site was opened the same day: "Curso Completo de Inglés — A1 a C2" with a progress tracker
  // and a restart option. The owner calls the link a "Demo", so the button says so.
  {
    id: "learn-english",
    status: "verified",
    cover: 1,
    name: "Learn English — Interactive Learning Platform",
    tags: ["personal", "web"],
    primary: "web",
    statusLabel: { en: "Live", es: "En línea" },
    linkKind: "demo",
    desc: {
      en: "Interactive web platform for self-paced English learning, with structured content from level A1 to C2.",
      es: "Plataforma web interactiva para el aprendizaje autónomo del inglés, con contenido estructurado desde el nivel A1 hasta el C2.",
    },
    objective: {
      en: "Build an educational, interactive web platform that makes self-paced English learning easier, offering structured content from level A1 to C2.",
      es: "Desarrollar una plataforma web educativa e interactiva para facilitar el aprendizaje autónomo del inglés, ofreciendo contenido estructurado desde el nivel A1 hasta el C2.",
    },
    features: {
      en: [
        "Educational content organized by English level (A1–C2).",
        "Search for topics, vocabulary and grammar rules.",
        "Visual tracking of learning progress.",
        "Option to reset the user's progress.",
        "Intuitive navigation between educational sections.",
      ],
      es: [
        "Contenido educativo organizado por niveles de inglés (A1–C2).",
        "Buscador de temas, vocabulario y reglas gramaticales.",
        "Seguimiento visual del progreso de aprendizaje.",
        "Opción para reiniciar el avance del usuario.",
        "Navegación intuitiva entre secciones educativas.",
      ],
    },
    stack: ["React", "JavaScript", "Node.js", "HTML5", "CSS3", "Vercel"],
    arch: "React (reusable components + state management)\n          →  Vercel (static deployment, no backend of its own)",
    archNote: {
      en: "Frontend application built with React, using reusable components and state management to provide an interactive learning experience. Deployed on Vercel, with no need for a backend server of its own.",
      es: "Aplicación frontend desarrollada con React, utilizando componentes reutilizables y gestión de estados para proporcionar una experiencia de aprendizaje interactiva. Desplegada en Vercel, sin necesidad de un servidor backend propio.",
    },
    challenges: {
      en: [
        "Organizing educational content.",
        "Implementing interactive features.",
        "State management.",
        "Optimizing the user experience.",
        "Deploying a frontend application.",
      ],
      es: [
        "Organización de contenido educativo.",
        "Implementación de funcionalidades interactivas.",
        "Gestión de estados.",
        "Optimización de la experiencia de usuario.",
        "Despliegue de una aplicación frontend.",
      ],
    },
    demoUrl: "https://learn-english-ivory.vercel.app/",
    repoUrl: "",
  },
];
