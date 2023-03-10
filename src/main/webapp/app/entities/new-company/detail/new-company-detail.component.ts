import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INewCompany } from '../new-company.model';

@Component({
  selector: 'jhi-new-company-detail',
  templateUrl: './new-company-detail.component.html',
})
export class NewCompanyDetailComponent implements OnInit {
  newCompany: INewCompany | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ newCompany }) => {
      this.newCompany = newCompany;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
