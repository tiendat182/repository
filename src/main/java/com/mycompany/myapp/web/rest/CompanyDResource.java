package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CompanyD;
import com.mycompany.myapp.repository.CompanyDRepository;
import com.mycompany.myapp.service.CompanyDService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CompanyD}.
 */
@RestController
@RequestMapping("/api")
public class CompanyDResource {

    private final Logger log = LoggerFactory.getLogger(CompanyDResource.class);

    private static final String ENTITY_NAME = "companyD";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompanyDService companyDService;

    private final CompanyDRepository companyDRepository;

    public CompanyDResource(CompanyDService companyDService, CompanyDRepository companyDRepository) {
        this.companyDService = companyDService;
        this.companyDRepository = companyDRepository;
    }

    /**
     * {@code POST  /company-ds} : Create a new companyD.
     *
     * @param companyD the companyD to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new companyD, or with status {@code 400 (Bad Request)} if the companyD has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/company-ds")
    public ResponseEntity<CompanyD> createCompanyD(@RequestBody CompanyD companyD) throws URISyntaxException {
        log.debug("REST request to save CompanyD : {}", companyD);
        if (companyD.getId() != null) {
            throw new BadRequestAlertException("A new companyD cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompanyD result = companyDService.save(companyD);
        return ResponseEntity
            .created(new URI("/api/company-ds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /company-ds/:id} : Updates an existing companyD.
     *
     * @param id the id of the companyD to save.
     * @param companyD the companyD to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyD,
     * or with status {@code 400 (Bad Request)} if the companyD is not valid,
     * or with status {@code 500 (Internal Server Error)} if the companyD couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/company-ds/{id}")
    public ResponseEntity<CompanyD> updateCompanyD(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompanyD companyD
    ) throws URISyntaxException {
        log.debug("REST request to update CompanyD : {}, {}", id, companyD);
        if (companyD.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, companyD.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyDRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompanyD result = companyDService.update(companyD);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, companyD.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /company-ds/:id} : Partial updates given fields of an existing companyD, field will ignore if it is null
     *
     * @param id the id of the companyD to save.
     * @param companyD the companyD to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyD,
     * or with status {@code 400 (Bad Request)} if the companyD is not valid,
     * or with status {@code 404 (Not Found)} if the companyD is not found,
     * or with status {@code 500 (Internal Server Error)} if the companyD couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/company-ds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompanyD> partialUpdateCompanyD(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CompanyD companyD
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompanyD partially : {}, {}", id, companyD);
        if (companyD.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, companyD.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyDRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompanyD> result = companyDService.partialUpdate(companyD);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, companyD.getId().toString())
        );
    }

    /**
     * {@code GET  /company-ds} : get all the companyDS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of companyDS in body.
     */
    @GetMapping("/company-ds")
    public List<CompanyD> getAllCompanyDS() {
        log.debug("REST request to get all CompanyDS");
        return companyDService.findAll();
    }

    /**
     * {@code GET  /company-ds/:id} : get the "id" companyD.
     *
     * @param id the id of the companyD to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the companyD, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/company-ds/{id}")
    public ResponseEntity<CompanyD> getCompanyD(@PathVariable Long id) {
        log.debug("REST request to get CompanyD : {}", id);
        Optional<CompanyD> companyD = companyDService.findOne(id);
        return ResponseUtil.wrapOrNotFound(companyD);
    }

    /**
     * {@code DELETE  /company-ds/:id} : delete the "id" companyD.
     *
     * @param id the id of the companyD to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/company-ds/{id}")
    public ResponseEntity<Void> deleteCompanyD(@PathVariable Long id) {
        log.debug("REST request to delete CompanyD : {}", id);
        companyDService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
