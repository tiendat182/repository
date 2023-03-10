import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../new-company.test-samples';

import { NewCompanyFormService } from './new-company-form.service';

describe('NewCompany Form Service', () => {
  let service: NewCompanyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewCompanyFormService);
  });

  describe('Service methods', () => {
    describe('createNewCompanyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNewCompanyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userUpdate: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing INewCompany should create a new form with FormGroup', () => {
        const formGroup = service.createNewCompanyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userUpdate: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getNewCompany', () => {
      it('should return NewNewCompany for default NewCompany initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createNewCompanyFormGroup(sampleWithNewData);

        const newCompany = service.getNewCompany(formGroup) as any;

        expect(newCompany).toMatchObject(sampleWithNewData);
      });

      it('should return NewNewCompany for empty NewCompany initial value', () => {
        const formGroup = service.createNewCompanyFormGroup();

        const newCompany = service.getNewCompany(formGroup) as any;

        expect(newCompany).toMatchObject({});
      });

      it('should return INewCompany', () => {
        const formGroup = service.createNewCompanyFormGroup(sampleWithRequiredData);

        const newCompany = service.getNewCompany(formGroup) as any;

        expect(newCompany).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INewCompany should not enable id FormControl', () => {
        const formGroup = service.createNewCompanyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNewCompany should disable id FormControl', () => {
        const formGroup = service.createNewCompanyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
