import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INewCompany } from '../new-company.model';
import { NewCompanyService } from '../service/new-company.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './new-company-delete-dialog.component.html',
})
export class NewCompanyDeleteDialogComponent {
  newCompany?: INewCompany;

  constructor(protected newCompanyService: NewCompanyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.newCompanyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
