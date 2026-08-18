import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface ApodResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  title: string;
  url: string;
  copyright?: string;
}

export interface NasaSearchResult {
  title: string;
  description: string;
  imageUrl: string;
  nasaId: string;
  nasaUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class NasaApiService {
  private http = inject(HttpClient);
  private apiKey = 'DEMO_KEY'; 
  private apodUrl = 'https://api.nasa.gov/planetary/apod';
  private searchUrl = 'https://images-api.nasa.gov/search';

  /** Reliable local fallback when DEMO_KEY is rate-limited */
  private fallbackApod: ApodResponse = {
    date: new Date().toISOString().split('T')[0],
    title: 'The Carina Nebula in High Definition',
    explanation: 'Dazzling stellar nursery in the Carina Nebula captured in rich detail. When the live NASA API hits rate limits, this offline telemetry takes over seamlessly.',
    media_type: 'image',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
    hdurl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=80'
  };

  /** Fetch Astronomy Picture of the Day with error recovery */
  getApod(): Observable<ApodResponse> {
    return this.http.get<ApodResponse>(`${this.apodUrl}?api_key=${this.apiKey}`).pipe(
      catchError(error => {
        console.warn('NASA APOD API limit reached or failed. Loading fallback cosmic data.', error);
        return of(this.fallbackApod);
      })
    );
  }

  /** Search NASA Image & Video Library */
 searchImages(query: string): Observable<NasaSearchResult[]> {
    return this.http.get<any>(`${this.searchUrl}?q=${encodeURIComponent(query)}&media_type=image`).pipe(
      map(response => {
        const items = response.collection?.items || [];
        return items.slice(0, 12).map((item: any) => {
          const data = item.data?.[0] || {};
          const links = item.links || [];
          const imageLink = links.find((l: any) => l.rel === 'preview')?.href || '';
          const nasaId = data.nasa_id || '';
          
          return {
            title: data.title || 'Cosmic Telemetry',
            description: data.description || 'NASA Archive Media item.',
            imageUrl: imageLink,
            nasaId: nasaId || 'unknown',
            // FIX: Génération du lien direct vers l'archive / API officielle NASA
            nasaUrl: nasaId ? `https://images.nasa.gov/details-${nasaId}` : 'https://images.nasa.gov'
          };
        });
      })
    );
  }
}