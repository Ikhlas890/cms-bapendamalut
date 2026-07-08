import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarkiDetail } from './hierarki-detail';

describe('HierarkiDetail', () => {
  let component: HierarkiDetail;
  let fixture: ComponentFixture<HierarkiDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HierarkiDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HierarkiDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
