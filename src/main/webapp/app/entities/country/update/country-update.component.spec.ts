import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CountryFormService } from './country-form.service';
import { CountryService } from '../service/country.service';
import { ICountry } from '../country.model';
import { ICompanyD } from 'app/entities/company-d/company-d.model';
import { CompanyDService } from 'app/entities/company-d/service/company-d.service';

import { CountryUpdateComponent } from './country-update.component';

describe('Country Management Update Component', () => {
  let comp: CountryUpdateComponent;
  let fixture: ComponentFixture<CountryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let countryFormService: CountryFormService;
  let countryService: CountryService;
  let companyDService: CompanyDService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CountryUpdateComponent],
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
      .overrideTemplate(CountryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CountryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    countryFormService = TestBed.inject(CountryFormService);
    countryService = TestBed.inject(CountryService);
    companyDService = TestBed.inject(CompanyDService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CompanyD query and add missing value', () => {
      const country: ICountry = { id: 456 };
      const companyD: ICompanyD = { id: 62577 };
      country.companyD = companyD;

      const companyDCollection: ICompanyD[] = [{ id: 43005 }];
      jest.spyOn(companyDService, 'query').mockReturnValue(of(new HttpResponse({ body: companyDCollection })));
      const additionalCompanyDS = [companyD];
      const expectedCollection: ICompanyD[] = [...additionalCompanyDS, ...companyDCollection];
      jest.spyOn(companyDService, 'addCompanyDToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ country });
      comp.ngOnInit();

      expect(companyDService.query).toHaveBeenCalled();
      expect(companyDService.addCompanyDToCollectionIfMissing).toHaveBeenCalledWith(
        companyDCollection,
        ...additionalCompanyDS.map(expect.objectContaining)
      );
      expect(comp.companyDSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const country: ICountry = { id: 456 };
      const companyD: ICompanyD = { id: 38543 };
      country.companyD = companyD;

      activatedRoute.data = of({ country });
      comp.ngOnInit();

      expect(comp.companyDSSharedCollection).toContain(companyD);
      expect(comp.country).toEqual(country);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICountry>>();
      const country = { id: 123 };
      jest.spyOn(countryFormService, 'getCountry').mockReturnValue(country);
      jest.spyOn(countryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: country }));
      saveSubject.complete();

      // THEN
      expect(countryFormService.getCountry).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(countryService.update).toHaveBeenCalledWith(expect.objectContaining(country));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICountry>>();
      const country = { id: 123 };
      jest.spyOn(countryFormService, 'getCountry').mockReturnValue({ id: null });
      jest.spyOn(countryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: country }));
      saveSubject.complete();

      // THEN
      expect(countryFormService.getCountry).toHaveBeenCalled();
      expect(countryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICountry>>();
      const country = { id: 123 };
      jest.spyOn(countryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ country });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(countryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCompanyD', () => {
      it('Should forward to companyDService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(companyDService, 'compareCompanyD');
        comp.compareCompanyD(entity, entity2);
        expect(companyDService.compareCompanyD).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
