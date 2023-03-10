import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompanyDDetailComponent } from './company-d-detail.component';

describe('CompanyD Management Detail Component', () => {
  let comp: CompanyDDetailComponent;
  let fixture: ComponentFixture<CompanyDDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyDDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ companyD: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CompanyDDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CompanyDDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load companyD on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.companyD).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
