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

## HTTPS certificate management

The website uses an **Amplify-managed certificate** issued through
AWS Certificate Manager (ACM). Amplify handles certificate issuance,
deployment, and automatic renewal.

### Set up the certificate

1. Open **AWS Amplify → your app → Custom domains**.
2. Add `silverfund.byu.edu`, or open its existing domain configuration.
3. Select **Amplify-managed certificate** when choosing the certificate.
4. Copy the certificate verification CNAME name and value provided by Amplify.
5. Open **Route 53 → Hosted zones → silverfund.byu.edu**.
6. Create the verification record:

   | Field          | Setting                                                         |
   | -------------- | --------------------------------------------------------------- |
   | Record name    | Verification name from Amplify, excluding `.silverfund.byu.edu` |
   | Record type    | CNAME                                                           |
   | Alias          | Off                                                             |
   | Value          | Verification target from Amplify                                |
   | TTL            | 300                                                             |
   | Routing policy | Simple                                                          |

7. Verify the full record name, then click **Create records**.
8. Return to Amplify and wait for certificate validation and deployment.
9. Open **https://silverfund.byu.edu** in a private window and confirm
   the certificate is valid.

### Renewal and troubleshooting

Keep the verification CNAME in Route 53 so AWS can validate future renewals.

If the certificate expires, compare the existing CNAME with the record
currently shown in Amplify. Add or correct it if needed. Certificate
updates could take time after DNS validation succeeds.
