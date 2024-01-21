module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageThreshold: {
    // We'll enable this later
    // global: {
    //   branches: 80,
    //   functions: 80,
    //   lines: 80,
    //   statements: 80,
    // },
  },
  // extensionsToTreatAsEsm: [
  //   ".ts",
  //   ".tsx",
  //   ".mts"
  // ],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  rootDir: process.cwd(),
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: {
        jsx: 'react',
      }
    }]
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup.tsx"
  ],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    '^.+\\.js$',
    '/node_modules/(?!@react-dnd|react-dnd|dnd-core|react-number-format)',
    "^.+\\.module\\.(css|sass|scss)$"
  ]
};
