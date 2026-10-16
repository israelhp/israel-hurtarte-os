# PHASE 0 — Auditoría y propuesta · ISRAEL HURTARTE.OS

Fecha: 2026-10-15 · Estado: **propuesta pendiente de aprobación** (no se ha escrito código de producto).

## 1. Repositorio

| Hallazgo           | Detalle                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Contenido          | `README.md` (vacío), `design/source/claude-design/DEV.OS — Interactive Portfolio – DEV.OS Desktop.html` (342 KB)           |
| Git                | **No es repositorio git** (se inicializa en Fase 1)                                                                        |
| Nombres de carpeta | `desing` / `claude-desing` (typo, renamed in Phase 1). El master prompt exige `design/source/claude-design/` → decisión D1 |
| Toolchain          | Node 22.14, npm 10.9, git 2.39 · Chrome y Brave instalados (útil para Playwright/visual)                                   |

## 2. Qué es realmente el HTML

No es una página estática: es un **bundle de Claude Design** con 5 scripts en `<script type="__bundler/*">`:

- `template` (156 KB, 1960 líneas): CSS + markup + lógica del prototipo.
- `manifest`: 5 recursos comprimidos/base64 → runtime `dc-runtime` (45 KB), React 18.3.1 y ReactDOM 18.3.1 UMD, 2 fuentes woff2.
- El markup usa un **dialecto propio** (`<sc-if>`, `<sc-for>`, `sc-camel-on-click`, `{{...}}`) y un `class Component extends DCLogic` (estado + `renderVals()`).
- Se extrajo de forma **estática** (script Python, sin ejecutar nada del bundle) en el scratchpad; solo se renderizó en Chrome headless con perfil aislado.
- Ya dice `ISRAEL HURTARTE.OS` en título, logo, wall-mark, tour, terminal. Restos de "DEV.OS": nombre de archivo, `data-label="DEV.OS Desktop"`, y la clave `localStorage` `devos-tour-done`.
- Renderizado verificado: desktop 1440×900 (tour de bienvenida sobre Welcome + Dock) y 390×844. Las capturas están en el scratchpad de la sesión, no en el repo. Solo se vio el estado inicial con tour; el resto se auditó por código. **Verificación visual de las demás ventanas: NOT_VERIFIED** hasta Fase 2/8.

## 3. Mapa de funcionalidades (del código real)

**Menubar (40 px)**: logo→Home, rol, 4 enlaces (Projects, Stack, Terminal, Contact), reloj (cada 20 s), botón Portfolio View, selector ES/EN, toggle tema, Settings, botón `?` (tour).
**Atajos de escritorio** (≥1100 px): Projects, README.md→About, Terminal, Portfolio View.
**Settings** (popover, no ventana): apariencia light/dark/auto, 8 acentos (blue, purple, pink, red, orange, yellow, green, graphite), idioma, tour, reset de ventanas, Portfolio View.
**Dock**: 9 apps, separador antes de Terminal, indicador "running", tooltip, magnificación por hover (vecinos escalonados vía `:has()`).

| ID      | App             | Contenido / interacción                                                                                                                                    | Datos en el diseño                                          |
| ------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| APP-001 | Home/Welcome    | wordmark, rol, tagline, ubicación, 3 CTAs, tip `help`                                                                                                      | real                                                        |
| APP-002 | About           | avatar IH, bio, 10 especialidades, enlaces, botón CV (deshabilitado si `cvUrl` vacío)                                                                      | real; CV sin configurar                                     |
| APP-003 | Tech Stack      | sidebar 6 categorías + contador, búsqueda, 28 tarjetas, panel de detalle (+ proyectos relacionados)                                                        | 28 skills reales                                            |
| APP-004 | Projects        | sidebar 9 carpetas (all/featured/personal/professional/web/mobile/backend/databases/devops), grid, detalle (objetivo, features, arquitectura ASCII, retos) | **5 proyectos DEMO ficticios**, sin URLs                    |
| APP-005 | Career Timeline | acordeón por rol, responsabilidades, logros, techGroups; grupos Work / Independent                                                                         | **real**, 3 entradas                                        |
| APP-006 | Education       | 3 tarjetas                                                                                                                                                 | real (UMG maestría en curso, UMG ingeniería, Colegio Verbo) |
| APP-007 | Certifications  | filtros 5 categorías + tarjetas                                                                                                                            | **4 PLACEHOLDER**                                           |
| APP-008 | Terminal        | prompt `visitor@hurtarte:~$`, typing intro, chips, Tab, ↑/↓ historial                                                                                      | allowlist de 10 comandos, sin `eval` ✔                      |
| APP-009 | Contact         | enlaces, CV, formulario                                                                                                                                    | formulario **demo honesto** (no envía)                      |

