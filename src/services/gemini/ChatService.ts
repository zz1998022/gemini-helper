import { GoogleGenAI } from '@google/genai'

import { env } from '@config/env'

class ChatService {
  private genAI: GoogleGenAI

  constructor() {
    const apiKey = env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }
    this.genAI = new GoogleGenAI({ apiKey })
  }

  /**
   * 使用 Gemini 模型进行聊天
   * @param prompt 用户输入的问题或提示
   * @returns 模型生成的回答
   */
  public async chat(prompt: string): Promise<string | undefined> {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-pro-preview-03-25',
      contents: prompt,
    })
    console.log(response)
    const text = response.text

    return text
  }

  /**
   * 使用 Gemini 模型进行流式聊天
   * @param prompt 用户输入的问题或提示
   * @param onChunk 回调函数，用于处理每次生成的文本块
   */
  public async chatStream(
    prompt: string,
    onChunk: (text: string) => void,
  ): Promise<void> {
    const response = await this.genAI.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        maxOutputTokens: 300,
      },
    })

    for await (const chunk of response) {
      const text = chunk.text
      console.log(text)
      if (text) {
        onChunk(text)
      }
    }
  }
}

export default new ChatService()
