import dayjs from 'dayjs/esm';

import { INewCompany, NewNewCompany } from './new-company.model';

export const sampleWithRequiredData: INewCompany = {
  id: 74863,
};

export const sampleWithPartialData: INewCompany = {
  id: 34604,
  userUpdate: dayjs('2023-03-09T09:42'),
};

export const sampleWithFullData: INewCompany = {
  id: 86861,
  userUpdate: dayjs('2023-03-09T16:58'),
  name: 'Ville Optimization Beauty',
};

export const sampleWithNewData: NewNewCompany = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
