package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.NewCompany;
import com.mycompany.myapp.repository.NewCompanyRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link NewCompanyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NewCompanyResourceIT {

    private static final Instant DEFAULT_USER_UPDATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_USER_UPDATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/new-companies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NewCompanyRepository newCompanyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNewCompanyMockMvc;

    private NewCompany newCompany;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NewCompany createEntity(EntityManager em) {
        NewCompany newCompany = new NewCompany().userUpdate(DEFAULT_USER_UPDATE).name(DEFAULT_NAME);
        return newCompany;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NewCompany createUpdatedEntity(EntityManager em) {
        NewCompany newCompany = new NewCompany().userUpdate(UPDATED_USER_UPDATE).name(UPDATED_NAME);
        return newCompany;
    }

    @BeforeEach
    public void initTest() {
        newCompany = createEntity(em);
    }

    @Test
    @Transactional
    void createNewCompany() throws Exception {
        int databaseSizeBeforeCreate = newCompanyRepository.findAll().size();
        // Create the NewCompany
        restNewCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(newCompany)))
            .andExpect(status().isCreated());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeCreate + 1);
        NewCompany testNewCompany = newCompanyList.get(newCompanyList.size() - 1);
        assertThat(testNewCompany.getUserUpdate()).isEqualTo(DEFAULT_USER_UPDATE);
        assertThat(testNewCompany.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createNewCompanyWithExistingId() throws Exception {
        // Create the NewCompany with an existing ID
        newCompany.setId(1L);

        int databaseSizeBeforeCreate = newCompanyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNewCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(newCompany)))
            .andExpect(status().isBadRequest());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNewCompanies() throws Exception {
        // Initialize the database
        newCompanyRepository.saveAndFlush(newCompany);

        // Get all the newCompanyList
        restNewCompanyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(newCompany.getId().intValue())))
            .andExpect(jsonPath("$.[*].userUpdate").value(hasItem(DEFAULT_USER_UPDATE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getNewCompany() throws Exception {
        // Initialize the database
        newCompanyRepository.saveAndFlush(newCompany);

        // Get the newCompany
        restNewCompanyMockMvc
            .perform(get(ENTITY_API_URL_ID, newCompany.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(newCompany.getId().intValue()))
            .andExpect(jsonPath("$.userUpdate").value(DEFAULT_USER_UPDATE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingNewCompany() throws Exception {
        // Get the newCompany
        restNewCompanyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingNewCompany() throws Exception {
        // Initialize the database
        newCompanyRepository.saveAndFlush(newCompany);

        int databaseSizeBeforeUpdate = newCompanyRepository.findAll().size();

        // Update the newCompany
        NewCompany updatedNewCompany = newCompanyRepository.findById(newCompany.getId()).get();
        // Disconnect from session so that the updates on updatedNewCompany are not directly saved in db
        em.detach(updatedNewCompany);
        updatedNewCompany.userUpdate(UPDATED_USER_UPDATE).name(UPDATED_NAME);

        restNewCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNewCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNewCompany))
            )
            .andExpect(status().isOk());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeUpdate);
        NewCompany testNewCompany = newCompanyList.get(newCompanyList.size() - 1);
        assertThat(testNewCompany.getUserUpdate()).isEqualTo(UPDATED_USER_UPDATE);
        assertThat(testNewCompany.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingNewCompany() throws Exception {
        int databaseSizeBeforeUpdate = newCompanyRepository.findAll().size();
        newCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNewCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, newCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(newCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNewCompany() throws Exception {
        int databaseSizeBeforeUpdate = newCompanyRepository.findAll().size();
        newCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(newCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNewCompany() throws Exception {
        int databaseSizeBeforeUpdate = newCompanyRepository.findAll().size();
        newCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewCompanyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(newCompany)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNewCompanyWithPatch() throws Exception {
        // Initialize the database
        newCompanyRepository.saveAndFlush(newCompany);

        int databaseSizeBeforeUpdate = newCompanyRepository.findAll().size();

        // Update the newCompany using partial update
        NewCompany partialUpdatedNewCompany = new NewCompany();
        partialUpdatedNewCompany.setId(newCompany.getId());

        partialUpdatedNewCompany.name(UPDATED_NAME);

        restNewCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNewCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNewCompany))
            )
            .andExpect(status().isOk());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeUpdate);
        NewCompany testNewCompany = newCompanyList.get(newCompanyList.size() - 1);
        assertThat(testNewCompany.getUserUpdate()).isEqualTo(DEFAULT_USER_UPDATE);
        assertThat(testNewCompany.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateNewCompanyWithPatch() throws Exception {
        // Initialize the database
        newCompanyRepository.saveAndFlush(newCompany);

        int databaseSizeBeforeUpdate = newCompanyRepository.findAll().size();

        // Update the newCompany using partial update
        NewCompany partialUpdatedNewCompany = new NewCompany();
        partialUpdatedNewCompany.setId(newCompany.getId());

        partialUpdatedNewCompany.userUpdate(UPDATED_USER_UPDATE).name(UPDATED_NAME);

        restNewCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNewCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNewCompany))
            )
            .andExpect(status().isOk());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeUpdate);
        NewCompany testNewCompany = newCompanyList.get(newCompanyList.size() - 1);
        assertThat(testNewCompany.getUserUpdate()).isEqualTo(UPDATED_USER_UPDATE);
        assertThat(testNewCompany.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingNewCompany() throws Exception {
        int databaseSizeBeforeUpdate = newCompanyRepository.findAll().size();
        newCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNewCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, newCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(newCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNewCompany() throws Exception {
        int databaseSizeBeforeUpdate = newCompanyRepository.findAll().size();
        newCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(newCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNewCompany() throws Exception {
        int databaseSizeBeforeUpdate = newCompanyRepository.findAll().size();
        newCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNewCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(newCompany))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NewCompany in the database
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNewCompany() throws Exception {
        // Initialize the database
        newCompanyRepository.saveAndFlush(newCompany);

        int databaseSizeBeforeDelete = newCompanyRepository.findAll().size();

        // Delete the newCompany
        restNewCompanyMockMvc
            .perform(delete(ENTITY_API_URL_ID, newCompany.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NewCompany> newCompanyList = newCompanyRepository.findAll();
        assertThat(newCompanyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
