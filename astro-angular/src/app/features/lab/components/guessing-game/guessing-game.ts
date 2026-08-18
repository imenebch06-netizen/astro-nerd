import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface CosmicTriviaQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

@Component({
  selector: 'app-guessing-game',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './guessing-game.html'
})
export class GuessingGameComponent {

  readonly triviaQuestions: CosmicTriviaQuestion[] = [
    {
      id: 1,
      category: 'Theoretical Astrophysics',
      question: 'What boundary around a Black Hole represents the point of no return where light cannot escape?',
      options: ['Photon Sphere', 'Event Horizon', 'Singularity', 'Accretion Boundary'],
      correctIndex: 1,
      explanation: 'At the Event Horizon, the escape velocity exceeds the speed of light ($c$).'
    },
    {
      id: 2,
      category: 'Cosmology & Dark Energy',
      question: 'What unknown cosmological force is causing the accelerated expansion of the universe?',
      options: ['Dark Matter', 'Dark Energy', 'Hawking Radiation', 'Cosmic Inflation Field'],
      correctIndex: 1,
      explanation: 'Dark Energy constitutes ~68% of the observable universe and drives cosmic acceleration.'
    },
    {
      id: 3,
      category: 'Exoplanet Detection',
      question: 'Which observational method detects distant exoplanets when they pass in front of their host star, dimming its starlight?',
      options: ['Radial Velocity Method', 'Transit Photometry', 'Gravitational Microlensing', 'Astrometry'],
      correctIndex: 1,
      explanation: 'Transit Photometry measures minute dips in brightness when a planet transits its parent star.'
    },
    {
      id: 4,
      category: 'General Relativity',
      question: 'What phenomenon occurs when massive galaxy clusters bend starlight behind them like a giant cosmic lens?',
      options: ['Doppler Redshift', 'Gravitational Lensing', 'Time Dilation', 'Chandra Scattering'],
      correctIndex: 1,
      explanation: 'Einstein\'s General Relativity predicted that massive gravitational fields warp spacetime and curve light paths.'
    },
    {
      id: 5,
      category: 'Stellar Evolution',
      question: 'What ultra-dense remnant is formed when a massive star undergoes a core-collapse Supernova without forming a black hole?',
      options: ['White Dwarf', 'Neutron Star / Pulsar', 'Red Giant', 'Brown Dwarf'],
      correctIndex: 1,
      explanation: 'A Neutron Star packs a mass greater than the Sun into a sphere only ~20 kilometers across.'
    },
    {
      id: 6,
      category: 'Big Bang Cosmology',
      question: 'What faint thermal echo fills all space as the oldest electromagnetic radiation in the universe?',
      options: ['Cosmic Microwave Background (CMB)', 'Solar Flare Afterglow', 'Intergalactic Dust Glow', 'Vacuum Energy Emission'],
      correctIndex: 0,
      explanation: 'The CMB is leftover radiation from the Big Bang when the universe cooled enough for neutral atoms to form (~380,000 years after birth).'
    },
    {
      id: 7,
      category: 'Quantum Black Hole Physics',
      question: 'What theoretical black hole emission causes small black holes to slowly evaporate over extreme cosmic timescales?',
      options: ['Hawking Radiation', 'Unruh Radiation', 'Synchrotron Emission', 'Cherenkov Radiation'],
      correctIndex: 0,
      explanation: 'Proposed by Stephen Hawking, quantum vacuum fluctuations near the event horizon lead to thermal photon release and mass loss.'
    },
    {
      id: 8,
      category: 'Astrobiology & Extraterrestrial Life',
      question: 'What paradox highlights the apparent contradiction between the high probability of alien life and the lack of contact?',
      options: ['Olbers\' Paradox', 'Fermi Paradox', 'Twin Paradox', 'Information Paradox'],
      correctIndex: 1,
      explanation: 'Named after Enrico Fermi, the paradox asks: "Where is everybody?" given the billions of sun-like stars in our galaxy.'
    },
    {
      id: 9,
      category: 'Stellar Astrophysics',
      question: 'What maximum mass limit (~1.4 solar masses) prevents a White Dwarf star from collapsing into a neutron star?',
      options: ['Schwarzschild Radius', 'Chandrasekhar Limit', 'Roche Limit', 'Hubble Constant'],
      correctIndex: 1,
      explanation: 'Above 1.4 solar masses, electron degeneracy pressure can no longer withstand gravitational collapse.'
    },
    {
      id: 10,
      category: 'Relativistic Waves',
      question: 'What ripples in the fabric of spacetime, produced by merging black holes, were first detected by LIGO in 2015?',
      options: ['Gravitational Waves', 'Gamma-Ray Bursts', 'Cosmic Rays', 'Magnetar Pulses'],
      correctIndex: 0,
      explanation: 'Gravitational waves distort spacetime by fractions of a proton radius and were predicted by Einstein a century earlier.'
    },
    {
      id: 11,
      category: 'Galactic Evolution',
      question: 'What spectral phenomenon causes light from distant galaxies to shift toward longer wavelengths as space expands?',
      options: ['Cosmological Redshift', 'Blue Offset', 'Compton Effect', 'Stark Effect'],
      correctIndex: 0,
      explanation: 'As light travels across expanding space, its wavelength stretches toward the red end of the spectrum.'
    },
    {
      id: 12,
      category: 'Solar System Boundaries',
      question: 'What theoretical spherical shell of icy planetesimals is believed to surround our solar system at distances up to 100,000 AU?',
      options: ['Kuiper Belt', 'Oort Cloud', 'Asteroid Belt', 'Heliosheath'],
      correctIndex: 1,
      explanation: 'The Oort Cloud is the distant reservoir for long-period comets orbiting at the outer limits of the Sun’s gravitational influence.'
    }
  ];

  // Component Signals State
  currentQuestionIndex = signal<number>(0);
  triviaScore = signal<number>(0);
  triviaStreak = signal<number>(0);
  highScore = signal<number>(0);
  selectedOption = signal<number | null>(null);
  isAnswered = signal<boolean>(false);
  triviaFinished = signal<boolean>(false);

  currentQuestion = computed(() => this.triviaQuestions[this.currentQuestionIndex()]);

  answerQuestion(index: number): void {
    if (this.isAnswered()) return;

    this.selectedOption.set(index);
    this.isAnswered.set(true);

    const q = this.currentQuestion();
    if (index === q.correctIndex) {
      const streakBonus = this.triviaStreak() * 25;
      this.triviaScore.update(s => s + 100 + streakBonus);
      this.triviaStreak.update(st => st + 1);
    } else {
      this.triviaStreak.set(0);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.triviaQuestions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      this.selectedOption.set(null);
      this.isAnswered.set(false);
    } else {
      if (this.triviaScore() > this.highScore()) {
        this.highScore.set(this.triviaScore());
      }
      this.triviaFinished.set(true);
    }
  }

  restartTrivia(): void {
    this.currentQuestionIndex.set(0);
    this.triviaScore.set(0);
    this.triviaStreak.set(0);
    this.selectedOption.set(null);
    this.isAnswered.set(false);
    this.triviaFinished.set(false);
  }
}