**Comandos terminal**: `help about skills projects experience education certifications contact whoami clear`.
**Portfolio Mode**: página scroll distinta (nav sticky, hero, 7 secciones numeradas 01–07, footer), con ES/EN, tema y volver a desktop. No es el escritorio encogido ✔.
**Tour**: 8 pasos (`intro, dock, controls, folders, terminal, prefs, pv, done`), spotlight con `clip-path` + anillo, avance automático por eventos, medición cada 250 ms, auto-inicio a los 900 ms si no existe `devos-tour-done`; al terminar resetea ventanas.

## 4. Window Manager del prototipo

- Estado por app: `open, min, max, anim, x, y, w, h, z`; `zTop` global y `active`.
- Tamaños: home 600×480, about 760×580, stack 1000×620, projects 1040×650, experience 860×660, education 760×660, certs 880×580, terminal 720×460, contact 860×600. `TOP=40`, `DOCK_SPACE=92`.
- Cascada de 26 px (ciclo de 6), `clampGeo` mantiene la ventana visible (mín. 280×220), `onResize` re-clampa.
- Maximizar = clase CSS `.max` (8 px de margen, deja espacio al dock). Minimizar anima y oculta; clic en Dock restaura. Doble clic en barra = maximizar. Arrastre por pointer events; deshabilitado maximizada o ≤760 px.
- **Debilidades a corregir (sin cambiar el diseño)**: cada `pointermove` hace `setState` del componente raíz (re-render de todo); sin teclado para mover/cerrar (Esc, foco); la barra de título no es operable por teclado; minimizada no se distingue en el dock; ≤760 px las ventanas se fuerzan a pantalla completa con `!important`; el tour modal no atrapa/gestiona foco; el popover de Settings no gestiona foco ni Esc; z-index crece sin tope.

## 5. Design tokens extraídos (valores reales)

- **Tipografía**: Geist (sans) y Geist Mono (wordmark, terminal, chips mono, eyebrow). Base 14 px / 1.5. Pesos usados 400–600.
- **Temas**: `.theme-dark` y `.theme-light` con ~60 variables (paleta macOS: `--blue #0A84FF/#007AFF`, purple, pink, red, orange, yellow, green, mint, teal, cyan, indigo, brown, gray, `--steel #8FA9C4/#4F6D8C`; `--label/2/3`, `--sep/2`, `--win`, `--title`, `--side`, `--sheet`, `--card`, `--fill/2`, `--menubar`, `--dock`, `--pop`, `--shadow`, `--desk` fondo con 5 gradientes radiales).
- **Acento** dinámico `--acc` (+ `--acc-on`, `--acc-soft` con `color-mix`).
- **Radios**: ventana 12, dock 22, tile dock 13, botones 7–8, chips 999. **Bordes** `.5px`. **Sombras** `--shadow`, dock `0 18px 40px -16px`.
- **Blur**: `backdrop-filter: blur(30–40px) saturate(180%)` en topbar, dock, ventanas, popover, tour. _(Nota: el master prompt dice no añadir blur que no exista; el prototipo sí lo usa, se conserva.)_
- **Motion**: `winIn .22s`, `winOut .16s`, `winMin .2s`, `popIn .16s`, `cardIn .28s`, dock `.18s cubic-bezier(.2,.8,.2,1)`, tour `.35s`, `blink`, `ringPulse`, `hintPulse`. `prefers-reduced-motion` ya respetado globalmente.
- **Breakpoints**: media 1100 y 760; container queries 880 / 680 / 620 / 560 dentro de `.wbody`.
- **Iconos**: ~20 SVG inline stroke 1.75 (set estilo Lucide) → se extraen a componentes; no hay assets raster.
- **Rastro por app** (`.t-*`): home blue, about steel, stack indigo, projects cyan, experience teal, education steel, certs orange, contact blue, terminal verde sobre fondo oscuro.

## 6. Inventario de componentes

