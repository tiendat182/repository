import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompanyDComponent } from './list/company-d.component';
import { CompanyDDetailComponent } from './detail/company-d-detail.component';
import { CompanyDUpdateComponent } from './update/company-d-update.component';
import { CompanyDDeleteDialogComponent } from './delete/company-d-delete-dialog.component';
import { CompanyDRoutingModule } from './route/company-d-routing.module';

@NgModule({
  imports: [SharedModule, CompanyDRoutingModule],
  declarations: [CompanyDComponent, CompanyDDetailComponent, CompanyDUpdateComponent, CompanyDDeleteDialogComponent],
})
export class CompanyDModule {}
