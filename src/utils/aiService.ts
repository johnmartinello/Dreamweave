import type { AIConfig } from '../types';

interface AITagGenerationRequest {
  content: string;
  config: AIConfig;
}

interface AITagGenerationResponse {
  tags: string[];
  error?: string;
}

interface AITitleGenerationRequest {
  content: string;
  config: AIConfig;
}

interface AITitleGenerationResponse {
  title: string;
  error?: string;
}

export class AIService {
  static async generateTags(request: AITagGenerationRequest): Promise<AITagGenerationResponse> {
    const { content, config } = request;

    if (!config.enabled) {
      return { tags: [], error: 'AI is disabled' };
    }

    // Provider-specific validation
    if (config.provider === 'gemini') {
      if (!config.apiKey || !config.modelName) {
        return { tags: [], error: 'Gemini requires API key and model name' };
      }
    } else if (config.provider === 'lmstudio') {
      if (!config.completionEndpoint || !config.modelName) {
        return { tags: [], error: 'LM Studio requires endpoint and model name' };
      }
    }

    try {
      switch (config.provider) {
        case 'gemini':
          return await this.generateTagsWithGemini(content, config);
        case 'lmstudio':
          return await this.generateTagsWithLMStudio(content, config);
        default:
          return { tags: [], error: 'Unsupported AI provider' };
      }
    } catch (error) {
      console.error('AI tag generation error:', error);
      return { tags: [], error: 'Failed to generate tags with AI' };
    }
  }

  static async generateTitle(request: AITitleGenerationRequest): Promise<AITitleGenerationResponse> {
    const { content, config } = request;

    if (!config.enabled) {
      return { title: '', error: 'AI is disabled' };
    }

    // Provider-specific validation
    if (config.provider === 'gemini') {
      if (!config.apiKey || !config.modelName) {
        return { title: '', error: 'Gemini requires API key and model name' };
      }
    } else if (config.provider === 'lmstudio') {
      if (!config.completionEndpoint || !config.modelName) {
        return { title: '', error: 'LM Studio requires endpoint and model name' };
      }
    }

    try {
      switch (config.provider) {
        case 'gemini':
          return await this.generateTitleWithGemini(content, config);
        case 'lmstudio':
          return await this.generateTitleWithLMStudio(content, config);
        default:
          return { title: '', error: 'Unsupported AI provider' };
      }
    } catch (error) {
      console.error('AI title generation error:', error);
      return { title: '', error: 'Failed to generate title with AI' };
    }
  }

  private static async generateTagsWithGemini(content: string, config: AIConfig): Promise<AITagGenerationResponse> {
    const prompt = `
    Extract 5–8 concise, single- or two-word tags from the following dream text.
    Identify the core themes, emotions, symbols, people, and places.
    If the text is not in English, generate the tags in the same language as the text.
    Return only the tags as a single, comma-separated list with no extra text or commentary.

    Dream content:
    ${content}

    Tags:
    `;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.modelName}:generateContent?key=${config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 100,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!generatedText) {
        return { tags: [], error: 'No response from AI' };
      }

      // Parse the comma-separated tags
      const tags = generatedText
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
        .slice(0, 8); // Limit to 8 tags

      return { tags };
    } catch (error) {
      console.error('Gemini API error:', error);
      return { tags: [], error: 'Failed to connect to Gemini API' };
    }
  }

  private static async generateTagsWithLMStudio(content: string, config: AIConfig): Promise<AITagGenerationResponse> {
    const prompt = `Analyze the following dream content and generate 5-8 relevant tags that capture the key themes, emotions, symbols, and experiences. Return only the tags as a comma-separated list, without any additional text or formatting.

Dream content:
${content}

Tags:`;

    try {
      const isChat = /\/chat\/completions\b/.test(config.completionEndpoint);

      // Build request according to endpoint type
      const requestBody: Record<string, unknown> = isChat
        ? {
            model: config.modelName || 'local-model',
            messages: [
              { role: 'system', content: 'You are a helpful assistant that extracts tags.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 100,
            stream: false,
          }
        : {
            model: config.modelName || 'local-model',
            prompt,
            temperature: 0.3,
            max_tokens: 100,
            stream: false,
          };

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      // Some LM Studio setups accept an auth token; include if provided
      if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

      console.log('LM Studio request:', {
        endpoint: config.completionEndpoint,
        isChat,
        body: requestBody
      });

      const response = await fetch(config.completionEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LM Studio API error response:', errorText);
        throw new Error(`LM Studio API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Parse response according to endpoint type
      const generatedText: string = isChat
        ? (data.choices?.[0]?.message?.content || '')
        : (data.choices?.[0]?.text || '');
      
      if (!generatedText) {
        return { tags: [], error: 'No response from AI' };
      }

      // Parse the comma-separated tags
      const tags = generatedText
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
        .slice(0, 8); // Limit to 8 tags

      return { tags };
    } catch (error) {
      console.error('LM Studio API error:', error);
      return { tags: [], error: (error as Error).message || 'Failed to connect to LM Studio API' };
    }
  }

  private static async generateTitleWithGemini(content: string, config: AIConfig): Promise<AITitleGenerationResponse> {
    const prompt = `
    Create a concise, evocative title (3-8 words) for this dream based on its content.
    The title should capture the essence, emotion, or key theme of the dream.
    Return only the title with no additional text, quotes, or formatting.

    Dream content:
    ${content}

    Title:`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.modelName}:generateContent?key=${config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 50,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedTitle = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!generatedTitle) {
        return { title: '', error: 'No response from AI' };
      }

      // Clean up the title
      const title = generatedTitle.trim().replace(/^["']|["']$/g, '');

      return { title };
    } catch (error) {
      console.error('Gemini API error:', error);
      return { title: '', error: 'Failed to connect to Gemini API' };
    }
  }

  private static async generateTitleWithLMStudio(content: string, config: AIConfig): Promise<AITitleGenerationResponse> {
    const prompt = `Create a concise, evocative title (3-8 words) for this dream based on its content. The title should capture the essence, emotion, or key theme of the dream. Return only the title with no additional text, quotes, or formatting.

    Dream content:
    ${content}

    Title:`;

    try {
      const isChat = /\/chat\/completions\b/.test(config.completionEndpoint);

      // Build request according to endpoint type
      const requestBody: Record<string, unknown> = isChat
        ? {
            model: config.modelName || 'local-model',
            messages: [
              { role: 'system', content: 'You are a helpful assistant that creates dream titles.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 50,
            stream: false,
          }
        : {
            model: config.modelName || 'local-model',
            prompt,
            temperature: 0.7,
            max_tokens: 50,
            stream: false,
          };

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      // Some LM Studio setups accept an auth token; include if provided
      if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

      const response = await fetch(config.completionEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LM Studio API error response:', errorText);
        throw new Error(`LM Studio API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Parse response according to endpoint type
      const generatedTitle: string = isChat
        ? (data.choices?.[0]?.message?.content || '')
        : (data.choices?.[0]?.text || '');
      
      if (!generatedTitle) {
        return { title: '', error: 'No response from AI' };
      }

      // Clean up the title
      const title = generatedTitle.trim().replace(/^["']|["']$/g, '');

      return { title };
    } catch (error) {
      console.error('LM Studio API error:', error);
      return { title: '', error: (error as Error).message || 'Failed to connect to LM Studio API' };
    }
  }
}
