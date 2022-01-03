import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasesBoardComponent } from './releases-board.component';

describe('ReleasesBoardComponent', () => {
  let component: ReleasesBoardComponent;
  let fixture: ComponentFixture<ReleasesBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleasesBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasesBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
