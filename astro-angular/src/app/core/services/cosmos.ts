import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SpaceConcept } from '../models/space-data.model';

@Injectable({
  providedIn: 'root'
})
export class CosmosService {
  private http = inject(HttpClient);
  private dataUrl = 'assets/data/cosmos.json'; // Relative path served by Angular

  getConcepts(): Observable<SpaceConcept[]> {
    return this.http.get<{ concepts: SpaceConcept[] }>(this.dataUrl).pipe(
      map(res => res.concepts)
    );
  }

  getConceptsByCategory(category: string): Observable<SpaceConcept[]> {
    return this.getConcepts().pipe(
      map(concepts => concepts.filter(c => c.category === category))
    );
  }

  getRandomFunFact(): Observable<string> {
    return this.http.get<{ funFacts: string[] }>(this.dataUrl).pipe(
      map(res => {
        const facts = res.funFacts || [];
        return facts[Math.floor(Math.random() * facts.length)];
      })
    );
  }
}