# NFT Minter Platform - Frontend

This is a proof-of-concept (PoC) frontend for an NFT minting platform that allows users to discover, track, and automatically mint NFTs from popular marketplaces like OpenSea, Magic Eden, and Rarible.

## Features

- **User Authentication**
  - Email/password registration and login
  - Secure JWT authentication
  - Protected routes for authenticated users

- **Dashboard**
  - Overview of user's NFT collection
  - Wallet balance and transaction history
  - Upcoming NFT drops and minting opportunities

- **Wallet Management**
  - Deposit and withdraw cryptocurrency
  - Automated transactions without MetaMask
  - Transaction history tracking

- **NFT Collection Management**
  - Browse all minted NFTs
  - Filter and sort NFTs by platform, date, etc.
  - View detailed NFT information

- **Marketplace Integration**
  - Displays NFT drops from popular marketplaces
  - Scraper for upcoming NFT releases (mocked for the PoC)
  - Direct minting from within the platform

## Technology Stack

- **Framework**: Next.js 15
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nft-minter-front
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app` - Next.js pages and routing
- `src/components` - Reusable UI components
- `src/contexts` - React Context providers
- `src/lib` - Utility functions and helpers
- `src/domain` - Business logic and models
- `src/infrastructure` - External service integrations

## Pages

- `/` - Home/Landing page
- `/login` - User login
- `/register` - User registration
- `/dashboard` - Main dashboard with statistics and overview
- `/wallet` - Wallet management and transactions
- `/nfts` - User's NFT collection
- `/upcoming` - Upcoming NFT drops
- `/mint/[id]` - NFT minting page

## Backend Integration

This is just the frontend part of the application. For a complete working product, you would need to integrate it with a backend service that provides:

1. User authentication and management
2. Wallet management and cryptocurrency transactions
3. NFT marketplace integration
4. Blockchain interactions for minting NFTs
5. Database for storing user data, transactions, etc.

## Development Notes

- The authentication is mocked in `src/contexts/AuthContext.tsx`
- NFT data is simulated and hardcoded in the respective pages
- Blockchain transactions are simulated with timeouts

## Next Steps

To turn this PoC into a production-ready application:

1. Integrate with a real backend service
2. Implement actual blockchain transactions
3. Connect to NFT marketplace APIs
4. Add real-time notifications for NFT drops
5. Enhance security for wallet management
6. Add more analytics and insights for users

## License

This project is licensed under the MIT License.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.