Shell: `Desktop`, `Wallpaper`, `MenuBar`, `DesktopShortcuts`, `Dock/DockItem`, `SettingsPopover`, `Tour`. WM: `Window`, `TitleBar`, `TrafficLights`, `windowStore`. Compartidos: `Chip`, `Status/DemoTag`, `Card`, `Note/Banner`, `Button`, `Segmented`, `SearchField`, `SplitLayout (Side/Main/Detail)`, `TechCard/Mono`, `ProjectCard/Cover`, `Timeline/TimelineItem`, `EduCard`, `CertCard`, `FilterPills`, `LinkRow`, `Terminal`, `ContactForm`. Vista alternativa: `PortfolioView` + secciones.

## 7. Responsive y animaciones

- ≥1100: desktop completo. 760–1100: sin atajos ni enlaces de menubar. ≤760: logo corto `IH.OS`, ventanas a pantalla completa, dock inferior scrollable con etiquetas visibles, sin magnificación.
- En la captura 390×844 la tarjeta del tour parece desbordar por la derecha; **no concluyente** (Chrome headless impone ancho mínimo de ventana). Verificar en Fase 6.
- Costo: muchos `backdrop-filter` apilados + re-render global → riesgo en móviles de gama baja.

## 8. Propuesta de estructura Next.js

```
src/app/                      layout, [lang]/page, sitemap, robots, opengraph
src/features/{desktop,window-manager,dock,portfolio,terminal,tour,settings,contact,projects}/
src/features/apps/{home,about,stack,experience,education,certs}/   # contenido de ventanas
src/shared/{components,theme}/   src/content/   src/lib/   src/i18n/
```

Decisiones técnicas recomendadas: Next 15 App Router, **export estático**, TypeScript estricto, Tailwind para layout/utilidades **+ tokens CSS del diseño** (variables como están, no reinterpretadas), store del WM externo (`useSyncExternalStore` o Zustand ~1 KB) con selectores por ventana, arrastre vía `transform` + `requestAnimationFrame` y commit al soltar, animaciones en CSS nativo (sin Motion), fuentes con `next/font` (Geist / Geist Mono self-hosted), iconos como componentes SVG propios, i18n con diccionarios tipados y rutas `/es` y `/en`, contenido en `src/content/*.ts` validado con tipos (campo `status: verified | demo | placeholder`).

## 9. Arquitectura de agentes y configuración

- Orquestador `portfolio-engineering-orchestrator` + 11 especialistas del master prompt en `.claude/agents/`. **Recomiendo crear al inicio solo 7** (orchestrator, design-integration, frontend, interaction, qa-visual, code-reviewer, devops) y añadir los demás cuando su fase llegue (evita configuración sin usar).
- Skills: las 17 solicitadas se consolidan en ~12 útiles (`start-session`, `end-session`, `analyze-design`, `plan-feature`, `implement-feature` con variantes window/section como argumento, `verify-design`, `test-interactions`, `fix-bug`, `review-code`, `audit` con subtipos security/accessibility/performance, `prepare-release`). Evita duplicar lógica.
- Rules: `design-fidelity`, `content-integrity` (no inventar datos), `terminal-safety`, `i18n`, `a11y`, `git-workflow`.
- Hooks: PreToolUse bloquea `rm -rf`, `git push --force`, `git reset --hard` y escritura en `design/source/**`; PostToolUse ejecuta Prettier/tsc sobre archivos tocados.
- `settings.json`: permisos mínimos (lectura, `npm run lint|test|build|typecheck`, git de solo lectura + add/commit/branch); sin deploy ni push automáticos.
- Nada de esto está creado todavía → **no operativo / NOT_VERIFIED**.

## 10. Roadmap y tareas

