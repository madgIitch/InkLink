import { describe, test, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/components/SearchBar";

describe("<SearchBar />", () => {
  test("renderiza inputs y botón deshabilitado por defecto", () => {
    const fn = vi.fn();
    render(<SearchBar onSearch={fn} />);

    const city = screen.getByRole("textbox", { name: /^ciudad$/i });
    const style = screen.getByRole("textbox", { name: /^estilo$/i });
    const button = screen.getByRole("button", { name: /buscar/i });

    expect(city).toBeInTheDocument();
    expect(style).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test("habilita el botón cuando ambos campos tienen valor", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<SearchBar onSearch={fn} />);

    const city = screen.getByRole("textbox", { name: /^ciudad$/i });
    const style = screen.getByRole("textbox", { name: /^estilo$/i });
    const button = screen.getByRole("button", { name: /buscar/i });

    await user.type(city, "Berlin");
    await user.type(style, "fineline");

    expect(button).toBeEnabled();
  });

  test("envía con Enter y llama a onSearch", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<SearchBar onSearch={fn} />);

    const city = screen.getByRole("textbox", { name: /^ciudad$/i });
    const style = screen.getByRole("textbox", { name: /^estilo$/i });

    await user.type(city, "Berlin");
    await user.type(style, "blackwork{enter}");

    expect(fn).toHaveBeenCalledWith({ city: "Berlin", style: "blackwork" });
  });
});
