package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.NewCompany;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link NewCompany}.
 */
public interface NewCompanyService {
    /**
     * Save a newCompany.
     *
     * @param newCompany the entity to save.
     * @return the persisted entity.
     */
    NewCompany save(NewCompany newCompany);

    /**
     * Updates a newCompany.
     *
     * @param newCompany the entity to update.
     * @return the persisted entity.
     */
    NewCompany update(NewCompany newCompany);

    /**
     * Partially updates a newCompany.
     *
     * @param newCompany the entity to update partially.
     * @return the persisted entity.
     */
    Optional<NewCompany> partialUpdate(NewCompany newCompany);

    /**
     * Get all the newCompanies.
     *
     * @return the list of entities.
     */
    List<NewCompany> findAll();

    /**
     * Get the "id" newCompany.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<NewCompany> findOne(Long id);

    /**
     * Delete the "id" newCompany.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
