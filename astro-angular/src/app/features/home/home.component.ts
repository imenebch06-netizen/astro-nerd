import { Component, signal, inject, OnInit, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NasaApiService, ApodResponse } from '../../core/services/nasa-api';
import { GeminiService } from '../../core/services/gemini.service';
import { DynamicTranslateService } from '../../core/services/dynamic-translate.service'; // Ajustez le chemin d'accès
import { ApodDialog } from './components/apod-dialog/apod-dialog';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressSpinnerModule, 
    MatDialogModule
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private nasaApi = inject(NasaApiService);
  private geminiApi = inject(GeminiService);
  private dialog = inject(MatDialog);
  public translateService = inject(DynamicTranslateService); // Injection du service de langue

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  loadingApod = signal<boolean>(true);
  apodData = signal<ApodResponse | null>(null);

  userQuery = signal<string>('');
  isTyping = signal<boolean>(false);

  // Questions suggérées dynamiques en fonction de la langue active
  quickPrompts = computed(() => {
    const isFr = this.translateService.currentLang() === 'fr';
    return isFr
      ? [
          'Que puis-je explorer ici ?',
          'Explique les trous noirs supermassifs',
          'Comment jouer dans le Stargazer Lab ?'
        ]
      : [
          'What can I explore here?',
          'Explain Supermassive Black Holes',
          'How do I play the Stargazer Lab?'
        ];
  });

  // Message initial adapté à la langue courante lors de l'initialisation
  chatHistory = signal<ChatMessage[]>([
    {
      sender: 'ai',
      text: this.translateService.currentLang() === 'fr'
        ? 'Salutations Stargazer ! 🚀 Je suis votre guide SphereAI en direct. Posez-moi vos questions sur l\'univers ou AstroSphere !'
        : 'Greetings Stargazer! 🚀 I am your live SphereAI guide. Ask me anything about the universe or AstroSphere!',
      time: this.getCurrentTime()
    }
  ]);

  ngOnInit(): void {
    this.nasaApi.getApod().subscribe(data => {
      this.apodData.set(data);
      this.loadingApod.set(false);
    });
  }

  openApodModal(): void {
    const apod = this.apodData();
    if (apod) {
      this.dialog.open(ApodDialog, {
        data: apod,
        panelClass: 'custom-dialog-container',
        maxWidth: '90vw'
      });
    }
  }

  sendMessage(customText?: string): void {
    const textToSend = customText || this.userQuery().trim();
    if (!textToSend || this.isTyping()) return;

    // 1. Ajouter le message de l'utilisateur
    const userMsg: ChatMessage = { sender: 'user', text: textToSend, time: this.getCurrentTime() };
    this.chatHistory.update(history => [...history, userMsg]);
    this.userQuery.set('');
    this.isTyping.set(true);
    this.scrollToBottom();

    // 2. Interroger Gemini (la langue est lue directement dans GeminiService)
    this.geminiApi.askAstroAi(textToSend).subscribe(aiResponse => {
      const aiMsg: ChatMessage = { sender: 'ai', text: aiResponse, time: this.getCurrentTime() };
      this.chatHistory.update(history => [...history, aiMsg]);
      this.isTyping.set(false);
      this.scrollToBottom();
    });
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}