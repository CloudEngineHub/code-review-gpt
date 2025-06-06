# Provider Configuration

Shippie support OpenAI, Anthropic, Google Gemini and local models through an OpenAI compatible API.

Just change the `modelString` to the model you want to use.

eg.

```yaml
- name: Run shippie review
  run: bun review --platform=github --modelString=azure:gpt-4o
```

## Azure OpenAI Provider

This section will guide you through configuring and using the Azure OpenAI provider in your Code Review project, which leverages Large Language Models (LLMs) to enhance your code quality and prevent bugs before they reach production.

### Prerequisites

Before you begin, make sure you have the following:

- Azure OpenAI service with a model that supports [Structured Outputs](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/structured-outputs)
- Necessary secrets stored in your repository/environment settings.

To set up the code review script with the Azure OpenAI provider on GitHub CI, add the following configuration in your GitHub Actions workflow file (e.g., .github/workflows/review.yml):

```yaml
- name: Run shippie review
  run: bun review --platform=github --modelString=azure:gpt-4o-custom-deployment-name
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    BASE_SHA: ${{ github.event.pull_request.base.sha }}
    GITHUB_SHA: ${{ github.sha }}
    
    AZURE_RESOURCE_NAME: "my-azure-open-ai-instance"
    AZURE_API_KEY: ${{ secrets.AZURE_OPENAI_API_KEY }}
    AZURE_API_VERSION: "2024-08-01-preview"
```

Key Environment Variables
AZURE_RESOURCE_NAME: The unique name of your Azure OpenAI instance.
AZURE_API_KEY: Your Azure OpenAI API key; should be stored securely as a secret.
AZURE_API_VERSION: Specifies the API version you're using, supporting future and preview versions.

### Troubleshooting

- Invalid API Keys: Double-check your secrets to ensure that they are accurate and up-to-date.
- Deployment Issues: Verify that the deployment names and instance names are correctly stated and match those in your Azure set up.
- `400 Invalid parameter: 'response_format' of type 'json_schema' is not supported with this model` ensure that you're using a model that supports [Structured Outputs](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/structured-outputs) 