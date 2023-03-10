package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.CompanyD;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link CompanyD}.
 */
public interface CompanyDService {
    /**
     * Save a companyD.
     *
     * @param companyD the entity to save.
     * @return the persisted entity.
     */
    CompanyD save(CompanyD companyD);

    /**
     * Updates a companyD.
     *
     * @param companyD the entity to update.
     * @return the persisted entity.
     */
    CompanyD update(CompanyD companyD);

    /**
     * Partially updates a companyD.
     *
     * @param companyD the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CompanyD> partialUpdate(CompanyD companyD);

    /**
     * Get all the companyDS.
     *
     * @return the list of entities.
     */
    List<CompanyD> findAll();

    /**
     * Get the "id" companyD.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CompanyD> findOne(Long id);

    /**
     * Delete the "id" companyD.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
