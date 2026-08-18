import { Component, signal, computed, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../../core/services/theme.service';

export interface HardwareComponent {
  id: string;
  name: string;
  category: string;
  utility: string;
  specifications: string;
  material: string;
  physicsRole: string;
}

interface ViewBoxState {
  x: number;
  y: number;
  w: number;
  h: number;
}

@Component({
  selector: 'app-telescope-inspector',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './telescope-inspector.html'
})
export class TelescopeInspectorComponent {
  @ViewChild('svgContainer') svgRef!: ElementRef<SVGSVGElement>;

// Global Theme Service Injection
  public themeService = inject(ThemeService);
themeMode = computed(() => this.themeService.isDarkMode() ? 'dark' : 'light');
  xRayMode = signal<boolean>(false);
  selectedId = signal<string>('optical-tube');

  // Interactive Viewport State (Zoom & Pan)
  private readonly initialViewBox: ViewBoxState = { x: 0, y: 0, w: 800, h: 520 };
  viewBox = signal<ViewBoxState>({ ...this.initialViewBox });

  // Mouse / Touch Gesture Tracking
  isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private touchPinchDist = 0;

  // ViewBox string output for SVG
  viewBoxString = computed(() => {
    const vb = this.viewBox();
    return `${vb.x} ${vb.y} ${vb.w} ${vb.h}`;
  });

  private zoomCoordinates: Record<string, ViewBoxState> = {
    'dew-shield': { x: 440, y: 30, w: 320, h: 220 },
    'objective-lens': { x: 420, y: 40, w: 280, h: 200 },
    'optical-tube': { x: 260, y: 70, w: 380, h: 260 },
    'focuser-knob': { x: 220, y: 140, w: 260, h: 190 },
    'diagonal-extension': { x: 130, y: 160, w: 260, h: 190 },
    'eyepiece': { x: 80, y: 180, w: 240, h: 180 },
    'altaz-mount': { x: 310, y: 160, w: 240, h: 180 },
    'tripod-legs': { x: 200, y: 220, w: 460, h: 300 }
  };

  components: Record<string, HardwareComponent> = {
    'dew-shield': {
      id: 'dew-shield',
      name: 'Dew Shield / Lens Hood',
      category: 'Optics Protection',
      utility: 'Extends past the front objective lens to block off-axis stray light and protect glass from moisture condensation during night viewing.',
      specifications: 'Black Matte Anti-Glare Interior Coating',
      material: 'Impact-Resistant ABS Plastic',
      physicsRole: 'Prevents off-axis light flare and maintains thermal insulation over the front lens element.'
    },
    'objective-lens': {
      id: 'objective-lens',
      name: 'Achromatic Objective Lens',
      category: 'Primary Light Collector',
      utility: 'Gathers light at the front of the telescope and refracts it toward a focal point inside the tube.',
      specifications: '50mm Dual-Element Crown & Flint Glass',
      material: 'Fully Multi-Coated Optical Glass',
      physicsRole: 'Uses optical refraction to converge light waves while correcting chromatic aberration.'
    },
    'optical-tube': {
      id: 'optical-tube',
      name: 'Main Optical Tube (OTA)',
      category: 'Chassis & Alignment',
      utility: 'Houses the light path in total darkness, maintaining rigid optical alignment between front lens and rear eyepiece.',
      specifications: '600mm Focal Length Sealed Chassis',
      material: 'Enamel-Coated Rolled Aluminum (White)',
      physicsRole: 'Protects the focal cavity from ambient light leakage and internal air turbulence.'
    },
    'focuser-knob': {
      id: 'focuser-knob',
      name: 'Rack-and-Pinion Focuser Knob',
      category: 'Mechanical Focus',
      utility: 'Drives the internal drawtube back and forth to bring celestial objects into sharp focus.',
      specifications: '1.25" Standard Gear Travel',
      material: 'Molded Polymer & Metal Gear Track',
      physicsRole: 'Adjusts the distance between optics to intersect the real focal plane precisely at the eyepiece.'
    },
    'diagonal-extension': {
      id: 'diagonal-extension',
      name: 'Erecting Diagonal / Extension Tube',
      category: 'Image Orientation',
      utility: 'Flips inverted images right-side up and provides a comfortable 45° viewing angle for ground and sky watching.',
      specifications: '1.25" Barrel / 45° Prism Assembly',
      material: 'Optical Glass Prism in Hardened Housing',
      physicsRole: 'Uses internal total reflection to correct left-right and top-bottom spatial inversion.'
    },
    'eyepiece': {
      id: 'eyepiece',
      name: 'Ocular Eyepiece Lens',
      category: 'Magnification Element',
      utility: 'Magnifies the real image focused by the objective lens before sending light into your eye.',
      specifications: '12.5mm / 20mm Interchangeable Focal Lengths',
      material: 'Multi-Coated Optical Glass & Soft Rubber Eyecup',
      physicsRole: 'Determines final magnification ($M = F_{objective} / f_{eyepiece}$).'
    },
    'altaz-mount': {
      id: 'altaz-mount',
      name: 'Alt-Azimuth Mount & Slow-Mo Rod',
      category: 'Dual-Axis Motion Control',
      utility: 'Provides smooth 360° horizontal (Azimuth) panning and vertical (Altitude) tilting with a dedicated slow-motion altitude control rod.',
      specifications: 'Dual-Axis Friction Yoke with Altitude Lock Arm',
      material: 'Reinforced Aluminum Alloy & Polymer Knobs',
      physicsRole: 'Allows precise two-axis tracking across altitude angle and azimuth bearing.'
    },
    'tripod-legs': {
      id: 'tripod-legs',
      name: 'Aluminum Tripod & Accessory Tray',
      category: 'Structural Support',
      utility: 'Height-adjustable three-leg base with center spreader bracket to eliminate micro-vibrations.',
      specifications: '3-Section Telescoping Tubular Legs',
      material: 'Anodized Tubular Aluminum & Rubber Feet',
      physicsRole: 'Lowers the center of gravity and dampens mechanical vibration for stable viewing.'
    }
  };

  selectedComponent = signal<HardwareComponent>(this.components['optical-tube']);

  // --- GESTURE & DIGIT ZOOM / PAN CONTROLS ---

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? 0.88 : 1.12;
    this.applyZoom(zoomFactor, event.clientX, event.clientY);
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStart = { x: event.clientX, y: event.clientY };
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.panByDelta(event.clientX - this.dragStart.x, event.clientY - this.dragStart.y);
    this.dragStart = { x: event.clientX, y: event.clientY };
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.dragStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else if (event.touches.length === 2) {
      this.isDragging = false;
      this.touchPinchDist = this.getTouchDistance(event.touches);
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (this.isDragging && event.touches.length === 1) {
      const dx = event.touches[0].clientX - this.dragStart.x;
      const dy = event.touches[0].clientY - this.dragStart.y;
      this.panByDelta(dx, dy);
      this.dragStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else if (event.touches.length === 2) {
      event.preventDefault();
      const currentDist = this.getTouchDistance(event.touches);
      if (this.touchPinchDist > 0) {
        const factor = this.touchPinchDist / currentDist;
        const midX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const midY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        this.applyZoom(factor, midX, midY);
      }
      this.touchPinchDist = currentDist;
    }
  }

  onTouchEnd(): void {
    this.isDragging = false;
    this.touchPinchDist = 0;
  }

  private applyZoom(factor: number, clientX?: number, clientY?: number): void {
    const current = this.viewBox();
    const newW = Math.min(Math.max(current.w * factor, 120), 1200);
    const newH = Math.min(Math.max(current.h * factor, 78), 780);

    let focusRatioX = 0.5;
    let focusRatioY = 0.5;

    if (this.svgRef && clientX !== undefined && clientY !== undefined) {
      const rect = this.svgRef.nativeElement.getBoundingClientRect();
      focusRatioX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      focusRatioY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    }

    const newX = current.x + (current.w - newW) * focusRatioX;
    const newY = current.y + (current.h - newH) * focusRatioY;

    this.viewBox.set({ x: newX, y: newY, w: newW, h: newH });
  }

  private panByDelta(dxPx: number, dyPx: number): void {
    if (!this.svgRef) return;
    const rect = this.svgRef.nativeElement.getBoundingClientRect();
    const current = this.viewBox();
    const svgDx = (dxPx / rect.width) * current.w;
    const svgDy = (dyPx / rect.height) * current.h;

    this.viewBox.set({
      x: current.x - svgDx,
      y: current.y - svgDy,
      w: current.w,
      h: current.h
    });
  }

  private getTouchDistance(touches: TouchList): number {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // --- COMPONENT SELECTION & THEME TOGGLING ---

  selectHardware(id: string): void {
    this.selectedId.set(id);
    this.selectedComponent.set(this.components[id]);
    const targetZoom = this.zoomCoordinates[id];
    if (targetZoom) {
      this.viewBox.set({ ...targetZoom });
    }
  }

  resetZoom(): void {
    this.viewBox.set({ ...this.initialViewBox });
  }

  toggleXRay(): void {
    this.xRayMode.update(v => !v);
  }
}