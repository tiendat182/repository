import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INewCompany } from '../new-company.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../new-company.test-samples';

import { NewCompanyService, RestNewCompany } from './new-company.service';

const requireRestSample: RestNewCompany = {
  ...sampleWithRequiredData,
  userUpdate: sampleWithRequiredData.userUpdate?.toJSON(),
};

describe('NewCompany Service', () => {
  let service: NewCompanyService;
  let httpMock: HttpTestingController;
  let expectedResult: INewCompany | INewCompany[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NewCompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a NewCompany', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newCompany = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(newCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NewCompany', () => {
      const newCompany = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(newCompany).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a NewCompany', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of NewCompany', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a NewCompany', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addNewCompanyToCollectionIfMissing', () => {
      it('should add a NewCompany to an empty array', () => {
        const newCompany: INewCompany = sampleWithRequiredData;
        expectedResult = service.addNewCompanyToCollectionIfMissing([], newCompany);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(newCompany);
      });

      it('should not add a NewCompany to an array that contains it', () => {
        const newCompany: INewCompany = sampleWithRequiredData;
        const newCompanyCollection: INewCompany[] = [
          {
            ...newCompany,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNewCompanyToCollectionIfMissing(newCompanyCollection, newCompany);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NewCompany to an array that doesn't contain it", () => {
        const newCompany: INewCompany = sampleWithRequiredData;
        const newCompanyCollection: INewCompany[] = [sampleWithPartialData];
        expectedResult = service.addNewCompanyToCollectionIfMissing(newCompanyCollection, newCompany);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(newCompany);
      });

      it('should add only unique NewCompany to an array', () => {
        const newCompanyArray: INewCompany[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const newCompanyCollection: INewCompany[] = [sampleWithRequiredData];
        expectedResult = service.addNewCompanyToCollectionIfMissing(newCompanyCollection, ...newCompanyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const newCompany: INewCompany = sampleWithRequiredData;
        const newCompany2: INewCompany = sampleWithPartialData;
        expectedResult = service.addNewCompanyToCollectionIfMissing([], newCompany, newCompany2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(newCompany);
        expect(expectedResult).toContain(newCompany2);
      });

      it('should accept null and undefined values', () => {
        const newCompany: INewCompany = sampleWithRequiredData;
        expectedResult = service.addNewCompanyToCollectionIfMissing([], null, newCompany, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(newCompany);
      });

      it('should return initial array if no NewCompany is added', () => {
        const newCompanyCollection: INewCompany[] = [sampleWithRequiredData];
        expectedResult = service.addNewCompanyToCollectionIfMissing(newCompanyCollection, undefined, null);
        expect(expectedResult).toEqual(newCompanyCollection);
      });
    });

    describe('compareNewCompany', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNewCompany(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareNewCompany(entity1, entity2);
        const compareResult2 = service.compareNewCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareNewCompany(entity1, entity2);
        const compareResult2 = service.compareNewCompany(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareNewCompany(entity1, entity2);
        const compareResult2 = service.compareNewCompany(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
