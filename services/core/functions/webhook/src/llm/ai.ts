import { OpenAIChat } from "langchain/llms/openai";

interface IAIModel {
  modelName: string;
  apiKey: string;
  temperature: number;
  organization?: string;
}

export class AIModel {
  private model: OpenAIChat;

  constructor(options: IAIModel) {
    this.model = new OpenAIChat({
      openAIApiKey: options.apiKey,
      modelName: options.modelName,
      temperature: options.temperature,
      configuration: { organization: options.organization },
    });
  }

  public async callModel(prompt: string): Promise<string> {
    try {
      const res = await this.model.call(prompt);
      console.debug(`Response from AI model: ${res}`);

      return res;
    } catch (error) {
      throw new Error(`Error calling AI model: ${(error as Error).message}`);
    }
  }
}
