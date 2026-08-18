import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ThemeService } from './core/services/theme.service';
import { DynamicTranslateService } from './core/services/dynamic-translate.service';

// 1. Importation d'EmailJS
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  public themeService = inject(ThemeService);
  public translateService = inject(DynamicTranslateService);

  // Remplacez ces 3 constantes par vos identifiants EmailJS :
  private readonly EMAILJS_SERVICE_ID = 'service_astrosphere';  // Votre Service ID Gmail
  private readonly EMAILJS_TEMPLATE_ID = 'template_ayni5k6'; // Votre Template ID
  private readonly EMAILJS_PUBLIC_KEY = 'DKM_bo0uNmtHw2a-n'; // Votre Public Key (trouvée dans Account > API Keys)

  // Contact Modal State
  isContactOpen = signal<boolean>(false);
  contactName = signal<string>('');
  contactEmail = signal<string>('');
  contactMessage = signal<string>('');
  
  // États d'envoi
  isSending = signal<boolean>(false); // Indique si l'e-mail est en cours d'envoi
  contactSent = signal<boolean>(false); // Indique si l'e-mail a été envoyé avec succès

  ngOnInit(): void {
    this.translateService.init();
  }

  navLinks = [
    { path: '/home', label: 'Home', icon: 'auto_awesome', key: 'home' },
    { path: '/explore', label: 'Explore Space', icon: 'public', key: 'explore' },
    { path: '/theories', label: 'Physics & Theories', icon: 'science', key: 'theories' },
    { path: '/lab', label: 'Stargazer Lab', icon: 'gamepad', key: 'lab' }
  ];

  openContactModal(): void {
    this.isContactOpen.set(true);
    this.contactSent.set(false);
    this.isSending.set(false);
  }

  closeContactModal(): void {
    this.isContactOpen.set(false);
  }

  // 2. Fonction d'envoi asynchrone via EmailJS
  async sendContactMessage(): Promise<void> {
    if (!this.contactName() || !this.contactEmail() || !this.contactMessage()) {
      return;
    }

    this.isSending.set(true);

    try {
      // Les clés de cet objet correspondent exactement aux variables de votre template EmailJS :
      // {{from_name}}, {{reply_to}}, {{message}}
      const templateParams = {
        from_name: this.contactName(),
        reply_to: this.contactEmail(),
        message: this.contactMessage()
      };

      // Appel à l'API EmailJS
      await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams,
        this.EMAILJS_PUBLIC_KEY
      );

      // Succès de la transmission
      this.contactSent.set(true);

      // Réinitialisation et fermeture automatique après 2 secondes
      setTimeout(() => {
        this.contactName.set('');
        this.contactEmail.set('');
        this.contactMessage.set('');
        this.closeContactModal();
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l’envoi du message EmailJS :', error);
      alert('Une erreur est survenue lors de l’envoi. Veuillez réessayer.');
    } finally {
      this.isSending.set(false);
    }
  }
}