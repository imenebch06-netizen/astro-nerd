import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApodResponse } from '../../../../core/services/nasa-api';

@Component({
  selector: 'app-apod-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './apod-dialog.html'
})
export class ApodDialog {
  data: ApodResponse = inject(MAT_DIALOG_DATA);
  private sanitizer = inject(DomSanitizer);

  get safeVideoUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url);
  }
}