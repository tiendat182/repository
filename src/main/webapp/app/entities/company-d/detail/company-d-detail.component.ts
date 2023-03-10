import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICompanyD } from '../company-d.model';

@Component({
  selector: 'jhi-company-d-detail',
  templateUrl: './company-d-detail.component.html',
})
export class CompanyDDetailComponent implements OnInit {
  companyD: ICompanyD | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ companyD }) => {
      this.companyD = companyD;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
