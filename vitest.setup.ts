import { beforeEach } from "vitest";

// Reset mocks before each test
beforeEach(() => {
  // Clear all mocks
  if (typeof global.localStorage !== "undefined") {
    global.localStorage.clear();
  }
});

// Mock window for browser APIs
global.window = global.window || ({} as Window & typeof globalThis);
