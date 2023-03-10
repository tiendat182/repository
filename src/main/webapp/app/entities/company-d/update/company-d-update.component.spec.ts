import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompanyDFormService } from './company-d-form.service';
import { CompanyDService } from '../service/company-d.service';
import { ICompanyD } from '../company-d.model';

import { CompanyDUpdateComponent } from './company-d-update.component';

describe('CompanyD Management Update Component', () => {
  let comp: CompanyDUpdateComponent;
  let fixture: ComponentFixture<CompanyDUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let companyDFormService: CompanyDFormService;
  let companyDService: CompanyDService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CompanyDUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CompanyDUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompanyDUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    companyDFormService = TestBed.inject(CompanyDFormService);
    companyDService = TestBed.inject(CompanyDService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const companyD: ICompanyD = { id: 456 };

      activatedRoute.data = of({ companyD });
      comp.ngOnInit();

      expect(comp.companyD).toEqual(companyD);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyD>>();
      const companyD = { id: 123 };
      jest.spyOn(companyDFormService, 'getCompanyD').mockReturnValue(companyD);
      jest.spyOn(companyDService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyD });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyD }));
      saveSubject.complete();

      // THEN
      expect(companyDFormService.getCompanyD).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(companyDService.update).toHaveBeenCalledWith(expect.objectContaining(companyD));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyD>>();
      const companyD = { id: 123 };
      jest.spyOn(companyDFormService, 'getCompanyD').mockReturnValue({ id: null });
      jest.spyOn(companyDService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyD: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyD }));
      saveSubject.complete();

      // THEN
      expect(companyDFormService.getCompanyD).toHaveBeenCalled();
      expect(companyDService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyD>>();
      const companyD = { id: 123 };
      jest.spyOn(companyDService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyD });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(companyDService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
