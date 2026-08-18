import { Injectable, signal, inject } from '@angular/core';
import { Observable, from, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DynamicTranslateService } from './dynamic-translate.service'; // Ajustez le chemin d'accès

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private translateService = inject(DynamicTranslateService);
  private chatHistory = signal<ChatMessage[]>([]);
  private readonly modelName = 'groq/compound';

  private buildSystemInstruction(currentLang: 'en' | 'fr'): string {
    const isFr = currentLang === 'fr';
    const targetLang = isFr ? 'FRENCH (Français)' : 'ENGLISH';

    return `
# 🚀 ASSISTANT IDENTITY & PERSONA
- **AI Name**: Astro AI / SphereAI (Official Cosmic Guide).
- **Platform**: **AstroSphere** (Virtual Space Station & Observatory).
- **Creator & Owner**: **Imene** (Lead developer and architect of AstroSphere).
- **Personality**: Enthusiastic, passionate about astrophysics, warm, scientifically accurate.

# 🔴 MANDATORY LANGUAGE DIRECTIVE (CRITICAL)
- The current application language selected by the user is: **${targetLang}**.
- You MUST generate your entire response **EXCLUSIVELY IN ${targetLang}**.
- Never mix French and English in the same answer.

# 🗺️ ASTROSPHERE MAP
Recommend these exact routes when relevant:
- 🏠 **Home Hub (\`/home\`)**: NASA APOD live & space telemetry.
- 🌌 **Explore Space (\`/explore\`)**: Cosmic catalog & NASA HD search engine.
- 🔬 **Physics & Theories (\`/theories\`)**: Relativity, Quantum Physics & interactive KaTeX formulas.
- 🎮 **Stargazer Lab (\`/lab\`)**: Astrophysics quizzes, interactive gear & telescope simulator.

# 📜 RESPONSE RULES
1. Always credit **Imene** as the creator/owner if asked.
2. Limit responses to 2 to 4 sentences maximum.
3. Include 2 to 3 space emojis per message (🚀, 🌌, 🪐, 🔭, ✨).
`.trim();
  }

  askAstroAi(prompt: string): Observable<string> {
    const apiKey = environment.groqApiKey?.trim();

    if (!apiKey) {
      return of('Astro AI Offline: API Key missing in environment.ts');
    }

    // Récupération dynamique de la langue active depuis DynamicTranslateService
    const currentLang = this.translateService.currentLang();

    const systemMessage: ChatMessage = {
      role: 'system',
      content: this.buildSystemInstruction(currentLang)
    };

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    const recentHistory = this.chatHistory().slice(-6);

    const payloadMessages = [
      systemMessage,
      ...recentHistory,
      userMessage
    ];

    const requestPromise = fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.modelName,
        messages: payloadMessages,
        temperature: 0.3,
        max_tokens: 250
      })
    }).then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || `HTTP ${res.status}`);
      }

      const botReply = data.choices?.[0]?.message?.content || 'No cosmic signal received.';

      this.chatHistory.update(history => [
        ...history,
        userMessage,
        { role: 'assistant', content: botReply }
      ]);

      return botReply;
    });

    return from(requestPromise).pipe(
      catchError(error => {
        console.error('[Astro AI Error]:', error);
        return of(`Astro AI Hors Ligne : ${error.message}`);
      })
    );
  }

  clearHistory(): void {
    this.chatHistory.set([]);
  }
}