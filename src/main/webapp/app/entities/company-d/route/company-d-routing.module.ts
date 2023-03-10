import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompanyDComponent } from '../list/company-d.component';
import { CompanyDDetailComponent } from '../detail/company-d-detail.component';
import { CompanyDUpdateComponent } from '../update/company-d-update.component';
import { CompanyDRoutingResolveService } from './company-d-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const companyDRoute: Routes = [
  {
    path: '',
    component: CompanyDComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompanyDDetailComponent,
    resolve: {
      companyD: CompanyDRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompanyDUpdateComponent,
    resolve: {
      companyD: CompanyDRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompanyDUpdateComponent,
    resolve: {
      companyD: CompanyDRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(companyDRoute)],
  exports: [RouterModule],
})
export class CompanyDRoutingModule {}
