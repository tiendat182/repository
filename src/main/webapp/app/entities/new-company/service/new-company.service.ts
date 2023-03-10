import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INewCompany, NewNewCompany } from '../new-company.model';

export type PartialUpdateNewCompany = Partial<INewCompany> & Pick<INewCompany, 'id'>;

type RestOf<T extends INewCompany | NewNewCompany> = Omit<T, 'userUpdate'> & {
  userUpdate?: string | null;
};

export type RestNewCompany = RestOf<INewCompany>;

export type NewRestNewCompany = RestOf<NewNewCompany>;

export type PartialUpdateRestNewCompany = RestOf<PartialUpdateNewCompany>;

export type EntityResponseType = HttpResponse<INewCompany>;
export type EntityArrayResponseType = HttpResponse<INewCompany[]>;

@Injectable({ providedIn: 'root' })
export class NewCompanyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/new-companies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(newCompany: NewNewCompany): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(newCompany);
    return this.http
      .post<RestNewCompany>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(newCompany: INewCompany): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(newCompany);
    return this.http
      .put<RestNewCompany>(`${this.resourceUrl}/${this.getNewCompanyIdentifier(newCompany)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(newCompany: PartialUpdateNewCompany): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(newCompany);
    return this.http
      .patch<RestNewCompany>(`${this.resourceUrl}/${this.getNewCompanyIdentifier(newCompany)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestNewCompany>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestNewCompany[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNewCompanyIdentifier(newCompany: Pick<INewCompany, 'id'>): number {
    return newCompany.id;
  }

  compareNewCompany(o1: Pick<INewCompany, 'id'> | null, o2: Pick<INewCompany, 'id'> | null): boolean {
    return o1 && o2 ? this.getNewCompanyIdentifier(o1) === this.getNewCompanyIdentifier(o2) : o1 === o2;
  }

  addNewCompanyToCollectionIfMissing<Type extends Pick<INewCompany, 'id'>>(
    newCompanyCollection: Type[],
    ...newCompaniesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const newCompanies: Type[] = newCompaniesToCheck.filter(isPresent);
    if (newCompanies.length > 0) {
      const newCompanyCollectionIdentifiers = newCompanyCollection.map(newCompanyItem => this.getNewCompanyIdentifier(newCompanyItem)!);
      const newCompaniesToAdd = newCompanies.filter(newCompanyItem => {
        const newCompanyIdentifier = this.getNewCompanyIdentifier(newCompanyItem);
        if (newCompanyCollectionIdentifiers.includes(newCompanyIdentifier)) {
          return false;
        }
        newCompanyCollectionIdentifiers.push(newCompanyIdentifier);
        return true;
      });
      return [...newCompaniesToAdd, ...newCompanyCollection];
    }
    return newCompanyCollection;
  }

  protected convertDateFromClient<T extends INewCompany | NewNewCompany | PartialUpdateNewCompany>(newCompany: T): RestOf<T> {
    return {
      ...newCompany,
      userUpdate: newCompany.userUpdate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restNewCompany: RestNewCompany): INewCompany {
    return {
      ...restNewCompany,
      userUpdate: restNewCompany.userUpdate ? dayjs(restNewCompany.userUpdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestNewCompany>): HttpResponse<INewCompany> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestNewCompany[]>): HttpResponse<INewCompany[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
