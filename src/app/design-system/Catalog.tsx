"use client";

import { useState } from "react";
import {
  AccentPicker,
  AppTile,
  Banner,
  Button,
  Card,
  Chip,
  Chips,
  DemoTag,
  Detail,
  Eyebrow,
  Field,
  FilterPills,
  ICON_NAMES,
  Icon,
  Kbd,
  LinkRow,
  Main,
  Mono,
  Note,
  SearchField,
  Segmented,
  SectionCard,
  Side,
  SideButton,
  Split,
  Status,
  type AppId,
  type Category,
} from "@/shared/components";
import { ACCENTS, THEMES, type Accent, type Theme } from "@/shared/theme/options";

const APPS: AppId[] = [
  "home",
  "about",
  "stack",
  "projects",
  "experience",
  "education",
  "certs",
  "terminal",
  "contact",
];
const CATEGORIES: Category[] = ["frontend", "backend", "mobile", "databases", "devops"];
const TOKENS = [
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "mint",
  "teal",
  "cyan",
  "indigo",
  "brown",
  "gray",
  "steel",
];

export function Catalog() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<Accent>("blue");
  const [lang, setLang] = useState<"es" | "en">("es");
  const [filter, setFilter] = useState("all");
  const [side, setSide] = useState("all");

  return (
    <div className={`os theme-${theme} acc-${accent}`} style={{ minHeight: "100vh" }}>
      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Eyebrow>Design system · DS-001</Eyebrow>
        <h1 style={{ fontSize: 28, margin: "6px 0 18px", letterSpacing: "-.03em" }}>
          ISRAEL HURTARTE.OS
        </h1>

        <div className="toolbar" style={{ gap: 16 }}>
          <Segmented
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={THEMES.map((v) => ({ value: v, label: v }))}
          />
          <Segmented
            label="Language"
            value={lang}
            onChange={setLang}
            options={[
              { value: "es", label: "ES" },
              { value: "en", label: "EN" },
            ]}
          />
          <AccentPicker
            label="Accent"
            value={accent}
            onChange={setAccent}
            labels={Object.fromEntries(ACCENTS.map((a) => [a, a])) as Record<Accent, string>}
          />
        </div>

        <Group title="Color tokens">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))",
              gap: 10,
            }}
          >
            {TOKENS.map((t) => (
              <div key={t} className="card" style={{ padding: 10 }}>
                <div style={{ height: 28, borderRadius: 6, background: `var(--${t})` }} />
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  --{t}
                </div>
              </div>
            ))}
          </div>
        </Group>

        <Group title="Buttons, chips, badges">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary">
              <Icon name="folder" />
              Primary
            </Button>
            <Button>Default</Button>
            <Button size="sm">Small</Button>
            <Button disabled>Disabled</Button>
            <Button href="https://example.com" size="sm">
              External link
            </Button>
            <Status>Completed</Status>
            <Status tone="orange">In progress</Status>
            <DemoTag />
            <DemoTag>PLACEHOLDER</DemoTag>
            <Kbd>help</Kbd>
          </div>
          <Chips className="">
            {["React", "TypeScript", "Node.js", "PostgreSQL"].map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </Chips>
        </Group>

        <Group title="App tiles (dock / shortcut / tour)">
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
            {APPS.map((a) => (
              <AppTile key={a} app={a} />
            ))}
            <AppTile app="projects" size="shortcut" />
            <AppTile app="home" size="tour" icon="shield-check" />
          </div>
        </Group>

        <Group title="Monograms">
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {CATEGORIES.map((c) => (
              <Mono key={c} category={c}>
                {c.slice(0, 2).toUpperCase()}
              </Mono>
            ))}
            <Mono category="frontend" large>
              Re
            </Mono>
          </div>
        </Group>

        <Group title="Cards, rows, notes, banners">
          <div
            className="grid2"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <SectionCard title="Links" headingLevel={3}>
              <LinkRow label="GitHub">
                <a href="https://github.com/israelhp">github.com/israelhp</a>
              </LinkRow>
              <LinkRow label="Website">
                <span className="nc">{lang === "es" ? "No configurado" : "Not configured"}</span>
              </LinkRow>
            </SectionCard>
            <Card style={{ padding: 16 }}>Plain card</Card>
          </div>
          <Note>Informational note</Note>
          <Banner>Demo mode banner</Banner>
          <Banner ok>Success banner</Banner>
        </Group>

        <Group title="Form">
          <Card className="form">
            <Field label="Name" placeholder="Your name" />
            <Field label="Email" type="email" placeholder="you@example.com" />
            <Field label="Message" multiline placeholder="Tell me about your project…" />
            <Button variant="primary" type="submit">
              <Icon name="send" />
              Send
            </Button>
          </Card>
        </Group>

        <Group title="Filters and search">
          <FilterPills
            label="Categories"
            value={filter}
            onChange={setFilter}
            options={["all", "cloud", "dev", "data"].map((v) => ({ value: v, label: v }))}
          />
          <SearchField label="Search technologies…" />
        </Group>

        <Group title="Split layout">
          <div
            className="card"
            style={{ height: 260, overflow: "hidden", containerType: "inline-size" }}
          >
            <Split>
              <Side label="Folders">
                {["all", "web", "mobile"].map((s, i) => (
                  <SideButton key={s} active={side === s} count={i + 3} onClick={() => setSide(s)}>
                    <Icon name="folder" />
                    {s}
                  </SideButton>
                ))}
              </Side>
              <Main>Main content for “{side}”</Main>
              <Detail has>Detail pane</Detail>
            </Split>
          </div>
        </Group>

        <Group title={`Icons (${ICON_NAMES.length})`}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(96px,1fr))",
              gap: 10,
            }}
          >
            {ICON_NAMES.map((n) => (
              <div key={n} className="card" style={{ padding: 10, textAlign: "center" }}>
                <Icon name={n} style={{ width: 22, height: 22 }} />
                <div className="muted" style={{ fontSize: 11, marginTop: 6 }}>
                  {n}
                </div>
              </div>
            ))}
          </div>
        </Group>
      </main>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ margin: 0, fontSize: 15 }}>{title}</h2>
      {children}
    </section>
  );
}
