import type { Config } from 'jest'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

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

export default config
