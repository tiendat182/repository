import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NewCompanyDetailComponent } from './new-company-detail.component';

describe('NewCompany Management Detail Component', () => {
  let comp: NewCompanyDetailComponent;
  let fixture: ComponentFixture<NewCompanyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCompanyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ newCompany: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NewCompanyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NewCompanyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load newCompany on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.newCompany).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
