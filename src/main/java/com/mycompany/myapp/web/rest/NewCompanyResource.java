package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.NewCompany;
import com.mycompany.myapp.repository.NewCompanyRepository;
import com.mycompany.myapp.service.NewCompanyService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.NewCompany}.
 */
@RestController
@RequestMapping("/api")
public class NewCompanyResource {

    private final Logger log = LoggerFactory.getLogger(NewCompanyResource.class);

    private static final String ENTITY_NAME = "newCompany";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NewCompanyService newCompanyService;

    private final NewCompanyRepository newCompanyRepository;

    public NewCompanyResource(NewCompanyService newCompanyService, NewCompanyRepository newCompanyRepository) {
        this.newCompanyService = newCompanyService;
        this.newCompanyRepository = newCompanyRepository;
    }

    /**
     * {@code POST  /new-companies} : Create a new newCompany.
     *
     * @param newCompany the newCompany to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new newCompany, or with status {@code 400 (Bad Request)} if the newCompany has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/new-companies")
    public ResponseEntity<NewCompany> createNewCompany(@RequestBody NewCompany newCompany) throws URISyntaxException {
        log.debug("REST request to save NewCompany : {}", newCompany);
        if (newCompany.getId() != null) {
            throw new BadRequestAlertException("A new newCompany cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NewCompany result = newCompanyService.save(newCompany);
        return ResponseEntity
            .created(new URI("/api/new-companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /new-companies/:id} : Updates an existing newCompany.
     *
     * @param id the id of the newCompany to save.
     * @param newCompany the newCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated newCompany,
     * or with status {@code 400 (Bad Request)} if the newCompany is not valid,
     * or with status {@code 500 (Internal Server Error)} if the newCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/new-companies/{id}")
    public ResponseEntity<NewCompany> updateNewCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NewCompany newCompany
    ) throws URISyntaxException {
        log.debug("REST request to update NewCompany : {}, {}", id, newCompany);
        if (newCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, newCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        NewCompany result = newCompanyService.update(newCompany);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, newCompany.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /new-companies/:id} : Partial updates given fields of an existing newCompany, field will ignore if it is null
     *
     * @param id the id of the newCompany to save.
     * @param newCompany the newCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated newCompany,
     * or with status {@code 400 (Bad Request)} if the newCompany is not valid,
     * or with status {@code 404 (Not Found)} if the newCompany is not found,
     * or with status {@code 500 (Internal Server Error)} if the newCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/new-companies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NewCompany> partialUpdateNewCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody NewCompany newCompany
    ) throws URISyntaxException {
        log.debug("REST request to partial update NewCompany partially : {}, {}", id, newCompany);
        if (newCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, newCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!newCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NewCompany> result = newCompanyService.partialUpdate(newCompany);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, newCompany.getId().toString())
        );
    }

    /**
     * {@code GET  /new-companies} : get all the newCompanies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of newCompanies in body.
     */
    @GetMapping("/new-companies")
    public List<NewCompany> getAllNewCompanies() {
        log.debug("REST request to get all NewCompanies");
        return newCompanyService.findAll();
    }

    /**
     * {@code GET  /new-companies/:id} : get the "id" newCompany.
     *
     * @param id the id of the newCompany to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the newCompany, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/new-companies/{id}")
    public ResponseEntity<NewCompany> getNewCompany(@PathVariable Long id) {
        log.debug("REST request to get NewCompany : {}", id);
        Optional<NewCompany> newCompany = newCompanyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(newCompany);
    }

    /**
     * {@code DELETE  /new-companies/:id} : delete the "id" newCompany.
     *
     * @param id the id of the newCompany to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/new-companies/{id}")
    public ResponseEntity<Void> deleteNewCompany(@PathVariable Long id) {
        log.debug("REST request to delete NewCompany : {}", id);
        newCompanyService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
