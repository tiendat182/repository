package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.NewCompany;
import com.mycompany.myapp.repository.NewCompanyRepository;
import com.mycompany.myapp.service.NewCompanyService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link NewCompany}.
 */
@Service
@Transactional
public class NewCompanyServiceImpl implements NewCompanyService {

    private final Logger log = LoggerFactory.getLogger(NewCompanyServiceImpl.class);

    private final NewCompanyRepository newCompanyRepository;

    public NewCompanyServiceImpl(NewCompanyRepository newCompanyRepository) {
        this.newCompanyRepository = newCompanyRepository;
    }

    @Override
    public NewCompany save(NewCompany newCompany) {
        log.debug("Request to save NewCompany : {}", newCompany);
        return newCompanyRepository.save(newCompany);
    }

    @Override
    public NewCompany update(NewCompany newCompany) {
        log.debug("Request to update NewCompany : {}", newCompany);
        return newCompanyRepository.save(newCompany);
    }

    @Override
    public Optional<NewCompany> partialUpdate(NewCompany newCompany) {
        log.debug("Request to partially update NewCompany : {}", newCompany);

        return newCompanyRepository
            .findById(newCompany.getId())
            .map(existingNewCompany -> {
                if (newCompany.getUserUpdate() != null) {
                    existingNewCompany.setUserUpdate(newCompany.getUserUpdate());
                }
                if (newCompany.getName() != null) {
                    existingNewCompany.setName(newCompany.getName());
                }

                return existingNewCompany;
            })
            .map(newCompanyRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewCompany> findAll() {
        log.debug("Request to get all NewCompanies");
        return newCompanyRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<NewCompany> findOne(Long id) {
        log.debug("Request to get NewCompany : {}", id);
        return newCompanyRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete NewCompany : {}", id);
        newCompanyRepository.deleteById(id);
    }
}
