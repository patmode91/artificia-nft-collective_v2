# AI NFT Platform

A platform for generating AI art and minting it as NFTs.

## Overview

The AI NFT Platform is designed to empower artists and creators by leveraging the power of artificial intelligence to generate unique digital art and mint it as NFTs (Non-Fungible Tokens). This platform provides a seamless experience for both inexperienced and experienced users to create, mint, and manage their digital art collections.

### Benefits

- **Creativity Unleashed**: Generate unique and stunning digital art using state-of-the-art AI models.
- **Ownership and Authenticity**: Mint your digital art as NFTs, ensuring ownership and authenticity on the blockchain.
- **Decentralized Storage**: Store your NFTs on IPFS, a decentralized storage network, ensuring durability and accessibility.
- **Web3 Integration**: Seamlessly connect your MetaMask wallet to manage transactions and interact with the blockchain.

### Overall Goal

The overall goal of this project is to democratize access to AI-generated art and NFTs, enabling artists and creators to explore new creative possibilities and monetize their digital creations in a secure and transparent manner.

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

## Running a Whitesource Scan

To run a Whitesource scan on your repository, follow these steps:

1. Ensure that the `.whitesource` file is correctly configured with the necessary settings.
2. Open your terminal and navigate to the root directory of your project.
3. Run the Whitesource scan command:
   ```bash
   whitesource run
   ```
4. Wait for the scan to complete. The scan results will be displayed in the terminal.

## Interpreting Whitesource Scan Results

After running a Whitesource scan, you can interpret the scan results as follows:

1. Check the scan results for any identified vulnerabilities and issues.
2. Verify that the branches specified in the `baseBranches` array are being scanned.
3. Ensure that the scan results are displayed in the "diff" mode, showing only the changes.
4. Confirm that the scan results use Mend check names.
5. Check that the scan results include issues with a severity level of "LOW" and above.
6. Verify that the scan results focus on dependency-related issues.

## Resolving Vulnerabilities in `whitesource-19.12.1.tgz`

The following steps were taken to resolve the vulnerabilities in the `whitesource-19.12.1.tgz` library:

1. Updated `package.json` to use non-vulnerable versions of dependencies:
   - `braces` to `3.0.3`
   - `hawk` to `9.0.1`
   - `tough-cookie` to `4.1.3`
   - `request` to `@cypress/request 3.0.0`
   - `micromatch` to `4.0.8`
   - `got` to `11.8.5`
2. Removed `whitesource-19.12.1.tgz` from the repository.
3. Updated `.whitesource` configuration to reflect the resolved vulnerabilities.

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

## Detailed Explanations

### How the Project Works

The AI NFT Platform is built using modern web technologies and integrates various services to provide a seamless experience for generating AI art and minting NFTs. Below is a detailed explanation of how the project works:

#### AI Art Generation

1. **User Input**: Users provide a prompt and select an AI model and style preset.
2. **API Request**: The frontend sends a request to the backend API with the provided prompt and settings.
3. **AI Model**: The backend uses HuggingFace models to generate AI art based on the provided prompt.
4. **Image Generation**: The generated images are returned to the frontend and displayed to the user.

#### NFT Minting

1. **Image Selection**: Users select an image generated by the AI model.
2. **Metadata Input**: Users provide metadata such as name, description, and attributes for the NFT.
3. **IPFS Upload**: The image and metadata are uploaded to IPFS for decentralized storage.
4. **Smart Contract Interaction**: The frontend interacts with the smart contract to mint the NFT using the provided metadata and image URL.
5. **Transaction Confirmation**: Users confirm the transaction in their MetaMask wallet, and the NFT is minted on the blockchain.

### Architecture Diagrams

#### System Architecture

The system architecture diagram provides an overview of the components and their interactions within the AI NFT Platform.

![System Architecture](docs/architecture/system_architecture.png)

#### Data Flow

The data flow diagram illustrates the flow of data between the frontend, backend, and external services.

![Data Flow](docs/architecture/data_flow.png)

### Comprehensive Documentation for Inexperienced Users

#### Step-by-Step Guide

1. **Setting Up the Environment**:
   - Install Node.js and NPM or Yarn.
   - Create a `.env` file with the required environment variables.
   - Install project dependencies using `npm install`.

2. **Running the Application**:
   - Start the development server using `npm run dev`.
   - Open the application in your browser and connect your MetaMask wallet.

3. **Generating AI Art**:
   - Navigate to the "Content Generation" section.
   - Select an AI model and style preset.
   - Enter a prompt and click "Generate" to create AI art.

4. **Minting NFTs**:
   - Select an image generated by the AI model.
   - Click on the "Mint NFT" button.
   - Fill in the NFT details and confirm the transaction in your MetaMask wallet.

5. **Viewing and Managing NFTs**:
   - Navigate to the "My NFTs" section to view and manage your minted NFTs.

#### Troubleshooting

- **MetaMask Connection Issues**: Ensure that your MetaMask wallet is installed and connected to the correct network.
- **API Errors**: Check the console for error messages and ensure that your environment variables are correctly configured.
- **Transaction Failures**: Ensure that you have sufficient funds in your MetaMask wallet to cover gas fees.

## Enhanced User Interface

### Tooltips and Help Icons

To improve the user experience, we have added tooltips and help icons throughout the UI to explain features and settings. This is especially helpful for new users who may not be familiar with the platform.

### Dark Mode

We have implemented a dark mode toggle to reduce eye strain and improve accessibility. Users can switch between light and dark modes based on their preference.

### Improved Layout and Design

The layout and design of the dashboard have been improved to make it more intuitive and visually appealing. We have also added animations and transitions to make the interface feel more responsive and engaging.

## Improved Onboarding Process

### Step-by-Step Tutorial

We have created a step-by-step tutorial or walkthrough for new users to guide them through the process of generating AI art and minting NFTs. This helps users get started quickly and easily.

### FAQ Section

A FAQ section or help center has been added with detailed explanations and troubleshooting tips. This provides users with the information they need to navigate the platform effectively.

### Sample Prompts and Settings

We provide sample prompts and settings to help users get started with AI art generation. These examples give users a better understanding of how to use the platform and create stunning digital art.

### In-App Tips and Suggestions

In-app tips and suggestions are provided based on user actions to help them navigate the platform more effectively. This ensures that users have a smooth and enjoyable experience.

## Advanced Features and Customization

### Save and Load Favorites

Users can save and load their favorite prompts, settings, and styles for easy reuse. This feature allows users to quickly access their preferred configurations and create art more efficiently.

### Compare AI Models and Styles

We have implemented a feature to compare different AI models and styles side by side. This allows users to see the differences between models and choose the one that best suits their needs.

### Customization Options

More customization options have been added for AI art generation, such as adjusting color palettes, textures, and other visual elements. This gives users greater control over the final output of their digital art.

### Create and Share Custom Styles

Users can create and share their own custom styles and presets with the community. This fosters collaboration and allows users to explore new creative possibilities.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
