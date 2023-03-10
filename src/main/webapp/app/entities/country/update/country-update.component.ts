import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CountryFormService, CountryFormGroup } from './country-form.service';
import { ICountry } from '../country.model';
import { CountryService } from '../service/country.service';
import { ICompanyD } from 'app/entities/company-d/company-d.model';
import { CompanyDService } from 'app/entities/company-d/service/company-d.service';

@Component({
  selector: 'jhi-country-update',
  templateUrl: './country-update.component.html',
})
export class CountryUpdateComponent implements OnInit {
  isSaving = false;
  country: ICountry | null = null;

  companyDSSharedCollection: ICompanyD[] = [];

  editForm: CountryFormGroup = this.countryFormService.createCountryFormGroup();

  constructor(
    protected countryService: CountryService,
    protected countryFormService: CountryFormService,
    protected companyDService: CompanyDService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCompanyD = (o1: ICompanyD | null, o2: ICompanyD | null): boolean => this.companyDService.compareCompanyD(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ country }) => {
      this.country = country;
      if (country) {
        this.updateForm(country);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const country = this.countryFormService.getCountry(this.editForm);
    if (country.id !== null) {
      this.subscribeToSaveResponse(this.countryService.update(country));
    } else {
      this.subscribeToSaveResponse(this.countryService.create(country));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICountry>>): void {
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

  protected updateForm(country: ICountry): void {
    this.country = country;
    this.countryFormService.resetForm(this.editForm, country);

    this.companyDSSharedCollection = this.companyDService.addCompanyDToCollectionIfMissing<ICompanyD>(
      this.companyDSSharedCollection,
      country.companyD
    );
  }

  protected loadRelationshipsOptions(): void {
    this.companyDService
      .query()
      .pipe(map((res: HttpResponse<ICompanyD[]>) => res.body ?? []))
      .pipe(
        map((companyDS: ICompanyD[]) => this.companyDService.addCompanyDToCollectionIfMissing<ICompanyD>(companyDS, this.country?.companyD))
      )
      .subscribe((companyDS: ICompanyD[]) => (this.companyDSSharedCollection = companyDS));
  }
}
