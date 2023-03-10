import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompanyD, NewCompanyD } from '../company-d.model';

export type PartialUpdateCompanyD = Partial<ICompanyD> & Pick<ICompanyD, 'id'>;

export type EntityResponseType = HttpResponse<ICompanyD>;
export type EntityArrayResponseType = HttpResponse<ICompanyD[]>;

@Injectable({ providedIn: 'root' })
export class CompanyDService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/company-ds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(companyD: NewCompanyD): Observable<EntityResponseType> {
    return this.http.post<ICompanyD>(this.resourceUrl, companyD, { observe: 'response' });
  }

  update(companyD: ICompanyD): Observable<EntityResponseType> {
    return this.http.put<ICompanyD>(`${this.resourceUrl}/${this.getCompanyDIdentifier(companyD)}`, companyD, { observe: 'response' });
  }

  partialUpdate(companyD: PartialUpdateCompanyD): Observable<EntityResponseType> {
    return this.http.patch<ICompanyD>(`${this.resourceUrl}/${this.getCompanyDIdentifier(companyD)}`, companyD, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompanyD>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompanyD[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompanyDIdentifier(companyD: Pick<ICompanyD, 'id'>): number {
    return companyD.id;
  }

  compareCompanyD(o1: Pick<ICompanyD, 'id'> | null, o2: Pick<ICompanyD, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompanyDIdentifier(o1) === this.getCompanyDIdentifier(o2) : o1 === o2;
  }

  addCompanyDToCollectionIfMissing<Type extends Pick<ICompanyD, 'id'>>(
    companyDCollection: Type[],
    ...companyDSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const companyDS: Type[] = companyDSToCheck.filter(isPresent);
    if (companyDS.length > 0) {
      const companyDCollectionIdentifiers = companyDCollection.map(companyDItem => this.getCompanyDIdentifier(companyDItem)!);
      const companyDSToAdd = companyDS.filter(companyDItem => {
        const companyDIdentifier = this.getCompanyDIdentifier(companyDItem);
        if (companyDCollectionIdentifiers.includes(companyDIdentifier)) {
          return false;
        }
        companyDCollectionIdentifiers.push(companyDIdentifier);
        return true;
      });
      return [...companyDSToAdd, ...companyDCollection];
    }
    return companyDCollection;
  }
}
