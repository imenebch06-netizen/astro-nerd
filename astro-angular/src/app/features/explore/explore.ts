import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NasaApiService, NasaSearchResult } from '../../core/services/nasa-api';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export type ConceptCategory = 'all' | 'celestial' | 'phenomenon' | 'astrophysics' | 'missions';

export interface CosmicConcept {
  id: string;
  title: string;
  category: ConceptCategory;
  categoryLabel: string;
  summary: string;
  details: string;
  officialSource: {
    name: string;
    url: string;
  };
  tags: string[];
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './explore.html'
})
export class ExploreComponent implements OnInit {
  private nasaApi = inject(NasaApiService);

  // Category & Filter Signals
  selectedCategory = signal<ConceptCategory>('all');
  conceptSearchQuery = signal<string>('');

  // NASA Media Search Signals
  nasaSearchQuery = signal<string>('James Webb Nebula');
  loadingNasa = signal<boolean>(false);
  nasaResults = signal<NasaSearchResult[]>([]);
  selectedMedia = signal<NasaSearchResult | null>(null);

  
  // Comprehensive Catalog Data
  readonly concepts: CosmicConcept[] = [
    // --- CELESTIAL BODIES ---
    {
      id: 'black-hole',
      title: 'Supermassive Black Holes',
      category: 'celestial',
      categoryLabel: 'Celestial Bodies',
      summary: 'Cosmic structures with gravitational pulls so extreme that nothing, not even light, can escape beyond their event horizon.',
      details: 'Found at the centers of almost all massive galaxies. Sagittarius A* resides at the center of the Milky Way with a mass ~4 million times that of our Sun.',
      officialSource: { name: 'NASA Astrophysics', url: 'https://science.nasa.gov/universe/black-holes/' },
      tags: ['Gravity', 'Event Horizon', 'Singularity']
    },
    {
      id: 'neutron-star',
      title: 'Neutron Stars & Pulsars',
      category: 'celestial',
      categoryLabel: 'Celestial Bodies',
      summary: 'Ultra-dense collapsed stellar cores left behind by massive supernova explosions.',
      details: 'A single teaspoon of neutron star material weighs roughly 6 billion tons on Earth. Pulsars are rapidly rotating neutron stars emitting beams of radiation.',
      officialSource: { name: 'ESA Science', url: 'https://www.esa.int/Science_Exploration/Space_Science/Neutron_stars' },
      tags: ['Supernova', 'Magnetar', 'Density']
    },
    {
      id: 'exoplanets',
      title: 'Habitable Exoplanets',
      category: 'celestial',
      categoryLabel: 'Celestial Bodies',
      summary: 'Planets orbiting stars outside our solar system located within the habitable "Goldilocks" zone.',
      details: 'Over 5,000 confirmed exoplanets exist, ranging from gas giants to rocky worlds capable of sustaining liquid surface water like TRAPPIST-1e.',
      officialSource: { name: 'NASA Exoplanet Exploration', url: 'https://exoplanets.nasa.gov/' },
      tags: ['Goldilocks Zone', 'TRAPPIST-1', 'Astrobiology']
    },
    {
      id: 'emission-nebulae',
      title: 'Emission Nebulae',
      category: 'celestial',
      categoryLabel: 'Celestial Bodies',
      summary: 'Glowing clouds of high-temperature ionized interstellar gas generating new solar systems.',
      details: 'Ultraviolet light from nearby young stars strips electrons from hydrogen, causing the gas to glow brightly in vibrant crimson and azure hues.',
      officialSource: { name: 'Hubble Site', url: 'https://hubblesite.org/contents/media/images/2020/16/4646-Image' },
      tags: ['H-Alpha', 'Star Birth', 'Interstellar Gas']
    },

    // --- PHENOMENA ---
    {
      id: 'gravitational-lensing',
      title: 'Gravitational Lensing',
      category: 'phenomenon',
      categoryLabel: 'Phenomena',
      summary: 'The bending of background starlight around massive foreground galaxy clusters.',
      details: 'Predicted by Einstein\'s Theory of General Relativity, galaxy clusters act as massive magnifying glasses, revealing faint early universe structures.',
      officialSource: { name: 'ESA Hubble Optics', url: 'https://esahubble.org/wordbank/gravitational-lensing/' },
      tags: ['Relativity', 'Einstein Ring', 'Spacetime']
    },
    {
      id: 'supernova-remnants',
      title: 'Core-Collapse Supernovae',
      category: 'phenomenon',
      categoryLabel: 'Phenomena',
      summary: 'Cataclysmic stellar explosions marking the death of stars over eight solar masses.',
      details: 'Supernovae synthesize heavy chemical elements like iron, gold, and uranium, dispersing them across space to seed future planets.',
      officialSource: { name: 'Chandra X-Ray Observatory', url: 'https://chandra.harvard.edu/supernova/' },
      tags: ['Stellar Death', 'Heavy Elements', 'Shockwaves']
    },
    {
      id: 'fast-radio-bursts',
      title: 'Fast Radio Bursts (FRBs)',
      category: 'phenomenon',
      categoryLabel: 'Phenomena',
      summary: 'Millisecond-long bursts of intense cosmic radio waves originating from extragalactic space.',
      details: 'In a fraction of a second, an FRB releases as much energy as the Sun generates in days. Highly magnetized neutron stars (magnetars) are prime candidates.',
      officialSource: { name: 'ESO Discoveries', url: 'https://www.eso.org/public/news/' },
      tags: ['Radio Waves', 'Magnetars', 'Deep Space Signal']
    },

    // --- ASTROPHYSICS & THEORIES ---
    {
      id: 'dark-matter-energy',
      title: 'Dark Matter & Dark Energy',
      category: 'astrophysics',
      categoryLabel: 'Astrophysics & Theories',
      summary: 'The invisible constituents making up 95% of the total mass-energy budget of the cosmos.',
      details: 'Dark matter acts as an unseen gravitational scaffolding holding galaxies together, while dark energy exerts a repulsive force driving the accelerated expansion of the cosmos.',
      officialSource: { name: 'CERN Physics', url: 'https://home.cern/science/physics/dark-matter' },
      tags: ['Cosmology', 'Accelerated Expansion', 'Unknown Physics']
    },
    {
      id: 'cosmic-microwave-background',
      title: 'Cosmic Microwave Background',
      category: 'astrophysics',
      categoryLabel: 'Astrophysics & Theories',
      summary: 'The thermal remnant radiation left over from the initial thermal expansion of the Big Bang.',
      details: 'Emitted ~380,000 years after the universe formed, the CMB provides a snapshot of the young universe at a uniform temperature of 2.725 Kelvin.',
      officialSource: { name: 'Planck Mission (ESA)', url: 'https://www.esa.int/Science_Exploration/Space_Science/Planck' },
      tags: ['Big Bang', 'Cosmology', '2.725 Kelvin']
    },

    // --- SPACE MISSIONS & TELESCOPES ---
    {
      id: 'jwst',
      title: 'James Webb Space Telescope',
      category: 'missions',
      categoryLabel: 'Missions & Observatories',
      summary: 'Humanity\'s premier space science observatory operating in the infrared spectrum at Lagrange Point L2.',
      details: 'Equipped with a 6.5-meter gold-coated beryllium mirror, JWST peers back over 13.5 billion years to inspect the first stars and atmospheric compositions of exoplanets.',
      officialSource: { name: 'Webb Space Telescope', url: 'https://webbtelescope.org/' },
      tags: ['JWST', 'Infrared', 'Lagrange L2']
    },
    {
      id: 'eht',
      title: 'Event Horizon Telescope',
      category: 'missions',
      categoryLabel: 'Missions & Observatories',
      summary: 'A global array of synchronized radio telescopes forming an Earth-sized virtual aperture.',
      details: 'EHT captured the first direct image of a black hole shadow in galaxy M87 (2019) and Sagittarius A* at our galactic center (2022).',
      officialSource: { name: 'Event Horizon Telescope', url: 'https://eventhorizontelescope.org/' },
      tags: ['Radio Interferometry', 'Black Hole Image', 'Global Array']
    }
  ];

