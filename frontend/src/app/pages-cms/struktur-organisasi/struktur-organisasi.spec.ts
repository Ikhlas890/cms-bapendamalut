import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrukturOrganisasi } from './struktur-organisasi';

describe('StrukturOrganisasi', () => {
  let component: StrukturOrganisasi;
  let fixture: ComponentFixture<StrukturOrganisasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrukturOrganisasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrukturOrganisasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
