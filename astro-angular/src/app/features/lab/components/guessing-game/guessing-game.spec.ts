import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessingGame } from './guessing-game';

describe('GuessingGame', () => {
  let component: GuessingGame;
  let fixture: ComponentFixture<GuessingGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessingGame],
    }).compileComponents();

    fixture = TestBed.createComponent(GuessingGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
