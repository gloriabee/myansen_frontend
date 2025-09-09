export const preset = "ts-jest";
export const testEnvironment = "jsdom";
export const setupFilesAfterEnv = ["<rootDir>/jest.setup.ts"];
export const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1",
  "^@components/(.*)$": "<rootDir>/src/components/$1",
  "^@ui/(.*)$": "<rootDir>/src/components/ui/$1",
  "^@lib/(.*)$": "<rootDir>/src/lib/$1",
  "^@assets/(.*)$": "<rootDir>/src/assets/$1",
  "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
  "^@utils/(.*)$": "<rootDir>/src/utils/$1",
  "^@context/(.*)$": "<rootDir>/src/context/$1",
  "^@pages/(.*)$": "<rootDir>/src/pages/$1",
};
