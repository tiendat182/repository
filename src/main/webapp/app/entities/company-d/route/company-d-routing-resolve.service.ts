import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompanyD } from '../company-d.model';
import { CompanyDService } from '../service/company-d.service';

@Injectable({ providedIn: 'root' })
export class CompanyDRoutingResolveService implements Resolve<ICompanyD | null> {
  constructor(protected service: CompanyDService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICompanyD | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((companyD: HttpResponse<ICompanyD>) => {
          if (companyD.body) {
            return of(companyD.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