  // Filtered Concepts Computed Signal
  filteredConcepts = computed(() => {
    const cat = this.selectedCategory();
    const query = this.conceptSearchQuery().toLowerCase().trim();

    return this.concepts.filter(item => {
      const matchesCategory = cat === 'all' || item.category === cat;
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) || 
        item.summary.toLowerCase().includes(query) || 
        item.tags.some(t => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  });

  ngOnInit(): void {
    this.executeNasaSearch();
  }

  setCategory(category: ConceptCategory): void {
    this.selectedCategory.set(category);
  }

  setQuickSearchTag(tag: string): void {
    this.nasaSearchQuery.set(tag);
    this.executeNasaSearch();
  }

  executeNasaSearch(): void {
    const query = this.nasaSearchQuery().trim();
    if (!query) return;

    this.loadingNasa.set(true);
    this.nasaApi.searchImages(query).subscribe({
      next: (results) => {
        this.nasaResults.set(results);
        this.loadingNasa.set(false);
      },
      error: () => {
        this.loadingNasa.set(false);
      }
    });
  }

  openMediaPreview(item: NasaSearchResult): void {
    this.selectedMedia.set(item);
    // Bloque le scroll de la page en arrière-plan
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeMediaPreview(): void {
    this.selectedMedia.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }


  pageSize = signal<number>(3);
  pageIndex = signal<number>(0);

  // Découpage automatique de filteredConcepts() à 3 éléments par page
  paginatedConcepts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredConcepts().slice(start, start + this.pageSize());
  });

  constructor() {
    // Réinitialise la pagination à la page 0 si l'utilisateur filtre ou cherche un concept
    effect(() => {
      this.conceptSearchQuery();
      this.selectedCategory();
      this.pageIndex.set(0);
    }, { allowSignalWrites: true });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}