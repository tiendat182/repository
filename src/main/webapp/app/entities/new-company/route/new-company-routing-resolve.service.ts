import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INewCompany } from '../new-company.model';
import { NewCompanyService } from '../service/new-company.service';

@Injectable({ providedIn: 'root' })
export class NewCompanyRoutingResolveService implements Resolve<INewCompany | null> {
  constructor(protected service: NewCompanyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INewCompany | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((newCompany: HttpResponse<INewCompany>) => {
          if (newCompany.body) {
            return of(newCompany.body);
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
