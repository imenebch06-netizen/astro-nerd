import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApodDialog } from './apod-dialog';

describe('ApodDialog', () => {
  let component: ApodDialog;
  let fixture: ComponentFixture<ApodDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApodDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ApodDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
