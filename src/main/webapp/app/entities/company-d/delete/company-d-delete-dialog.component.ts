import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompanyD } from '../company-d.model';
import { CompanyDService } from '../service/company-d.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './company-d-delete-dialog.component.html',
})
export class CompanyDDeleteDialogComponent {
  companyD?: ICompanyD;

  constructor(protected companyDService: CompanyDService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.companyDService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
