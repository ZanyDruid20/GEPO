// tests/setup.js
require('dotenv').config({ path: '.env.test' });

// Mock Redis for tests
jest.mock('../db/redis', () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
  on: jest.fn()
}));

// Suppress console output during tests (optional)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };
