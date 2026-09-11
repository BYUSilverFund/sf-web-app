# Silver Fund Web App

Next.js web application and dashboard for the BYU Silver Fund portfolio management, performance analytics, factor models, and reporting.

## Development Setup

### Prerequisites

- **Node.js**: `>= 22.0.0`
- **npm** (or **bun**)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `example.env` to `.env.local` and fill in the required values:

```bash
cp example.env .env.local
```

Refer to [`example.env`](example.env) for full descriptions and comments on each required variable (`NEXT_PUBLIC_FASTAPI_URL`, Cognito credentials, GraphQL API configuration).

### 3. Run Development Server

Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production (Local Test)

To verify production builds locally:

```bash
npm run build
npm run start
```

## Testing

Unit and component tests are built with **Vitest** and **React Testing Library**:

```bash
# Run all tests once
npm test

# Run tests in interactive watch mode
npx vitest
```

## Code Quality & Pre-commit Hooks

We use **Husky** and **lint-staged** to automatically run ESLint and Prettier before every commit.

Hooks are installed automatically when you run `npm install` (via the `prepare` script).

### Manual Setup (if needed)

```bash
npm run prepare
```

### Linting and Formatting Commands

```bash
# Format check
npm run format

# Format and fix files
npm run format:write

# Lint all files
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Skip Hooks (emergency only)

```bash
git commit --no-verify -m "emergency commit"
```

## Authentication

This application uses **AWS Cognito** for user authentication and route protection (via AWS Amplify).

- Cognito resources (User Pool, App Client, Domain) are provisioned via Terraform in [`cognito.tf`](../sf-aws-terraform/cognito.tf) in the `sf-aws-terraform` repository.
- **Pre-Sign-Up Hook**: User self-registration is validated by a Cognito Pre-Sign-Up Lambda trigger to restrict account creation to authorized BYU email domains.

## GraphQL & Alumni Directory (AWS AppSync)

The Alumni directory on the team page is fetched using AWS AppSync GraphQL querying an Amazon DynamoDB table (`src/graphql/backend.ts`).

- **Authentication Mode**: API Key (`apiKey`).
- **Annual Expiration & Rotation**: AWS AppSync API keys expire annually. When the key expires, generate a new key in the **AWS Console $\rightarrow$ AWS AppSync $\rightarrow$ Settings $\rightarrow$ API Keys** and update the Amplify environment configuration.

## Deployment

This app is deployed on **AWS Amplify**.
Pushes to the `dev` and `prod` branches automatically trigger deployments to their respective Amplify environments.
