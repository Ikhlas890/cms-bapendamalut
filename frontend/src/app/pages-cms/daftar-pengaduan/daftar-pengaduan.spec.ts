import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaftarPengaduan } from './daftar-pengaduan';

describe('DaftarPengaduan', () => {
  let component: DaftarPengaduan;
  let fixture: ComponentFixture<DaftarPengaduan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaftarPengaduan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaftarPengaduan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
