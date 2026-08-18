import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicTranslateService {
  currentLang = signal<'en' | 'fr'>('en');

  init(): void {
    // Read existing language preference from cookie
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && (match[1] === 'en' || match[1] === 'fr')) {
      this.currentLang.set(match[1] as 'en' | 'fr');
    }

    if (document.getElementById('google-translate-script')) return;

    // Inject hidden target container
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);

    // Inject script with explicit https protocol
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateInit';
    document.body.appendChild(script);

    (window as any).googleTranslateInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en', layout: 0 },
        'google_translate_element'
      );
    };
  }

  setLanguage(lang: 'en' | 'fr'): void {
    this.currentLang.set(lang);

    // Set Google Translate cookie across all subpaths
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${lang}; path=/;`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${domain};`;

    // Force page refresh to re-render DOM in target language
    window.location.reload();
  }
  
}