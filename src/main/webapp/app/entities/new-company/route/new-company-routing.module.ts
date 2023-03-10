import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NewCompanyComponent } from '../list/new-company.component';
import { NewCompanyDetailComponent } from '../detail/new-company-detail.component';
import { NewCompanyUpdateComponent } from '../update/new-company-update.component';
import { NewCompanyRoutingResolveService } from './new-company-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const newCompanyRoute: Routes = [
  {
    path: '',
    component: NewCompanyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NewCompanyDetailComponent,
    resolve: {
      newCompany: NewCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NewCompanyUpdateComponent,
    resolve: {
      newCompany: NewCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NewCompanyUpdateComponent,
    resolve: {
      newCompany: NewCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(newCompanyRoute)],
  exports: [RouterModule],
})
export class NewCompanyRoutingModule {}
