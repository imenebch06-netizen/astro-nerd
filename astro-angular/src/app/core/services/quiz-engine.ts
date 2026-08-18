import { Injectable, signal, computed } from '@angular/core';

export interface QuizQuestion {
  id: string;
  imageUrl: string;
  title: string;
  options: string[];
  hints: string[];
}

@Injectable({ providedIn: 'root' })
export class QuizEngineService {
  private readonly TOTAL_ROUNDS_COUNT = 5;

  private questionPool: QuizQuestion[] = [
    {
      id: '1',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA04215/PIA04215~orig.jpg',
      title: 'Crab Nebula',
      options: ['Crab Nebula', 'Andromeda Galaxy', 'Orion Nebula', 'Ring Nebula'],
      hints: ['A supernova remnant in Taurus.', 'Observed in 1054 AD by Chinese astronomers.']
    },
    {
      id: '2',
      imageUrl: 'https://images-assets.nasa.gov/image/GSFC_20171208_archive_e001435/GSFC_20171208_archive_e001435~orig.jpg',
      title: 'Black Hole (M87*)',
      options: ['Neutron Star', 'Black Hole (M87*)', 'White Dwarf', 'Quasar'],
      hints: ['First direct image captured by the EHT.', 'Event horizon light bending phenomenon.']
    },
    {
      id: '3',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
      title: 'Jupiter',
      options: ['Mars', 'Saturn', 'Jupiter', 'Venus'],
      hints: ['Largest gas giant in solar system.', 'Features the Great Red Spot.']
    },
    {
      id: '4',
      imageUrl: 'https://images-assets.nasa.gov/image/main_image_deep_field_smacs0723-5000/main_image_deep_field_smacs0723-5000~orig.jpg',
      title: 'JWST Deep Field',
      options: ['Hubble Ultra Deep Field', 'JWST Deep Field', 'Kepler Field', 'Cosmic Background'],
      hints: ['First deep field image from James Webb Telescope.', 'Shows gravitational lensing of galaxies.']
    },
    {
      id: '5',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA08329/PIA08329~orig.jpg',
      title: 'Saturn Rings',
      options: ['Uranus Rings', 'Saturn Rings', 'Neptune Rings', 'Kuiper Belt'],
      hints: ['Composed primarily of ice chunks and rock particles.', 'Explored extensively by Cassini.']
    },
    {
      id: '6',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA03153/PIA03153~orig.jpg',
      title: 'Olympus Mons',
      options: ['Olympus Mons', 'Mauna Kea', 'Valles Marineris', 'Elysium Mons'],
      hints: ['Largest volcano in the solar system.', 'Located on Mars.']
    },
    {
      id: '7',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA02330/PIA02330~orig.jpg',
      title: 'Andromeda Galaxy',
      options: ['Triangulum Galaxy', 'Sombrero Galaxy', 'Andromeda Galaxy', 'Whirlpool Galaxy'],
      hints: ['Spiral galaxy ~2.5 million light-years away.', 'Colliding with Milky Way in ~4.5B years.']
    },
    {
      id: '8',
      imageUrl: 'https://images-assets.nasa.gov/image/Pillars%20of%20Creation/Pillars%20of%20Creation~orig.jpg',
      title: 'Pillars of Creation',
      options: ['Eagle Nebula', 'Pillars of Creation', 'Carina Nebula', 'Tarantula Nebula'],
      hints: ['Star-forming region located inside Eagle Nebula.', 'Famous Hubble & JWST target.']
    },
    {
      id: '9',
      imageUrl: 'https://images-assets.nasa.gov/image/GSFC_20171208_archive_e001427/GSFC_20171208_archive_e001427~orig.jpg',
      title: 'Solar Flare',
      options: ['Solar Flare', 'Coronal Mass Ejection', 'Sunspot', 'Aurora Borealis'],
      hints: ['Sudden flash of increased brightness on the Sun.', 'Releases magnetic energy stored in atmosphere.']
    },
    {
      id: '10',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA13102/PIA13102~orig.jpg',
      title: 'Rosette Nebula',
      options: ['Rosette Nebula', 'Lagoon Nebula', 'Veil Nebula', 'Helix Nebula'],
      hints: ['Resembles a rose made of interstellar gas.', 'Located in the Monoceros region.']
    }
  ];

  activeQuestions = signal<QuizQuestion[]>([]);
  currentIndex = signal<number>(0);
  score = signal<number>(0);
  hintsUsed = signal<number>(0);
  isGameOver = signal<boolean>(false);

  // Computed signals for template progress indicators
  currentRound = computed(() => this.currentIndex() + 1);
  totalRounds = signal<number>(this.TOTAL_ROUNDS_COUNT);
  currentQuestion = computed(() => this.activeQuestions()[this.currentIndex()] || null);

  constructor() {
    this.startNewGame();
  }

  startNewGame(): void {
    const shuffled = [...this.questionPool].sort(() => 0.5 - Math.random());
    this.activeQuestions.set(shuffled.slice(0, this.TOTAL_ROUNDS_COUNT));
    this.currentIndex.set(0);
    this.score.set(0);
    this.hintsUsed.set(0);
    this.isGameOver.set(false);
  }

  revealHint(): string | null {
    const q = this.currentQuestion();
    if (!q || this.hintsUsed() >= q.hints.length) return null;
    const hint = q.hints[this.hintsUsed()];
    this.hintsUsed.update(h => h + 1);
    return hint;
  }

  submitAnswer(selectedOption: string): boolean {
    const q = this.currentQuestion();
    if (!q) return false;

    const isCorrect = selectedOption === q.title;
    if (isCorrect) {
      const points = Math.max(100 - (this.hintsUsed() * 30), 40);
      this.score.update(s => s + points);
    }

    if (this.currentIndex() + 1 >= this.TOTAL_ROUNDS_COUNT) {
      this.isGameOver.set(true);
    } else {
      this.currentIndex.update(i => i + 1);
      this.hintsUsed.set(0);
    }

    return isCorrect;
  }
}