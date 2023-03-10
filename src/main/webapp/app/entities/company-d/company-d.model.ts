export interface ICompanyD {
  id: number;
  regionName?: string | null;
  name?: string | null;
}

export type NewCompanyD = Omit<ICompanyD, 'id'> & { id: null };
