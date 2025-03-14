import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

// Updated interfaces to handle both response formats
interface EtherscanContractSourceResponse {
  status: string;
  message: string;
  result: {
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
    SimilarMatch: string;
  }[];
}

// Separate interface for ABI responses which return a string
interface EtherscanAbiResponse {
  status: string;
  message: string;
  result: string;
}

// Generic response type for implementation address
interface EtherscanImplementationResponse {
  status: string;
  message: string;
  result: string;
}

interface ContractInfo {
  name: string;
  abi: any;
  sourceCode: string;
  compilerVersion: string;
}

@Injectable()
export class EtherscanService {
  private readonly logger = new Logger(EtherscanService.name);
  private readonly apiEndpoint: string;
  private readonly apiKey: string;
  private readonly etherscanBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiEndpoint = this.configService.get<string>(
      'ETHERSCAN_API_ENDPOINT',
      'https://api.etherscan.io/api',
    );
    this.apiKey = this.configService.get<string>('ETHERSCAN_API_KEY');
    this.etherscanBaseUrl = 'https://etherscan.io';

    if (!this.apiKey) {
      this.logger.warn(
        'ETHERSCAN_API_KEY is not defined in environment variables',
      );
    }
  }

  async getContractInfo(
    contractAddress: string,
    chainId = 1,
  ): Promise<ContractInfo | null> {
    try {
      this.logger.log(`Fetching ABI for contract ${contractAddress}`);
      const url = `${this.apiEndpoint}?chainid=${chainId}&module=contract&action=getabi&address=${contractAddress}&apikey=${this.apiKey}`;

      const response = await axios.get<EtherscanAbiResponse>(url);

      console.log(response.data);

      // Check if we got a valid response
      if (response.data.status !== '1' || !response.data.result) {
        this.logger.error(
          `Failed to get ABI for contract ${contractAddress}: ${JSON.stringify(
            response.data,
          )}`,
        );
        return null;
      }

      // Parse ABI from string to JSON
      let parsedAbi = null;
      try {
        // response.data.result is a string in this case
        parsedAbi = JSON.parse(response.data.result);
      } catch (error) {
        this.logger.error(
          `Failed to parse ABI for contract ${contractAddress}: ${error.message}`,
        );
        return null;
      }

      // Check if this is a proxy contract
      const isProxy = this.isProxyContract(parsedAbi);

      if (isProxy) {
        this.logger.log(
          `Detected proxy contract at ${contractAddress}, checking implementation address`,
        );

        // First try with Etherscan's proxy API
        const proxyUrl = `${this.apiEndpoint}?chainid=${chainId}&module=contract&action=getImplementationAddress&address=${contractAddress}&apikey=${this.apiKey}`;
        const proxyResponse = await axios.get<EtherscanImplementationResponse>(
          proxyUrl,
        );

        if (proxyResponse.data.status === '1' && proxyResponse.data.result) {
          const implementationAddress = proxyResponse.data.result;
          this.logger.log(
            `Found implementation address via API: ${implementationAddress}`,
          );

          // Get the ABI of the implementation contract
          return this.getContractInfo(implementationAddress, chainId);
        } else {
          // If we failed to get the implementation address from the API,
          // try to scrape it from the Etherscan UI
          try {
            const implementationAddress =
              await this.scrapeImplementationAddressFromEtherscanUI(
                contractAddress,
              );

            if (implementationAddress) {
              this.logger.log(
                `Found implementation address via UI scraping: ${implementationAddress}`,
              );

              // Get the ABI of the implementation contract
              return this.getContractInfo(implementationAddress, chainId);
            }
          } catch (scrapeError) {
            this.logger.error(
              `Failed to scrape implementation address: ${scrapeError.message}`,
            );
          }

          // As a fallback, check if the error message mentions the implementation address
          const errorMessage = response.data.result;

          // Only try to match if it's a string
          if (typeof errorMessage === 'string') {
            const addressMatch = errorMessage.match(/at (0x[a-fA-F0-9]{40})/);

            if (addressMatch && addressMatch[1]) {
              const implementationAddress = addressMatch[1];
              this.logger.log(
                `Extracted implementation address from error: ${implementationAddress}`,
              );

              // Get the ABI of the implementation contract
              return this.getContractInfo(implementationAddress, chainId);
            }
          }

          this.logger.error(
            `Couldn't determine implementation address for proxy contract ${contractAddress}`,
          );
        }
      }

      // Get contract name and other metadata
      const sourceUrl = `${this.apiEndpoint}?chainid=${chainId}&module=contract&action=getsourcecode&address=${contractAddress}&apikey=${this.apiKey}`;
      const sourceResponse = await axios.get<EtherscanContractSourceResponse>(
        sourceUrl,
      );

      let name = 'Unknown';
      let sourceCode = '';
      let compilerVersion = '';

      if (
        sourceResponse.data.status === '1' &&
        sourceResponse.data.result &&
        sourceResponse.data.result[0]
      ) {
        const sourceData = sourceResponse.data.result[0];
        name = sourceData.ContractName || 'Unknown';
        sourceCode = sourceData.SourceCode || '';
        compilerVersion = sourceData.CompilerVersion || '';
      }

      return {
        name,
        abi: parsedAbi,
        sourceCode,
        compilerVersion,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching contract info from Etherscan: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Scrapes the implementation address of a proxy contract from Etherscan's web UI
   * @param contractAddress The address of the proxy contract
   * @returns The implementation address or null if not found
   */
  private async scrapeImplementationAddressFromEtherscanUI(
    contractAddress: string,
  ): Promise<string | null> {
    try {
      this.logger.log(
        `Scraping implementation address for ${contractAddress} from Etherscan UI`,
      );

      // Request the proxy contract page
      const proxyUrl = `${this.etherscanBaseUrl}/token/${contractAddress}#readProxyContract`;
      const response = await axios.get(proxyUrl);

      // Extract the implementation address using regex
      const html = response.data as string;

      // Look for the implementation contract address in the readProxyMessage span
      const proxyMessageRegex =
        /<span id="ContentPlaceHolder1_readProxyMessage"[^>]*>[\s\S]*?implementation contract at[\s\S]*?<a href='\/address\/(0x[a-fA-F0-9]{40})#code'>/i;
      const match = html.match(proxyMessageRegex);

      if (match && match[1]) {
        const implementationAddress = match[1];
        this.logger.log(
          `Scraped implementation address: ${implementationAddress}`,
        );
        return implementationAddress;
      }

      // Try alternative regex patterns in case the HTML structure changed
      const alternativeRegex =
        /implementation contract at.*?<a[^>]*href=['"]\/address\/(0x[a-fA-F0-9]{40})['"].*?>/i;
      const alternativeMatch = html.match(alternativeRegex);

      if (alternativeMatch && alternativeMatch[1]) {
        const implementationAddress = alternativeMatch[1];
        this.logger.log(
          `Scraped implementation address (alternative pattern): ${implementationAddress}`,
        );
        return implementationAddress;
      }

      this.logger.warn(`Could not extract implementation address from HTML`);
      return null;
    } catch (error) {
      this.logger.error(
        `Error scraping implementation address: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Checks if a contract is a proxy contract based on its ABI
   * @param abi The contract ABI
   * @returns Whether the contract is likely a proxy contract
   */
  private isProxyContract(abi: any[]): boolean {
    if (!abi || !Array.isArray(abi) || abi.length === 0) return false;

    // Check for common proxy patterns
    const hasUpgradeablePatterns = abi.some(
      (item) =>
        // EIP-1967 proxy pattern indicators
        item.name === 'upgradeTo' ||
        item.name === 'upgradeToAndCall' ||
        // Beacon proxy pattern indicators
        (item.name === 'BeaconUpgraded' && item.type === 'event') ||
        // Generic proxy pattern indicators
        (item.type === 'fallback' && item.stateMutability === 'payable'),
    );

    // Check if the ABI is very minimal (typical for proxies)
    const isMinimalAbi = abi.length < 10;

    return hasUpgradeablePatterns || isMinimalAbi;
  }
}
