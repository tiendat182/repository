package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CompanyD;
import com.mycompany.myapp.repository.CompanyDRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CompanyDResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CompanyDResourceIT {

    private static final String DEFAULT_REGION_NAME = "AAAAAAAAAA";
    private static final String UPDATED_REGION_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/company-ds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CompanyDRepository companyDRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCompanyDMockMvc;

    private CompanyD companyD;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompanyD createEntity(EntityManager em) {
        CompanyD companyD = new CompanyD().regionName(DEFAULT_REGION_NAME).name(DEFAULT_NAME);
        return companyD;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CompanyD createUpdatedEntity(EntityManager em) {
        CompanyD companyD = new CompanyD().regionName(UPDATED_REGION_NAME).name(UPDATED_NAME);
        return companyD;
    }

    @BeforeEach
    public void initTest() {
        companyD = createEntity(em);
    }

    @Test
    @Transactional
    void createCompanyD() throws Exception {
        int databaseSizeBeforeCreate = companyDRepository.findAll().size();
        // Create the CompanyD
        restCompanyDMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyD)))
            .andExpect(status().isCreated());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeCreate + 1);
        CompanyD testCompanyD = companyDList.get(companyDList.size() - 1);
        assertThat(testCompanyD.getRegionName()).isEqualTo(DEFAULT_REGION_NAME);
        assertThat(testCompanyD.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createCompanyDWithExistingId() throws Exception {
        // Create the CompanyD with an existing ID
        companyD.setId(1L);

        int databaseSizeBeforeCreate = companyDRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCompanyDMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyD)))
            .andExpect(status().isBadRequest());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCompanyDS() throws Exception {
        // Initialize the database
        companyDRepository.saveAndFlush(companyD);

        // Get all the companyDList
        restCompanyDMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(companyD.getId().intValue())))
            .andExpect(jsonPath("$.[*].regionName").value(hasItem(DEFAULT_REGION_NAME)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getCompanyD() throws Exception {
        // Initialize the database
        companyDRepository.saveAndFlush(companyD);

        // Get the companyD
        restCompanyDMockMvc
            .perform(get(ENTITY_API_URL_ID, companyD.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(companyD.getId().intValue()))
            .andExpect(jsonPath("$.regionName").value(DEFAULT_REGION_NAME))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingCompanyD() throws Exception {
        // Get the companyD
        restCompanyDMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCompanyD() throws Exception {
        // Initialize the database
        companyDRepository.saveAndFlush(companyD);

        int databaseSizeBeforeUpdate = companyDRepository.findAll().size();

        // Update the companyD
        CompanyD updatedCompanyD = companyDRepository.findById(companyD.getId()).get();
        // Disconnect from session so that the updates on updatedCompanyD are not directly saved in db
        em.detach(updatedCompanyD);
        updatedCompanyD.regionName(UPDATED_REGION_NAME).name(UPDATED_NAME);

        restCompanyDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCompanyD.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCompanyD))
            )
            .andExpect(status().isOk());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeUpdate);
        CompanyD testCompanyD = companyDList.get(companyDList.size() - 1);
        assertThat(testCompanyD.getRegionName()).isEqualTo(UPDATED_REGION_NAME);
        assertThat(testCompanyD.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingCompanyD() throws Exception {
        int databaseSizeBeforeUpdate = companyDRepository.findAll().size();
        companyD.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompanyDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, companyD.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyD))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCompanyD() throws Exception {
        int databaseSizeBeforeUpdate = companyDRepository.findAll().size();
        companyD.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(companyD))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCompanyD() throws Exception {
        int databaseSizeBeforeUpdate = companyDRepository.findAll().size();
        companyD.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyDMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(companyD)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCompanyDWithPatch() throws Exception {
        // Initialize the database
        companyDRepository.saveAndFlush(companyD);

        int databaseSizeBeforeUpdate = companyDRepository.findAll().size();

        // Update the companyD using partial update
        CompanyD partialUpdatedCompanyD = new CompanyD();
        partialUpdatedCompanyD.setId(companyD.getId());

        partialUpdatedCompanyD.name(UPDATED_NAME);

        restCompanyDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompanyD.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompanyD))
            )
            .andExpect(status().isOk());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeUpdate);
        CompanyD testCompanyD = companyDList.get(companyDList.size() - 1);
        assertThat(testCompanyD.getRegionName()).isEqualTo(DEFAULT_REGION_NAME);
        assertThat(testCompanyD.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateCompanyDWithPatch() throws Exception {
        // Initialize the database
        companyDRepository.saveAndFlush(companyD);

        int databaseSizeBeforeUpdate = companyDRepository.findAll().size();

        // Update the companyD using partial update
        CompanyD partialUpdatedCompanyD = new CompanyD();
        partialUpdatedCompanyD.setId(companyD.getId());

        partialUpdatedCompanyD.regionName(UPDATED_REGION_NAME).name(UPDATED_NAME);

        restCompanyDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCompanyD.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCompanyD))
            )
            .andExpect(status().isOk());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeUpdate);
        CompanyD testCompanyD = companyDList.get(companyDList.size() - 1);
        assertThat(testCompanyD.getRegionName()).isEqualTo(UPDATED_REGION_NAME);
        assertThat(testCompanyD.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingCompanyD() throws Exception {
        int databaseSizeBeforeUpdate = companyDRepository.findAll().size();
        companyD.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCompanyDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, companyD.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(companyD))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCompanyD() throws Exception {
        int databaseSizeBeforeUpdate = companyDRepository.findAll().size();
        companyD.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(companyD))
            )
            .andExpect(status().isBadRequest());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCompanyD() throws Exception {
        int databaseSizeBeforeUpdate = companyDRepository.findAll().size();
        companyD.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCompanyDMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(companyD)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CompanyD in the database
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCompanyD() throws Exception {
        // Initialize the database
        companyDRepository.saveAndFlush(companyD);

        int databaseSizeBeforeDelete = companyDRepository.findAll().size();

        // Delete the companyD
        restCompanyDMockMvc
            .perform(delete(ENTITY_API_URL_ID, companyD.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CompanyD> companyDList = companyDRepository.findAll();
        assertThat(companyDList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
