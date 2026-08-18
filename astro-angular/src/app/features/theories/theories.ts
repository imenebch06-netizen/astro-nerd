import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface ScientificLink {
  label: string;
  url: string;
}

export interface TheoryItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Relativity' | 'Quantum' | 'Cosmology' | 'Astrophysics';
  formula: string;
  imageUrl: string;
  summary: string;
  keyPrinciples: string[];
  scientificLinks: ScientificLink[];
}

@Component({
  selector: 'app-theories',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatPaginatorModule
  ],
  templateUrl: './theories.html',
  styleUrl: './theories.scss'
})
export class TheoriesComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');
  katexLoaded = signal<boolean>(false);

  // --- SIGNALS DE PAGINATION ANGULAR MATERIAL ---
  pageIndex = signal<number>(0); // MatPaginator utilise un index basé sur 0
  itemsPerPage = signal<number>(3); // 3 éléments par page

  categories = ['all', 'Relativity', 'Quantum', 'Cosmology', 'Astrophysics'];
  theories = signal<TheoryItem[]>([
    {
      id: 'gr',
      title: 'General Relativity',
      subtitle: 'Albert Einstein (1915)',
      category: 'Relativity',
      formula: 'R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}',
      imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
      summary: 'Describes gravity as the geometric curvature of 4D spacetime caused by mass and energy.',
      keyPrinciples: [
        'Equivalence Principle: Acceleration and gravity are locally indistinguishable.',
        'Gravitational Lensing: Mass warps paths of light beams.',
        'Gravitational Time Dilation: Time flows slower in stronger gravitational fields.'
      ],
      scientificLinks: [
        { label: 'NASA Gravitational Physics', url: 'https://science.nasa.gov/astrophysics/focus-areas/what-is-relativity/' },
        { label: 'EHT Black Hole Paper (ApJL)', url: 'https://iopscience.iop.org/journal/2041-8205' }
      ]
    },
    {
      id: 'sr',
      title: 'Special Relativity',
      subtitle: 'Albert Einstein (1905)',
      category: 'Relativity',
      formula: 'E = \\frac{m c^2}{\\sqrt{1 - \\frac{v^2}{c^2}}}',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      summary: 'Establishes that the speed of light is constant in all inertial reference frames, uniting space and time.',
      keyPrinciples: [
        'Mass-Energy Equivalence: Mass can convert into energy ($E=mc^2$).',
        'Time Dilation: Moving clocks tick slower relative to stationary observers.',
        'Length Contraction: Objects shorten along direction of motion near light speed.'
      ],
      scientificLinks: [
        { label: 'NASA Physics Fundamentals', url: 'https://www.nasa.gov/' },
        { label: 'CERN Special Relativity Notes', url: 'https://home.cern/' }
      ]
    },
    {
      id: 'qft',
      title: 'Quantum Field Theory',
      subtitle: 'Dirac, Feynman, & Schwinger',
      category: 'Quantum',
      formula: '(i\\hbar \\gamma^\\mu \\partial_\\mu - mc)\\psi = 0',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      summary: 'Combines special relativity and quantum mechanics, viewing subatomic particles as excited states of fields.',
      keyPrinciples: [
        'Quantized Fields: Fundamental forces are mediated by gauge bosons.',
        'Vacuum Energy: Space contains zero-point quantum energy fluctuations.',
        'Antimatter Prediction: Solutions imply negative-energy partner states.'
      ],
      scientificLinks: [
        { label: 'CERN Quantum Field Theory', url: 'https://home.cern/science/physics/standard-model' },
        { label: 'Nature Physics Review', url: 'https://www.nature.com/nphys/' }
      ]
    },
    {
      id: 'qed',
      title: 'Quantum Electrodynamics',
      subtitle: 'Feynman, Schwinger, Tomonaga',
      category: 'Quantum',
      formula: '\\mathcal{L} = \\bar{\\psi}(i\\gamma^\\mu D_\\mu - m)\\psi - \\frac{1}{4}F_{\\mu\\nu}F^{\\mu\\nu}',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      summary: 'Relativistic quantum description of electromagnetism showing interactions between light and charged matter.',
      keyPrinciples: [
        'Feynman Diagrams: Visual calculation method for quantum perturbation.',
        'Virtual Photons: Force mediation via transient particle exchange.',
        'Precision Metrology: Agrees with electron magnetic moment to 12 decimals.'
      ],
      scientificLinks: [
        { label: 'Nobel Prize Foundation QED', url: 'https://www.nobelprize.org/' },
        { label: 'NIST Physical Constants', url: 'https://www.nist.gov/' }
      ]
    },
    {
      id: 'lcdm',
      title: 'ΛCDM Big Bang Cosmology',
      subtitle: 'Standard Model of Cosmology',
      category: 'Cosmology',
      formula: 'H^2 = \\left(\\frac{\\dot{a}}{a}\\right)^2 = \\frac{8\\pi G}{3}\\rho + \\frac{\\Lambda c^2}{3} - \\frac{k c^2}{a^2}',
      imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
      summary: 'Parametrizes cosmic evolution driven by Dark Energy (Λ) and Cold Dark Matter (CDM).',
      keyPrinciples: [
        'Cosmic Microwave Background: Thermal radiation relic from 380,000 yrs post-Big Bang.',
        'Accelerating Expansion: Cosmic acceleration driven by vacuum dark energy.',
        'Large-Scale Structure: Dark matter scaffolds galaxy filaments.'
      ],
      scientificLinks: [
        { label: 'ESA Planck CMB Archives', url: 'https://www.esa.int/Science_Technology/Planck' },
        { label: 'NASA WMAP Legacy', url: 'https://map.gsfc.nasa.gov/' }
      ]
    },
    {
      id: 'inflation',
      title: 'Cosmic Inflation Theory',
      subtitle: 'Alan Guth & Andrei Linde (1981)',
      category: 'Cosmology',
      formula: 'N = \\int_{t_i}^{t_f} H\\, dt \\ge 60',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
      summary: 'Hypothesizes exponential spacetime expansion $10^{-36}$ seconds after singularity, solving the horizon problem.',
      keyPrinciples: [
        'Flatness Solution: Stretches cosmic curvature to Euclidean geometry.',
        'Horizon Solution: Explains uniform CMB temperatures across disconnected skies.',
        'Quantum Seeds: Microscopic quantum ripples seeded galaxies.'
      ],
      scientificLinks: [
        { label: 'MIT Physics Guth Archive', url: 'https://physics.mit.edu/' },
        { label: 'NASA Universe Origins', url: 'https://science.nasa.gov/' }
      ]
    },
    {
      id: 'hawking',
      title: 'Hawking Radiation',
      subtitle: 'Stephen Hawking (1974)',
      category: 'Astrophysics',
      formula: 'T_H = \\frac{\\hbar c^3}{8\\pi G M k_B}',
      imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=80',
      summary: 'Predicts black holes emit thermal radiation due to quantum vacuum effects near the event horizon.',
      keyPrinciples: [
        'Black Hole Evaporation: Black holes gradually lose mass and radiate away.',
        'Event Horizon Quantum Pair Creation: One virtual particle falls in, one escapes.',
        'Information Paradox: Challenges quantum unitarity if information vanishes.'
      ],
      scientificLinks: [
        { label: 'Nature Physics Hawking Paper', url: 'https://www.nature.com/' },
        { label: 'NASA Black Hole Focus', url: 'https://science.nasa.gov/astrophysics/' }
      ]
    },
    {
      id: 'standard-model',
      title: 'Standard Model of Particle Physics',
      subtitle: 'CERN & Global Physics Consortium',
      category: 'Quantum',
      formula: '\\mathcal{L}_{SM} = -\\frac{1}{4}F_{\\mu\\nu}^a F^{a\\mu\\nu} + i\\bar{\\psi}\\gamma^\\mu D_\\mu\\psi + h.c. + |D_\\mu\\Phi|^2 - V(\\Phi)',
      imageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
      summary: 'Classifies 17 fundamental particles and three non-gravitational forces governing matter.',
      keyPrinciples: [
        'Quarks & Leptons: 12 fundamental matter fermions.',
        'Gauge Bosons: Force carriers (photons, gluons, W/Z bosons).',
        'Higgs Mechanism: Higgs field gives mass to elementary particles.'
      ],
      scientificLinks: [
        { label: 'CERN Standard Model Overview', url: 'https://home.cern/science/physics/standard-model' },
        { label: 'Fermilab Particle Physics', url: 'https://www.fnal.gov/' }
      ]
    },
    {
      id: 'string-theory',
      title: 'Superstring & M-Theory',
      subtitle: 'Green, Schwarz, Witten',
      category: 'Quantum',
      formula: 'S_{Nambu-Goto} = -\\frac{1}{2\\pi\\alpha\'} \\int d^2\\sigma \\sqrt{-\\det(h_{\\alpha\\beta})}',
      imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
      summary: 'Replaces 0D point particles with 1D vibrating strings in 10 or 11 spacetime dimensions.',
      keyPrinciples: [
        'Extra Dimensions: Compactified Calabi-Yau manifolds.',
        'Unification: Unifies quantum mechanics with general relativity naturally.',
        'D-Branes: Higher-dimensional surfaces where open strings attach.'
      ],
      scientificLinks: [
        { label: 'IAS Princeton String Theory', url: 'https://www.ias.edu/' },
        { label: 'CERN Theory Department', url: 'https://theory.cern/' }
      ]
    },
    {
      id: 'lqg',
      title: 'Loop Quantum Gravity',
      subtitle: 'Rovelli, Smolin, Ashtekar',
      category: 'Relativity',
      formula: 'A = 8\\pi \\gamma l_P^2 \\sum_i \\sqrt{j_i(j_i+1)}',
      imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
      summary: 'Non-perturbative quantum gravity theory modeling space as quantized discrete spin networks.',
      keyPrinciples: [
        'Quantized Geometry: Minimum discrete unit of area and volume.',
        'Background Independence: Space is not a static stage but quantum loops.',
        'Big Bounce: Replaces Big Bang singularity with a quantum bounce.'
      ],
      scientificLinks: [
        { label: 'Perimeter Institute LQG', url: 'https://perimeterinstitute.ca/' },
        { label: 'arXiv Quantum Physics', url: 'https://arxiv.org/' }
      ]
    },
    {
      id: 'gw-theory',
      title: 'Gravitational Wave Theory',
      subtitle: 'LIGO / Virgo / KAGRA Collaborations',
      category: 'Relativity',
      formula: 'h_{ij}^{TT} = \\frac{2G}{c^4 r} \\ddot{Q}_{ij}^{TT}\\left(t - \\frac{r}{c}\\right)',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      summary: 'Predicts ripples in spacetime metric generated by accelerating massive compact bodies.',
      keyPrinciples: [
        'Quadrupole Radiation: Wave amplitude proportional to second time derivative of mass moment.',
        'Binary Mergers: Waveform signals from black hole/neutron star coalescences.',
        'Strain Amplitude: Measures relative length shifts on order of $10^{-21}$.'
      ],
      scientificLinks: [
        { label: 'LIGO Caltech Laboratory', url: 'https://www.ligo.caltech.edu/' },
        { label: 'ESA LISA Gravitational Wave Mission', url: 'https://www.esa.int/' }
      ]
    },
    {
      id: 'chandrasekhar',
      title: 'Chandrasekhar Limit',
      subtitle: 'Subrahmanyan Chandrasekhar (1930)',
      category: 'Astrophysics',
      formula: 'M_{Ch} \\approx \\frac{\\omega_3^0 \\sqrt{3\\pi}}{2} \\left(\\frac{\\hbar c}{G}\\right)^{3/2} \\frac{1}{(\\mu_e m_H)^2} \\approx 1.44 M_\\odot',
      imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=80',
      summary: 'Maximum mass limit for a stable white dwarf star supported by electron degeneracy pressure.',
      keyPrinciples: [
        'Degeneracy Pressure: Pauli exclusion principle prevents electron collapse.',
        'Supernova Threshold: Exceeding $1.44 M_\\odot$ triggers Type Ia Supernovae.',
        'Relativistic Degeneracy: Ultra-relativistic electrons weaken collapse resistance.'
      ],
      scientificLinks: [
        { label: 'NASA Chandra X-Ray Observatory', url: 'https://chandra.harvard.edu/' },
        { label: 'Astrophysical Journal Records', url: 'https://iopscience.iop.org/' }
      ]
    },
    {
      id: 'dark-matter',
      title: 'Dark Matter Halos & WIMPs',
      subtitle: 'Vera Rubin & Fritz Zwicky',
      category: 'Astrophysics',
      formula: 'v(r) = \\sqrt{\\frac{G M(r)}{r}} \\implies M(r) \\propto r',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      summary: 'Postulates non-luminous matter accounting for ~85% of total cosmic mass based on galaxy rotation curves.',
      keyPrinciples: [
        'Flat Rotation Curves: Orbital speeds remain flat at large galactic radii.',
        'Gravitational Lensing: Mass distribution mapped by light deflection.',
        'WIMP Hypothesis: Weakly Interacting Massive Particles candidate.'
      ],
      scientificLinks: [
        { label: 'NASA Dark Matter Portal', url: 'https://science.nasa.gov/' },
        { label: 'ESO Dark Matter Studies', url: 'https://www.eso.org/' }
      ]
    },
    {
      id: 'dark-energy',
      title: 'Dark Energy & Cosmic Acceleration',
      subtitle: 'Perlmutter, Riess, Schmidt (1998)',
      category: 'Cosmology',
      formula: 'w = \\frac{p}{\\rho} \\approx -1',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
      summary: 'Hypothesizes anti-gravitational repulsive vacuum energy driving cosmic acceleration.',
      keyPrinciples: [
        'Type Ia Supernovae: Standard candles revealed accelerating universe.',
        'Cosmological Constant: Matches constant vacuum energy density ($w=-1$).',
        'Cosmic Fate: Dictates Big Freeze or Big Rip scenarios.'
      ],
      scientificLinks: [
        { label: 'Hubble Site Dark Energy', url: 'https://hubblesite.org/' },
        { label: 'Nobel Prize Physics 2011', url: 'https://www.nobelprize.org/' }
      ]
    },
    {
      id: 'electroweak',
      title: 'Electroweak Unification',
      subtitle: 'Glashow, Weinberg, Salam (1967)',
      category: 'Quantum',
      formula: 'SU(2)_L \\times U(1)_Y \\longrightarrow U(1)_{EM}',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      summary: 'Unifies electromagnetism and the weak nuclear force into a single electroweak interaction above 100 GeV.',
      keyPrinciples: [
        'Symmetry Breaking: Higgs mechanism splits electroweak force at lower energies.',
        'Vector Bosons: Predicts massive W+, W-, and Z0 bosons.',
        'Neutral Currents: Weak force exchange without electric charge transfer.'
      ],
      scientificLinks: [
        { label: 'CERN Electroweak Discovery', url: 'https://home.cern/' },
        { label: 'SLAC National Accelerator Lab', url: 'https://www me.slac.stanford.edu/' }
      ]
    },
    {
      id: 'holographic',
      title: 'Holographic Principle',
      subtitle: "'t Hooft & Susskind (1993)",
      category: 'Quantum',
      formula: 'S_{max} = \\frac{k_B A}{4 l_P^2}',
      imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
      summary: 'Speculates all information contained in a volume of space is encoded on its lower-dimensional boundary.',
      keyPrinciples: [
        'Bekenstein Bound: Information capacity scales with surface area $A$, not volume $V$.',
        'AdS/CFT Correspondence: Duality between bulk gravity and boundary gauge theory.',
        'Quantum Holography: Spacetime emergent from quantum entanglement.'
      ],
      scientificLinks: [
        { label: 'Stanford Physics Susskind Archive', url: 'https://physics.stanford.edu/' },
        { label: 'arXiv High Energy Physics', url: 'https://arxiv.org/archive/hep-th' }
      ]
    },
    {
      id: 'qcd',
      title: 'Quantum Chromodynamics',
      subtitle: 'Gell-Mann, Gross, Wilczek',
      category: 'Quantum',
      formula: '\\mathcal{L}_{QCD} = \\sum_q \\bar{\\psi}_q (i\\gamma^\\mu D_\\mu - m_q)\\psi_q - \\frac{1}{4}G_{\\mu\\nu}^a G^{a\\mu\\nu}',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      summary: 'Theory of strong nuclear force governing interactions between quarks mediated by gluons.',
      keyPrinciples: [
        'Color Charge: Quarks carry red, green, or blue color charges.',
        'Asymptotic Freedom: Strong force weakens at shorter distances.',
        'Quark Confinement: Isolated free quarks cannot exist at low energies.'
      ],
      scientificLinks: [
        { label: 'CERN QCD Research', url: 'https://home.cern/' },
        { label: 'Jefferson Lab Nuclear Physics', url: 'https://www.jlab.org/' }
      ]
    },
    {
      id: 'neutrino-osc',
      title: 'Neutrino Oscillations',
      subtitle: 'Kajita & McDonald (1998)',
      category: 'Astrophysics',
      formula: 'P_{\\alpha \\rightarrow \\beta} = \\sin^2(2\\theta) \\sin^2\\left(\\frac{1.27 \\Delta m^2 L}{E}\\right)',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      summary: 'Proves neutrinos possess non-zero mass as they change flavor quantum states in transit.',
      keyPrinciples: [
        'Flavor Mixing: Electron, muon, and tau neutrinos transition into one another.',
        'Non-Zero Mass: Contradicts original zero-mass assumption in Standard Model.',
        'Solar Neutrino Problem: Solved discrepancy in expected solar neutrino flux.'
      ],
      scientificLinks: [
        { label: 'Super-Kamiokande Observatory', url: 'https://www-sk.icrr.u-tokyo.ac.jp/sk/index-e.html' },
        { label: 'SNOLAB Neutrino Experiment', url: 'https://www.snolab.ca/' }
      ]
    },
    {
      id: 'thermo-laws',
      title: 'Thermodynamics & Statistical Mechanics',
      subtitle: 'Boltzmann, Gibbs, Clausius',
      category: 'Astrophysics',
      formula: 'S = k_B \\ln \\Omega',
      imageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80',
      summary: 'Connects microscopic atomic quantum states to macroscopic thermal and cosmic entropy.',
      keyPrinciples: [
        'Second Law: Total entropy of isolated systems never decreases over time.',
        'Statistical Entropy: Measure of microstates ($\\Omega$) corresponding to macrostate.',
        'Cosmic Heat Death: Universe approaches maximum entropy equilibrium state.'
      ],
      scientificLinks: [
        { label: 'NIST Thermodynamics Reference', url: 'https://www.nist.gov/' },
        { label: 'AIP Physics History', url: 'https://www.aip.org/' }
      ]
    },
    {
      id: 'mond',
      title: 'Modified Newtonian Dynamics (MOND)',
      subtitle: 'Mordehai Milgrom (1983)',
      category: 'Astrophysics',
      formula: 'F = m a \\cdot \\mu\\left(\\frac{a}{a_0}\\right), \\quad a_0 \\approx 1.2 \\times 10^{-10} \\text{ m/s}^2',
      imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
      summary: 'Alternative gravitational hypothesis modifying Newton second law at extremely low accelerations without dark matter.',
      keyPrinciples: [
        'Acceleration Threshold ($a_0$): Gravity transitions at $a < a_0$.',
        'Baryonic Tully-Fisher: Explains galactic luminosity-rotation relation directly.',
        'No Dark Matter Particle: Attributes galactic rotation anomalies to modified inertia.'
      ],
      scientificLinks: [
        { label: 'Monthly Notices of the RAS', url: 'https://academic.oup.com/mnras' },
        { label: 'arXiv Astrophysics MOND Papers', url: 'https://arxiv.org/archive/astro-ph' }
      ]
    }
  ]);

  filteredTheories = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.theories().filter(t => {
      const matchesCat = cat === 'all' || t.category === cat;
      const matchesQuery = !q || 
        t.title.toLowerCase().includes(q) || 
        t.subtitle.toLowerCase().includes(q) || 
        t.summary.toLowerCase().includes(q) ||
        t.keyPrinciples.some(p => p.toLowerCase().includes(q));

      return matchesCat && matchesQuery;
    });
  });

  // --- THÉORIES PAGINÉES DE LA PAGE COURANTE ---
  paginatedTheories = computed(() => {
    const start = this.pageIndex() * this.itemsPerPage();
    return this.filteredTheories().slice(start, start + this.itemsPerPage());
  });

  ngOnInit(): void {
    this.loadKaTeXScript();
  }

  // --- GESTION DU CHANGEMENT DE PAGE MAT-PAGINATOR ---
  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.itemsPerPage.set(event.pageSize);
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.pageIndex.set(0); // Réinitialise la page à la 1ère
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.pageIndex.set(0); // Réinitialise la page à la 1ère
  }
  
  private loadKaTeXScript(): void {
    if ((window as any).katex) {
      this.katexLoaded.set(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.async = true;
    script.onload = () => this.katexLoaded.set(true);
    document.head.appendChild(script);
  }

  renderFormula(latex: string): SafeHtml {
    const katex = (window as any).katex;
    if (katex) {
      try {
        const html = katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false
        });
        return this.sanitizer.bypassSecurityTrustHtml(html);
      } catch (e) {
        // Fallback below
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(`<code class="font-mono text-cyan-600 dark:text-cyan-300 text-sm">${latex}</code>`);
  }
}