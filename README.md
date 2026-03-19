## Development Setup

### Install dependencies

```bash
npm install
```

### Pre-commit Hooks

We use **Husky** and **lint-staged** to automatically run ESLint and Prettier before every commit.

Hooks are installed automatically when you run `npm install` (via the `prepare` script).

#### Manual setup (if needed)

```bash
npm run prepare
```

#### Usage

Hooks run automatically on `git commit`. You can also run linting and formatting manually:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Lint all files
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

#### Skip hooks (emergency only)

```bash
git commit --no-verify -m "emergency commit"
```

## Deployment

this app is deployed on AWS amplify. pushes to both dev and main will deploy to their respective environments.

### Auth

this app uses Cognito for authentication which are defined with terraform in the frontend_auth.tf file.
