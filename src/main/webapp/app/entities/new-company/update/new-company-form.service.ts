import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INewCompany, NewNewCompany } from '../new-company.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INewCompany for edit and NewNewCompanyFormGroupInput for create.
 */
type NewCompanyFormGroupInput = INewCompany | PartialWithRequiredKeyOf<NewNewCompany>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends INewCompany | NewNewCompany> = Omit<T, 'userUpdate'> & {
  userUpdate?: string | null;
};

type NewCompanyFormRawValue = FormValueOf<INewCompany>;

type NewNewCompanyFormRawValue = FormValueOf<NewNewCompany>;

type NewCompanyFormDefaults = Pick<NewNewCompany, 'id' | 'userUpdate'>;

type NewCompanyFormGroupContent = {
  id: FormControl<NewCompanyFormRawValue['id'] | NewNewCompany['id']>;
  userUpdate: FormControl<NewCompanyFormRawValue['userUpdate']>;
  name: FormControl<NewCompanyFormRawValue['name']>;
};

export type NewCompanyFormGroup = FormGroup<NewCompanyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NewCompanyFormService {
  createNewCompanyFormGroup(newCompany: NewCompanyFormGroupInput = { id: null }): NewCompanyFormGroup {
    const newCompanyRawValue = this.convertNewCompanyToNewCompanyRawValue({
      ...this.getFormDefaults(),
      ...newCompany,
    });
    return new FormGroup<NewCompanyFormGroupContent>({
      id: new FormControl(
        { value: newCompanyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userUpdate: new FormControl(newCompanyRawValue.userUpdate),
      name: new FormControl(newCompanyRawValue.name),
    });
  }

  getNewCompany(form: NewCompanyFormGroup): INewCompany | NewNewCompany {
    return this.convertNewCompanyRawValueToNewCompany(form.getRawValue() as NewCompanyFormRawValue | NewNewCompanyFormRawValue);
  }

  resetForm(form: NewCompanyFormGroup, newCompany: NewCompanyFormGroupInput): void {
    const newCompanyRawValue = this.convertNewCompanyToNewCompanyRawValue({ ...this.getFormDefaults(), ...newCompany });
    form.reset(
      {
        ...newCompanyRawValue,
        id: { value: newCompanyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): NewCompanyFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      userUpdate: currentTime,
    };
  }

  private convertNewCompanyRawValueToNewCompany(
    rawNewCompany: NewCompanyFormRawValue | NewNewCompanyFormRawValue
  ): INewCompany | NewNewCompany {
    return {
      ...rawNewCompany,
      userUpdate: dayjs(rawNewCompany.userUpdate, DATE_TIME_FORMAT),
    };
  }

  private convertNewCompanyToNewCompanyRawValue(
    newCompany: INewCompany | (Partial<NewNewCompany> & NewCompanyFormDefaults)
  ): NewCompanyFormRawValue | PartialWithRequiredKeyOf<NewNewCompanyFormRawValue> {
    return {
      ...newCompany,
      userUpdate: newCompany.userUpdate ? newCompany.userUpdate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
