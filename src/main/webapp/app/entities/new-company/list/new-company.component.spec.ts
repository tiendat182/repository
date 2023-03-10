import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { NewCompanyService } from '../service/new-company.service';

import { NewCompanyComponent } from './new-company.component';

describe('NewCompany Management Component', () => {
  let comp: NewCompanyComponent;
  let fixture: ComponentFixture<NewCompanyComponent>;
  let service: NewCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'new-company', component: NewCompanyComponent }]), HttpClientTestingModule],
      declarations: [NewCompanyComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(NewCompanyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NewCompanyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(NewCompanyService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.newCompanies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to newCompanyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getNewCompanyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getNewCompanyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
