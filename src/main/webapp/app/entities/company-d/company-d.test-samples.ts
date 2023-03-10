import { ICompanyD, NewCompanyD } from './company-d.model';

export const sampleWithRequiredData: ICompanyD = {
  id: 34911,
};

export const sampleWithPartialData: ICompanyD = {
  id: 38281,
};

export const sampleWithFullData: ICompanyD = {
  id: 44647,
  regionName: 'PNG Minnesota cutting-edge',
  name: 'USB Hong',
};

export const sampleWithNewData: NewCompanyD = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
