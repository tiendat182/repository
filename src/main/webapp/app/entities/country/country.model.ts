import { ICompanyD } from 'app/entities/company-d/company-d.model';

export interface ICountry {
  id: number;
  countryName?: string | null;
  companyD?: Pick<ICompanyD, 'id'> | null;
}

export type NewCountry = Omit<ICountry, 'id'> & { id: null };
