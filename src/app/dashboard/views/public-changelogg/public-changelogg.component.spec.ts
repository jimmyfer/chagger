import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicChangeloggComponent } from './public-changelogg.component';

describe('PublicChangeloggComponent', () => {
  let component: PublicChangeloggComponent;
  let fixture: ComponentFixture<PublicChangeloggComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicChangeloggComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicChangeloggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
