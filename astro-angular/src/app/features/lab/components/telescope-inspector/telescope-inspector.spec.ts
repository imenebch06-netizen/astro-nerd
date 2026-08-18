import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelescopeInspector } from './telescope-inspector';

describe('TelescopeInspector', () => {
  let component: TelescopeInspector;
  let fixture: ComponentFixture<TelescopeInspector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelescopeInspector],
    }).compileComponents();

    fixture = TestBed.createComponent(TelescopeInspector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
