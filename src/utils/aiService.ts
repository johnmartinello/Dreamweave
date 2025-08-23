import type { AIConfig, Language } from '../types';
import type { HierarchicalTag } from '../types/taxonomy';
import { buildTagId } from '../types/taxonomy';
import type { CategoryId } from '../types/taxonomy';
import type { SubcategoryId } from '../types/taxonomy';

interface AITagGenerationRequest {
  content: string;
  config: AIConfig;
  language: Language;
  categoryId?: CategoryId;
  subcategoryId?: SubcategoryId;
}

interface AITagGenerationResponse {
  tags: HierarchicalTag[];
  error?: string;
}

interface AITitleGenerationRequest {
  content: string;
  config: AIConfig;
  language: Language;
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
          return await this.generateTagsWithGemini(content, config, request.language, request.categoryId, request.subcategoryId);
        case 'lmstudio':
          return await this.generateTagsWithLMStudio(content, config, request.language, request.categoryId, request.subcategoryId);
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
          return await this.generateTitleWithGemini(content, config, request.language);
        case 'lmstudio':
          return await this.generateTitleWithLMStudio(content, config, request.language);
        default:
          return { title: '', error: 'Unsupported AI provider' };
      }
    } catch (error) {
      console.error('AI title generation error:', error);
      return { title: '', error: 'Failed to generate title with AI' };
    }
  }

  private static async generateTagsWithGemini(content: string, config: AIConfig, language: Language, categoryId?: CategoryId, subcategoryId?: SubcategoryId): Promise<AITagGenerationResponse> {
    const categoryLine = categoryId
      ? (language === 'pt-BR'
          ? `Concentre-se em sugerir tags na categoria: ${String(categoryId)}${subcategoryId ? ` → ${String(subcategoryId)}` : ''}.\n`
          : `Focus on suggesting tags in the category: ${String(categoryId)}${subcategoryId ? ` → ${String(subcategoryId)}` : ''}.\n`)
      : '';

    const prompt = language === 'pt-BR' ? `
    ${categoryLine}Extraia 4-8 tags concisas (1-2 palavras) do texto do sonho abaixo. Retorne somente uma lista separada por vírgulas.

    Conteúdo do sonho:
    ${content}

    Tags:
    ` : `
    ${categoryLine}Extract 4–8 concise (1–2 words) tags from the dream text below. Return only a comma-separated list.

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
            maxOutputTokens: 10000,
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

      // Parse and convert to hierarchical tags (default to selected/Uncategorized)
      const labels = generatedText
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
        .slice(0, 8);

      const chosenCategory = categoryId || 'uncategorized';
      const chosenSub = subcategoryId || 'Uncategorized';
      const tags: HierarchicalTag[] = labels.map((label: string) => ({
        id: buildTagId(chosenCategory, chosenSub as any, label),
        label,
        categoryId: chosenCategory,
        subcategoryId: chosenSub as any,
        isCustom: true,
      }));

      return { tags };
    } catch (error) {
      console.error('Gemini API error:', error);
      return { tags: [], error: 'Failed to connect to Gemini API' };
    }
  }

  private static async generateTagsWithLMStudio(content: string, config: AIConfig, language: Language, categoryId?: CategoryId, subcategoryId?: SubcategoryId): Promise<AITagGenerationResponse> {
    const categoryLine = categoryId
      ? (language === 'pt-BR'
          ? `Concentre-se em sugerir tags na categoria: ${String(categoryId)}${subcategoryId ? ` → ${String(subcategoryId)}` : ''}.\n`
          : `Focus on suggesting tags in the category: ${String(categoryId)}${subcategoryId ? ` → ${String(subcategoryId)}` : ''}.\n`)
      : '';

    const prompt = language === 'pt-BR' ? `${categoryLine}Analise o seguinte conteúdo de sonho e gere 4-8 tags relevantes (1-2 palavras). Retorne apenas uma lista separada por vírgulas.

Conteúdo do sonho:
${content}

Tags:` : `${categoryLine}Analyze the dream content and generate 4-8 relevant (1–2 words) tags. Return only a comma-separated list.

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
            max_tokens: 10000,
            stream: false,
          }
        : {
            model: config.modelName || 'local-model',
            prompt,
            temperature: 0.3,
            max_tokens: 10000,
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
      const generatedText: string = isChat
        ? (data.choices?.[0]?.message?.content || '')
        : (data.choices?.[0]?.text || '');
      
      if (!generatedText) {
        return { tags: [], error: 'No response from AI' };
      }

      // Parse and convert to hierarchical tags (default to selected/Uncategorized)
      const labels = generatedText
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
        .slice(0, 8);

      const chosenCategory = categoryId || 'uncategorized';
      const chosenSub = subcategoryId || 'Uncategorized';
      const tags: HierarchicalTag[] = labels.map((label) => ({
        id: buildTagId(chosenCategory, chosenSub as any, label),
        label,
        categoryId: chosenCategory,
        subcategoryId: chosenSub as any,
        isCustom: true,
      }));

      return { tags };
    } catch (error) {
      console.error('LM Studio API error:', error);
      return { tags: [], error: (error as Error).message || 'Failed to connect to LM Studio API' };
    }
  }

  private static async generateTitleWithGemini(content: string, config: AIConfig, language: Language): Promise<AITitleGenerationResponse> {
    const prompt = language === 'pt-BR' ? `
    Crie um título conciso e evocativo (3-8 palavras) para este sonho baseado em seu conteúdo.
    O título deve capturar a essência, emoção ou tema principal do sonho.
    Retorne apenas o título sem texto adicional, aspas ou formatação.

    Conteúdo do sonho:
    ${content}

    Título:` : `
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
            maxOutputTokens: 10000,
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

  private static async generateTitleWithLMStudio(content: string, config: AIConfig, language: Language): Promise<AITitleGenerationResponse> {
    const prompt = language === 'pt-BR' ? `Crie um título conciso e evocativo (3-8 palavras) para este sonho baseado em seu conteúdo. O título deve capturar a essência, emoção ou tema principal do sonho. Retorne apenas o título sem texto adicional, aspas ou formatação.

    Conteúdo do sonho:
    ${content}

    Título:` : `Create a concise, evocative title (3-8 words) for this dream based on its content. The title should capture the essence, emotion, or key theme of the dream. Return only the title with no additional text, quotes, or formatting.

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
            max_tokens: 10000,
            stream: false,
          }
        : {
            model: config.modelName || 'local-model',
            prompt,
            temperature: 0.7,
            max_tokens: 10000,
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
