export type CategoryType = 'theory' | 'phenomenon' | 'celestial' | 'tools';

export interface SpaceConcept {
  id: string;
  title: string;
  category: CategoryType;
  summary: string;
  history?: string[];
  keyPoints?: string[];
  imageUrl?: string;
}

export interface FunFact {
  id: number;
  fact: string;
}