module.exports = {
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  clearMocks: true,

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
      },
    ],
  },
};