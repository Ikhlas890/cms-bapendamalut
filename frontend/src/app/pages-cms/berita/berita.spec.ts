import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Berita } from './berita';

describe('Berita', () => {
  let component: Berita;
  let fixture: ComponentFixture<Berita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Berita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Berita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
