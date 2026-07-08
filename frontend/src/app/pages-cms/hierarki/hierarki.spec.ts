import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hierarki } from './hierarki';

describe('Hierarki', () => {
  let component: Hierarki;
  let fixture: ComponentFixture<Hierarki>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hierarki]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hierarki);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
