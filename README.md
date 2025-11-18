# Nutrient Web SDK Loading Performance Demo

This Next.js application demonstrates and compares different PDF loading methods using Nutrient Web SDK:
- Standard Web SDK loading
- Linearized PDF loading
- Nutrient Document Engine (DWS) with streaming

## Environment Setup

1. Copy the sample environment file:
```bash
cp env.sample .env.local
```

2. Configure your environment variables in `.env.local`:

```bash
# Nutrient Web SDK Configuration
NEXT_PUBLIC_WEB_SDK_VERSION=1.8.0
NEXT_PUBLIC_WEB_SDK_LICENSE_KEY=your_license_key

# Nutrient Document Engine (Server-side only - KEEP SECRET)
DOCUMENT_ENGINE_SERVER_URL=https://your-dws-instance.com
DOCUMENT_ENGINE_API_KEY=your_api_key

# Document Engine Document ID (Public - safe for client)
NEXT_PUBLIC_DOCUMENT_ENGINE_DOCUMENT_ID=your_document_id
```

**Important Security Note:**
- ⚠️ Never use `NEXT_PUBLIC_` prefix for sensitive credentials like API keys
- ✅ Server-side variables (without `NEXT_PUBLIC_`) are only accessible in API routes
- ✅ This demo uses a secure server-side API route to generate JWT tokens

## Getting Started

First, install dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

### Document Engine JWT Authentication (Best Practice)

This demo implements secure JWT token generation for Document Engine authentication:

1. **Client Request**: The client sends a document ID to `/api/document-engine-auth`
2. **Server-Side Token Generation**: The API route uses the server-side API key to request a JWT from Document Engine
3. **Secure Response**: The JWT is returned to the client without exposing the API key
4. **Viewer Initialization**: The client uses the JWT to authenticate with Document Engine

**Why This Matters:**
- 🔒 API keys remain secure on the server
- ✅ Follows security best practices
- 🎯 Provides a reference implementation for production use
- ⚡ Tokens can be generated on-demand with custom permissions

### File Structure

```
app/
├── api/
│   └── document-engine-auth/
│       └── route.ts          # Server-side JWT generation
├── compare/
│   └── page.tsx              # Performance comparison view
└── page.tsx                  # Home page with method selection

components/
└── ComparisonViewer.tsx      # PDF viewer component
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
