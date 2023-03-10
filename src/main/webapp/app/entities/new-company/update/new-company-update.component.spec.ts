import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NewCompanyFormService } from './new-company-form.service';
import { NewCompanyService } from '../service/new-company.service';
import { INewCompany } from '../new-company.model';

import { NewCompanyUpdateComponent } from './new-company-update.component';

describe('NewCompany Management Update Component', () => {
  let comp: NewCompanyUpdateComponent;
  let fixture: ComponentFixture<NewCompanyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let newCompanyFormService: NewCompanyFormService;
  let newCompanyService: NewCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NewCompanyUpdateComponent],
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
      .overrideTemplate(NewCompanyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NewCompanyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    newCompanyFormService = TestBed.inject(NewCompanyFormService);
    newCompanyService = TestBed.inject(NewCompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const newCompany: INewCompany = { id: 456 };

      activatedRoute.data = of({ newCompany });
      comp.ngOnInit();

      expect(comp.newCompany).toEqual(newCompany);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INewCompany>>();
      const newCompany = { id: 123 };
      jest.spyOn(newCompanyFormService, 'getNewCompany').mockReturnValue(newCompany);
      jest.spyOn(newCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ newCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: newCompany }));
      saveSubject.complete();

      // THEN
      expect(newCompanyFormService.getNewCompany).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(newCompanyService.update).toHaveBeenCalledWith(expect.objectContaining(newCompany));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INewCompany>>();
      const newCompany = { id: 123 };
      jest.spyOn(newCompanyFormService, 'getNewCompany').mockReturnValue({ id: null });
      jest.spyOn(newCompanyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ newCompany: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: newCompany }));
      saveSubject.complete();

      // THEN
      expect(newCompanyFormService.getNewCompany).toHaveBeenCalled();
      expect(newCompanyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<INewCompany>>();
      const newCompany = { id: 123 };
      jest.spyOn(newCompanyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ newCompany });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(newCompanyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
