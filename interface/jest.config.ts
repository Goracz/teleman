module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  roots: ["<rootDir>"], // Set the root directory to 'interface'
  setupFilesAfterEnv: ["./jest.setup.ts"],
};