| Fase            | Tareas (ID)                                                                                                                                                                                                                                 | Gate de salida       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 1 Foundation    | F1-01 git init + `.gitignore` + mover/renombrar fuente (D1) · F1-02 Next+TS+Tailwind+ESLint+Prettier+Vitest+Playwright · F1-03 CLAUDE.md, agents, skills, rules, hooks, settings · F1-04 CI GitHub Actions · F1-05 plantillas de spec/gates | CI_BUILD_GATE        |
| 2 Design System | DS-01 tokens (dark/light/acc) · DS-02 fuentes · DS-03 iconos · DS-04 Button/Chip/Card/Segmented/Banner · DS-05 página interna de catálogo                                                                                                   | DESIGN_FIDELITY_GATE |
| 3 Shell         | PORT-DESKTOP-001, PORT-WINDOWS-001, PORT-DOCK-001 (+ menubar, settings popover)                                                                                                                                                             | WINDOW_MANAGER_GATE  |
| 4 Apps          | HOME, ABOUT, STACK, PROJECTS, EXPERIENCE, EDUCATION, CERTS, TERMINAL, CONTACT (una rama cada una)                                                                                                                                           | FUNCTIONAL_GATE      |
| 5 Avanzado      | TOUR, I18N, PORTFOLIO MODE, persistencia (tema/acento/idioma/tour)                                                                                                                                                                          | I18N_GATE            |
| 6 Responsive    | PORT-RESPONSIVE-001                                                                                                                                                                                                                         | —                    |
| 7 Contenido     | datos reales, proyectos, certs, CV, enlaces                                                                                                                                                                                                 | revisión del dueño   |
| 8 QA            | E2E, a11y, seguridad, SEO, rendimiento, visual                                                                                                                                                                                              | todos los gates      |
| 9 Deploy        | preview Vercel → producción **con tu autorización**                                                                                                                                                                                         | RELEASE_GATE         |

## 11. Pruebas previstas

Unit (Vitest): reducer del WM (open/close/focus/z/min/max/clamp), filtros de stack/proyectos/certs, i18n (paridad de claves ES/EN), parser de comandos de terminal. Integración (Testing Library): apertura desde Dock, cambio de idioma, preferencias. E2E (Playwright): los 10 flujos del prompt. Visual: capturas contra el prototipo en 1440×900, 1024, 768, 390 (tolerancia definida en `verify-design`). A11y: axe + revisión manual de teclado.

## 12. Riesgos

1. **Datos** (alto): el diseño contiene experiencia distinta a la "preliminar" del prompt (ver D2). Publicar datos erróneos es el mayor riesgo.
2. Dialecto `sc-*`/`DCLogic` no es estándar: la traducción es manual, no automatizable.
3. Rendimiento: blur apilado + arrastre → mitigado con store por ventana y `transform`.
4. Accesibilidad: el prototipo prioriza el ratón; WCAG 2.2 AA exige trabajo de teclado/foco (mover ventanas, Esc, trap del tour).
5. `color-mix()`, `:has()`, container queries: soportados en navegadores actuales; definir matriz mínima.
6. Textos "prototype / DEMO / PLACEHOLDER" visibles que no deberían llegar a producción.
7. Formulario: sin backend, solo `mailto` o proveedor externo (coste/privacidad).
8. Fuentes: el CSS referencia `fonts.gstatic.com`; en producción se self-hostean (CSP más estricta).

## 13. Decisiones pendientes (necesito tu respuesta)

- **D1** Renombrar `design/source/claude-design` → `design/source/claude-design/` (el prompt lo exige). Se copia, el original no se toca. ¿OK?
- **D2** Experiencia: el diseño dice _Mid-Level Development Engineer, mar 2024–actual_ en Banco G&T (+ rol Junior mar 2021–mar 2024) y _VisionBitt desde enero 2025_; el prompt decía solo Junior 2021–2024. ¿El diseño es la versión vigente y aprobada?
- **D3** Idioma por defecto y rutas: prototipo = EN. ¿`/es` por defecto (Guatemala) con detección, o EN?
- **D4** Proyectos DEMO y certificaciones PLACEHOLDER: ¿se ocultan hasta tener reales, o se mantienen con etiqueta? (Recomiendo ocultar certificaciones; proyectos con etiqueta hasta Fase 7.)
- **D5** Contacto: ¿`mailto` ahora, o proveedor (Resend/Formspree) más adelante? Recomiendo `mailto` + honestidad en UI.
- **D6** ¿Mantener el blur del prototipo en móvil o degradarlo a fondo sólido ≤760 px por rendimiento? (Recomiendo degradar.)
- **D7** Agentes: ¿los 7 iniciales o los 12 completos desde ya?
- **D8** Gestor de estado: store propio con `useSyncExternalStore` vs Zustand (recomiendo Zustand).
- **D9** Mantener "Prototipo/Prototype" y notas DEMO en el footer y UI: ¿se reemplazan por texto final?
- **D10** Datos faltantes: URL de CV, sitio web, fotos/capturas de proyectos, dominio.

## 14. Estado de las puertas de calidad

Todas **NOT_VERIFIED** (aún no hay código). Fase 0 completada solo a nivel de auditoría; esperar autorización para Fase 1.
