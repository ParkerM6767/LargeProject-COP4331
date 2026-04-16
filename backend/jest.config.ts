import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],
  clearMocks: true,
  coverageDirectory: '../coverage',
  collectCoverageFrom: [
    'controllers/**/*.ts',
    'middleware/**/*.ts',
    'routes/**/*.ts'
  ]
}

<<<<<<< HEAD
export default config
=======
export default config
>>>>>>> 0147656d60d09627c88345f0c96c512de75e7a7f
