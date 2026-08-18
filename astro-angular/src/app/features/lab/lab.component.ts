import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TelescopeInspectorComponent } from './components/telescope-inspector/telescope-inspector';
import { GuessingGameComponent } from './components/guessing-game/guessing-game';

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [CommonModule, MatIconModule, TelescopeInspectorComponent, GuessingGameComponent],
  templateUrl: './lab.component.html'
})
export class LabComponent {
  activeTab = signal<'inspector' | 'game'>('inspector');
}