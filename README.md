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

## Usage Examples

### Generating AI Art

1. Open the application and connect your MetaMask wallet.
2. Navigate to the "Content Generation" section.
3. Select an AI model and style preset.
4. Enter a prompt and adjust settings as needed.
5. Click "Generate" to create AI art.

### Minting NFTs

1. After generating AI art, click on the "Mint NFT" button.
2. Fill in the NFT details such as name and description.
3. Confirm the minting transaction in your MetaMask wallet.
4. Your NFT will be minted and stored on IPFS.

## API References

### AI Model API

- Endpoint: `POST /api/generate`
- Description: Generates AI art based on the provided prompt and settings.
- Request Body:
  ```json
  {
    "model": "model_id",
    "prompt": "Your prompt here",
    "style": "style_id",
    "guidance": 7.5,
    "batchSize": 1,
    "variations": 1,
    "seed": 123456
  }
  ```
- Response:
  ```json
  {
    "images": ["image_url_1", "image_url_2"]
  }
  ```

### NFT Minting API

- Endpoint: `POST /api/mint`
- Description: Mints an NFT with the provided metadata and image.
- Request Body:
  ```json
  {
    "name": "NFT Name",
    "description": "NFT Description",
    "image": "ipfs_image_url",
    "attributes": [
      {
        "trait_type": "Creator",
        "value": "Your Wallet Address"
      }
    ]
  }
  ```
- Response:
  ```json
  {
    "transactionHash": "0x123456789abcdef"
  }
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

## Architecture Diagrams

### System Architecture

![System Architecture](docs/architecture/system_architecture.png)

### Data Flow

![Data Flow](docs/architecture/data_flow.png)

## Testing

- Unit tests with Vitest
- React Testing Library for component tests
- Contract tests with Hardhat

## Contribution Guidelines

We welcome contributions from the community! Please follow these steps to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use Prettier for code formatting.
- Follow the ESLint rules defined in the project.

### Commit Messages

- Use clear and descriptive commit messages.
- Follow the conventional commits specification.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
