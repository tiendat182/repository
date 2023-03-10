import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NewCompanyComponent } from './list/new-company.component';
import { NewCompanyDetailComponent } from './detail/new-company-detail.component';
import { NewCompanyUpdateComponent } from './update/new-company-update.component';
import { NewCompanyDeleteDialogComponent } from './delete/new-company-delete-dialog.component';
import { NewCompanyRoutingModule } from './route/new-company-routing.module';

@NgModule({
  imports: [SharedModule, NewCompanyRoutingModule],
  declarations: [NewCompanyComponent, NewCompanyDetailComponent, NewCompanyUpdateComponent, NewCompanyDeleteDialogComponent],
})
export class NewCompanyModule {}
