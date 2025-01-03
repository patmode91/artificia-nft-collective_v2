# AI NFT Platform

A platform for generating AI art and minting it as NFTs.

## Features

- AI Art Generation using HuggingFace models
- NFT Minting with IPFS storage
- Web3 wallet integration
- Transaction monitoring
- Real-time updates

## Getting Started

### Prerequisites

- Node.js 16+
- NPM or Yarn
- MetaMask wallet

### Environment Variables

Create a `.env` file with the following variables:

```env
VITE_HUGGINGFACE_API_KEY=your_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_IPFS_PROJECT_ID=your_ipfs_project_id
VITE_IPFS_PROJECT_SECRET=your_ipfs_secret
VITE_CONTRACT_ADDRESS=your_contract_address
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Architecture

### Frontend

- React + Vite
- TailwindCSS + shadcn/ui
- React Query for data fetching
- Ethers.js for Web3 integration

### Backend

- Supabase for database and authentication
- HuggingFace for AI models
- IPFS for decentralized storage

### Smart Contracts

- ERC721 for NFTs
- OpenZeppelin contracts

## Testing

- Unit tests with Vitest
- React Testing Library for component tests
- Contract tests with Hardhat

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
