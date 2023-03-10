import dayjs from 'dayjs/esm';

export interface INewCompany {
  id: number;
  userUpdate?: dayjs.Dayjs | null;
  name?: string | null;
}

export type NewNewCompany = Omit<INewCompany, 'id'> & { id: null };
