import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SpaceConcept } from '../models/space-data.model';

export interface CosmosData {
  concepts: SpaceConcept[];
  funFacts: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CosmosService {
  private http = inject(HttpClient);
  // Adjust path if using Angular 18+ public folder: '/assets/data/cosmos.json'
  private dataUrl = 'assets/data/cosmos.json';

  /** Fetch all space concepts */
  getConcepts(): Observable<SpaceConcept[]> {
    return this.http.get<CosmosData>(this.dataUrl).pipe(
      map(data => data.concepts)
    );
  }

  /** Get concepts filtered by category */
  getConceptsByCategory(category: string): Observable<SpaceConcept[]> {
    return this.getConcepts().pipe(
      map(concepts => concepts.filter(c => c.category === category))
    );
  }

  /** Get single concept details by ID */
  getConceptById(id: string): Observable<SpaceConcept | undefined> {
    return this.getConcepts().pipe(
      map(concepts => concepts.find(c => c.id === id))
    );
  }

  /** Fetch all fun facts */
  getFunFacts(): Observable<string[]> {
    return this.http.get<CosmosData>(this.dataUrl).pipe(
      map(data => data.funFacts)
    );
  }

  /** Get a random fun fact (replacing legacy script logic) */
  getRandomFunFact(): Observable<string> {
    return this.getFunFacts().pipe(
      map(facts => facts[Math.floor(Math.random() * facts.length)])
    );
  }
}