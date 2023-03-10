import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { NewCompanyFormService, NewCompanyFormGroup } from './new-company-form.service';
import { INewCompany } from '../new-company.model';
import { NewCompanyService } from '../service/new-company.service';

@Component({
  selector: 'jhi-new-company-update',
  templateUrl: './new-company-update.component.html',
})
export class NewCompanyUpdateComponent implements OnInit {
  isSaving = false;
  newCompany: INewCompany | null = null;

  editForm: NewCompanyFormGroup = this.newCompanyFormService.createNewCompanyFormGroup();

  constructor(
    protected newCompanyService: NewCompanyService,
    protected newCompanyFormService: NewCompanyFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ newCompany }) => {
      this.newCompany = newCompany;
      if (newCompany) {
        this.updateForm(newCompany);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const newCompany = this.newCompanyFormService.getNewCompany(this.editForm);
    if (newCompany.id !== null) {
      this.subscribeToSaveResponse(this.newCompanyService.update(newCompany));
    } else {
      this.subscribeToSaveResponse(this.newCompanyService.create(newCompany));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INewCompany>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(newCompany: INewCompany): void {
    this.newCompany = newCompany;
    this.newCompanyFormService.resetForm(this.editForm, newCompany);
  }
}
