import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ICON_NAMES } from "../icons/Icon";
import {
  AppTile,
  Banner,
  Button,
  DemoTag,
  Field,
  FilterPills,
  Icon,
  Segmented,
  SideButton,
} from ".";

describe("Icon", () => {
  it("renders every icon as a decorative svg by default", () => {
    for (const name of ICON_NAMES) {
      const { container, unmount } = render(<Icon name={name} />);
      const svg = container.querySelector("svg.i");
      expect(svg, name).not.toBeNull();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg!.children.length, name).toBeGreaterThan(0);
      unmount();
    }
  });

  it("exposes an accessible name when a title is provided", () => {
    render(<Icon name="home" title="Inicio" />);
    expect(screen.getByRole("img", { name: "Inicio" })).toBeInTheDocument();
  });
});

describe("Button", () => {
  it("applies variant and size classes and defaults to type=button", () => {
    render(
      <Button variant="primary" size="sm">
        Go
      </Button>,
    );
    const b = screen.getByRole("button", { name: "Go" });
    expect(b).toHaveClass("btn", "primary", "sm");
    expect(b).toHaveAttribute("type", "button");
  });

  it("external links open safely", () => {
    render(<Button href="https://example.com">Out</Button>);
    const a = screen.getByRole("link", { name: "Out" });
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("internal and mailto links do not force a new tab", () => {
    render(<Button href="mailto:a@b.c">Mail</Button>);
    expect(screen.getByRole("link", { name: "Mail" })).not.toHaveAttribute("target");
  });
});

describe("Segmented / FilterPills", () => {
  const options = [
    { value: "es", label: "ES" },
    { value: "en", label: "EN" },
  ];

  it("marks the active option with aria-pressed and reports changes", () => {
    const onChange = vi.fn();
    render(<Segmented label="Idioma" options={options} value="es" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "ES" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(onChange).toHaveBeenCalledWith("en");
    expect(screen.getByRole("group", { name: "Idioma" })).toBeInTheDocument();
  });

  it("FilterPills behaves the same way", () => {
    const onChange = vi.fn();
    render(<FilterPills label="Cat" options={options} value="en" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "EN" })).toHaveClass("fbtn", "on");
    fireEvent.click(screen.getByRole("button", { name: "ES" }));
    expect(onChange).toHaveBeenCalledWith("es");
  });
});

describe("misc components", () => {
  it("Field associates its label with the control", () => {
    render(<Field label="Correo" type="email" />);
    expect(screen.getByLabelText("Correo")).toHaveAttribute("type", "email");
    render(<Field label="Mensaje" multiline />);
    expect(screen.getByLabelText("Mensaje").tagName).toBe("TEXTAREA");
  });

  it("DemoTag defaults to DEMO", () => {
    render(<DemoTag />);
    expect(screen.getByText("DEMO")).toHaveClass("demo-tag");
  });

  it("success Banner is announced as status", () => {
    render(<Banner ok>Hecho</Banner>);
    expect(screen.getByRole("status")).toHaveTextContent("Hecho");
  });

  it("SideButton exposes the current item and its count", () => {
    render(
      <SideButton active count={5}>
        Web
      </SideButton>,
    );
    const b = screen.getByRole("button");
    expect(b).toHaveAttribute("aria-current", "true");
    expect(b).toHaveTextContent("5");
  });

  it("AppTile maps each app to its tile class", () => {
    const { container } = render(<AppTile app="terminal" size="shortcut" />);
    expect(container.firstElementChild).toHaveClass("sc-ico", "t-terminal");
  });
});
