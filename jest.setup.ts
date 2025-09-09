import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Patch Node's TextEncoder and TextDecoder to the global object (Jest env)
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

