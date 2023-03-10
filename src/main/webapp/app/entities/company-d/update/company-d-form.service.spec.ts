import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../company-d.test-samples';

import { CompanyDFormService } from './company-d-form.service';

describe('CompanyD Form Service', () => {
  let service: CompanyDFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyDFormService);
  });

  describe('Service methods', () => {
    describe('createCompanyDFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompanyDFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            regionName: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing ICompanyD should create a new form with FormGroup', () => {
        const formGroup = service.createCompanyDFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            regionName: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getCompanyD', () => {
      it('should return NewCompanyD for default CompanyD initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCompanyDFormGroup(sampleWithNewData);

        const companyD = service.getCompanyD(formGroup) as any;

        expect(companyD).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompanyD for empty CompanyD initial value', () => {
        const formGroup = service.createCompanyDFormGroup();

        const companyD = service.getCompanyD(formGroup) as any;

        expect(companyD).toMatchObject({});
      });

      it('should return ICompanyD', () => {
        const formGroup = service.createCompanyDFormGroup(sampleWithRequiredData);

        const companyD = service.getCompanyD(formGroup) as any;

        expect(companyD).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompanyD should not enable id FormControl', () => {
        const formGroup = service.createCompanyDFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompanyD should disable id FormControl', () => {
        const formGroup = service.createCompanyDFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
