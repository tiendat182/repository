import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CompanyDFormService, CompanyDFormGroup } from './company-d-form.service';
import { ICompanyD } from '../company-d.model';
import { CompanyDService } from '../service/company-d.service';

@Component({
  selector: 'jhi-company-d-update',
  templateUrl: './company-d-update.component.html',
})
export class CompanyDUpdateComponent implements OnInit {
  isSaving = false;
  companyD: ICompanyD | null = null;

  editForm: CompanyDFormGroup = this.companyDFormService.createCompanyDFormGroup();

  constructor(
    protected companyDService: CompanyDService,
    protected companyDFormService: CompanyDFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ companyD }) => {
      this.companyD = companyD;
      if (companyD) {
        this.updateForm(companyD);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const companyD = this.companyDFormService.getCompanyD(this.editForm);
    if (companyD.id !== null) {
      this.subscribeToSaveResponse(this.companyDService.update(companyD));
    } else {
      this.subscribeToSaveResponse(this.companyDService.create(companyD));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompanyD>>): void {
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

  protected updateForm(companyD: ICompanyD): void {
    this.companyD = companyD;
    this.companyDFormService.resetForm(this.editForm, companyD);
  }
}
