# Testing Setup Documentation

## Overview
Complete testing scaffold for a multi-layer Node.js backend using **Jest** and **Supertest**.

## Test Structure

```
tests/
├── __mocks__/
│   └── axios.js                          # Mock axios for external API calls
├── utils/
│   └── testHelpers.js                    # Reusable test utilities & factories
├── setup.js                              # Global test configuration
├── graphql/
│   ├── schema.test.js                    # GraphQL type definitions
│   └── resolvers.test.js                 # GraphQL query resolvers
├── services/
│   ├── commit_service.test.js            # Commit aggregation logic
│   ├── language_service.test.js          # Language breakdown logic
│   └── wrapped_service.test.js           # Full report aggregation
├── middleware/
│   ├── auth_middleware.test.js           # Authentication checks
│   ├── rateLimit_middleware.test.js      # Rate limiting
│   └── tokenRefresh_middleware.test.js   # Token validity
└── routes/
    ├── commits.test.js                   # Commits endpoints
    ├── languages.test.js                 # Languages endpoints
    └── wrapped.test.js                   # Wrapped endpoints
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode (rerun on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

## Test Coverage by Layer

### 1. **GraphQL Layer** (`tests/graphql/`)

#### `schema.test.js`
- Validates GraphQL type definitions
- Checks field presence and types
- Ensures Query resolvers are defined

#### `resolvers.test.js`
- Tests query resolution logic
- Mocks services to verify resolver behavior
- Validates data transformation

**Example Test:**
```javascript
it('should resolve wrapped report with user data', async () => {
  const mockReport = { /* data */ };
  WrappedService.getUserReport.mockResolvedValue(mockReport);
  const result = await WrappedService.getUserReport('testuser');
  expect(result).toEqual(mockReport);
});
```

---

### 2. **Services Layer** (`tests/services/`)

#### `commit_service.test.js`
- Tests GitHub API interactions for commits
- Validates pagination logic
- Checks commit counting and aggregation

**Coverage:**
- `getRepos()` - Fetch user repositories
- `countCommitsForRepo()` - Count commits with filters
- `totalCommitsForUser()` - Aggregate across all repos
- `summarizeCommits()` - Per-repo breakdown

#### `language_service.test.js`
- Tests language detection and aggregation
- Validates percentage calculations
- Tests sorting and filtering

**Coverage:**
- `getRepoLanguages()` - Fetch repo language breakdown
- `getLanguageBreakDown()` - Aggregate languages across repos
- Percentage calculations and sorting

#### `wrapped_service.test.js`
- Integration tests for full report generation
- Tests data aggregation from multiple sources
- Validates token passing

**Coverage:**
- `getUserReport()` - Complete wrapped report
- Commit aggregation
- Language aggregation
- Score inclusion

---

### 3. **Middleware Layer** (`tests/middleware/`)

#### `auth_middleware.test.js`
- Tests authentication enforcement
- Validates 401 responses for unauthenticated requests

**Coverage:**
- `ensureAuthenticated()` - Protect routes

#### `rateLimit_middleware.test.js`
- Validates rate limiting configuration
- Checks middleware structure

#### `tokenRefresh_middleware.test.js`
- Tests token validation via GitHub API
- Tests token expiration handling
- Tests error recovery

**Coverage:**
- Valid token bypass
- Expired token rejection
- API error handling

---

### 4. **Routes/Controllers Layer** (`tests/routes/`)

#### `commits.test.js`
- Tests `/api/commits/summary/:username` endpoint
- Validates authentication
- Tests error responses
- Uses Supertest for HTTP testing

#### `languages.test.js`
- Tests `/api/languages/breakdown/:username` endpoint
- Validates response format
- Tests error handling

#### `wrapped.test.js`
- Tests `/api/wrapped/:username` endpoint
- Tests authentication enforcement
- Validates response structure

---

## Test Utilities

### `testHelpers.js`
Reusable test data factories and helpers:

```javascript
mockGitHubRepoResponse()     // Generate mock repository data
mockLanguageResponse()        // Generate mock language data
mockCommitResponse(count)     // Generate mock commit data
clearAllMocks()               // Reset all jest mocks
```

### `__mocks__/axios.js`
Mocks axios for testing without hitting real APIs:

```javascript
jest.mock('axios'); // Prevents real GitHub API calls
```

### `setup.js`
Global test setup:
- Mocks Redis for cache testing
- Configures environment variables
- Sets up global test configuration

---

## Mocking Strategy

### 1. External APIs (axios)
Mock axios to prevent real API calls:
```javascript
jest.mock('axios');
axios.get.mockResolvedValue({ data: mockData });
```

### 2. Services
Mock lower-layer services when testing higher layers:
```javascript
jest.mock('../../services/wrapped_service');
WrappedService.getUserReport.mockResolvedValue(mockReport);
```

### 3. Middleware
Mock authentication middleware in route tests:
```javascript
jest.mock('../../middleware/auth_middleware', () => ({
  ensureAuthenticated: jest.fn((req, res, next) => next())
}));
```

### 4. Redis
Mocked in setup.js to avoid dependency on Redis server:
```javascript
jest.mock('../db/redis', () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK')
}));
```

---

## Best Practices

1. **Isolation**: Each test focuses on a single responsibility
2. **Mocking**: Mock external dependencies (APIs, databases, Redis)
3. **Clarity**: Test names clearly describe what is being tested
4. **Coverage**: Aim for >80% code coverage
5. **Async**: Properly handle async/await in tests
6. **Setup/Teardown**: Use `beforeEach` to reset mocks between tests

---

## Example Test Pattern

```javascript
describe('Feature Name', () => {
  let req, res, next;

  beforeEach(() => {
    // Setup
    req = { /* mock request */ };
    res = { /* mock response */ };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should do something specific', async () => {
    // Arrange
    mockService.mockResolvedValue(expectedData);

    // Act
    const result = await functionUnderTest(input);

    // Assert
    expect(result).toEqual(expectedData);
    expect(mockService).toHaveBeenCalledWith(expectedInput);
  });
});
```

---

## Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- auth_middleware

# Run specific file
npm test -- tests/middleware/auth_middleware.test.js

# Run tests with coverage
npm run test:coverage
```

---

## Continuous Integration

Add to your CI/CD pipeline:
```bash
npm test -- --coverage --watchAll=false
```

This ensures tests run without watching and fail if coverage thresholds aren't met.
