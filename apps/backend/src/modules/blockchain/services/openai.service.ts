import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface MintFunctionInfo {
  name: string;
  description: string;
  parameters: any[];
  payable: boolean;
}

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly model = 'gpt-4-turbo';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!this.apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY is not defined in environment variables',
      );
    }
  }

  /**
   * Analyzes a contract ABI to identify mint functions
   * @param abi The contract ABI in JSON format
   * @returns Information about the mint function
   */
  async findMintFunction(abi: any[]): Promise<MintFunctionInfo | null> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a blockchain expert specializing in NFT smart contracts.',
            },
            {
              role: 'user',
              content: `Analyze this NFT contract ABI and identify the primary minting function. 
               Return only a JSON object with the following properties:
               - name: The function name
               - description: A brief description of what the function does
               - parameters: An array of parameters the function accepts
               - payable: Boolean indicating if the function accepts ETH payment
               
               Here's the ABI:
               ${JSON.stringify(abi)}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const result = JSON.parse(response.data.choices[0].message.content);
      this.logger.log(`Identified mint function: ${result.name}`);

      return result;
    } catch (error) {
      this.logger.error(`Error identifying mint function: ${error.message}`);
      return null;
    }
  }
}
