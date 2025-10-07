// vitest.setup.ts
import { expect, afterEach } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

// Añade los matchers de jest-dom a expect (Vitest)
expect.extend(matchers);

// Limpia el DOM tras cada test
afterEach(() => {
  cleanup();
});
