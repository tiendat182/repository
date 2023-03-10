import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompanyD, NewCompanyD } from '../company-d.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompanyD for edit and NewCompanyDFormGroupInput for create.
 */
type CompanyDFormGroupInput = ICompanyD | PartialWithRequiredKeyOf<NewCompanyD>;

type CompanyDFormDefaults = Pick<NewCompanyD, 'id'>;

type CompanyDFormGroupContent = {
  id: FormControl<ICompanyD['id'] | NewCompanyD['id']>;
  regionName: FormControl<ICompanyD['regionName']>;
  name: FormControl<ICompanyD['name']>;
};

export type CompanyDFormGroup = FormGroup<CompanyDFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompanyDFormService {
  createCompanyDFormGroup(companyD: CompanyDFormGroupInput = { id: null }): CompanyDFormGroup {
    const companyDRawValue = {
      ...this.getFormDefaults(),
      ...companyD,
    };
    return new FormGroup<CompanyDFormGroupContent>({
      id: new FormControl(
        { value: companyDRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      regionName: new FormControl(companyDRawValue.regionName),
      name: new FormControl(companyDRawValue.name),
    });
  }

  getCompanyD(form: CompanyDFormGroup): ICompanyD | NewCompanyD {
    return form.getRawValue() as ICompanyD | NewCompanyD;
  }

  resetForm(form: CompanyDFormGroup, companyD: CompanyDFormGroupInput): void {
    const companyDRawValue = { ...this.getFormDefaults(), ...companyD };
    form.reset(
      {
        ...companyDRawValue,
        id: { value: companyDRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CompanyDFormDefaults {
    return {
      id: null,
    };
  }
}
