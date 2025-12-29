# 🧪 Testing Directory

This directory contains all test files, scripts, and utilities isolated from the main development codebase.

## 📁 Structure

```
__testing__/
├── backend/
│   ├── unit-tests/          # Jest unit tests (*.spec.js, test_*.js)
│   ├── integration-tests/   # Integration & E2E tests
│   ├── utilities/           # Test utilities & helpers
│   └── scripts/             # Test SQL scripts & data
└── README.md
```

---

## 🎯 Backend Tests

### Unit Tests (`unit-tests/`)

| File                      | Purpose                     | Run Command                                          |
| ------------------------- | --------------------------- | ---------------------------------------------------- |
| `auth.login.spec.js`      | Login authentication tests  | `npm test auth.login`                                |
| `auth.additional.spec.js` | Additional auth tests       | `npm test auth.additional`                           |
| `health.spec.js`          | Health check endpoint tests | `npm test health`                                    |
| `test_server.js`          | Server startup tests        | `node __testing__/backend/unit-tests/test_server.js` |
| `test_hash.js`            | Password hashing tests      | `node __testing__/backend/unit-tests/test_hash.js`   |

### Integration Tests (`integration-tests/`)

| File                        | Purpose                           | Run Command                  |
| --------------------------- | --------------------------------- | ---------------------------- |
| `test-auto-schedule.js`     | Auto-schedule feature test        | `npm run test:auto-schedule` |
| `verify-donation-visits.js` | Donation visits data verification | `npm run seed:verify`        |

### Utilities (`utilities/`)

| File                | Purpose                    | Usage                                                 |
| ------------------- | -------------------------- | ----------------------------------------------------- |
| `testConnection.js` | Database connection tester | `npm run test:connection`                             |
| `generate_hash.js`  | Password hash generator    | `node __testing__/backend/utilities/generate_hash.js` |

### Scripts (`scripts/`)

| File                   | Purpose                    | Usage        |
| ---------------------- | -------------------------- | ------------ |
| `fix_auth_columns.sql` | Fix authentication columns | MySQL import |
| `insert_donor.sql`     | Insert test donor data     | MySQL import |
| `insert_staff.sql`     | Insert test staff data     | MySQL import |
| `reset_test_users.sql` | Reset test user data       | MySQL import |

---

## 🚀 Running Tests

### All Tests

```bash
cd backend
npm test
```

### Specific Test Suite

```bash
npm test auth.login
npm test health
```

### Integration Tests

```bash
# Auto-schedule test
npm run test:auto-schedule

# Verify donation visits seeder
npm run seed:verify
```

### Utilities

```bash
# Test database connection
npm run test:connection

# Generate password hash
node __testing__/backend/utilities/generate_hash.js "mypassword"
```

---

## 📝 Package.json Scripts

Update `backend/package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:api": "jest --runTestsByPath __testing__/backend/unit-tests/health.spec.js __testing__/backend/unit-tests/auth.login.spec.js",
    "test:connection": "node __testing__/backend/utilities/testConnection.js",
    "test:auto-schedule": "node __testing__/backend/integration-tests/test-auto-schedule.js",
    "seed:verify": "node __testing__/backend/integration-tests/verify-donation-visits.js"
  }
}
```

---

## 🎨 Jest Configuration

Update `backend/jest.config.js`:

```js
module.exports = {
  testEnvironment: "node",
  coverageDirectory: "__testing__/coverage",
  testMatch: ["**/__testing__/**/*.spec.js", "**/__testing__/**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/models/index.js",
    "!src/seeders/**",
    "!src/migrations/**",
  ],
  setupFilesAfterEnv: ["./jest.globalSetup.js"],
};
```

---

## 🔧 Migration Notes

### File Movements

**From `backend/tests/` → `__testing__/backend/unit-tests/`:**

- auth.login.spec.js
- auth.additional.spec.js
- health.spec.js

**From `backend/tests/` → `__testing__/backend/integration-tests/`:**

- test-auto-schedule.js
- verify-donation-visits.js

**From `backend/` → `__testing__/backend/unit-tests/`:**

- test_server.js
- test_hash.js

**From `backend/` → `__testing__/backend/utilities/`:**

- generate_hash.js

**From `backend/src/models/` → `__testing__/backend/utilities/`:**

- testConnection.js

**From `backend/` → `__testing__/backend/scripts/`:**

- fix_auth_columns.sql
- insert_donor.sql
- insert_staff.sql
- reset_test_users.sql

### Import Path Updates

If tests import from `../src/`, update to:

```js
// Old
const { Donor } = require("../src/models");

// New
const { Donor } = require("../../backend/src/models");
```

---

## 📊 Coverage Reports

Coverage reports will be generated in:

```
__testing__/coverage/
├── lcov-report/
├── coverage-final.json
└── lcov.info
```

View coverage:

```bash
npm run test:coverage
open __testing__/coverage/lcov-report/index.html
```

---

## ✅ Benefits of This Structure

1. **Clean Main Codebase** - Production code separated from test code
2. **Organized Tests** - Clear categorization (unit/integration/utilities)
3. **Easy Maintenance** - All test files in one place
4. **Better CI/CD** - Can run specific test suites easily
5. **Scalable** - Easy to add new test categories

---

## 🔮 Future Additions

Possible additions to `__testing__/`:

- `frontend/` - Frontend tests
- `e2e/` - End-to-end tests (Cypress, Playwright)
- `performance/` - Load testing scripts
- `fixtures/` - Test data fixtures
- `mocks/` - Mock data & services
