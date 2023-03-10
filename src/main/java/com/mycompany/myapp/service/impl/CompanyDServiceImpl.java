package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.CompanyD;
import com.mycompany.myapp.repository.CompanyDRepository;
import com.mycompany.myapp.service.CompanyDService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link CompanyD}.
 */
@Service
@Transactional
public class CompanyDServiceImpl implements CompanyDService {

    private final Logger log = LoggerFactory.getLogger(CompanyDServiceImpl.class);

    private final CompanyDRepository companyDRepository;

    public CompanyDServiceImpl(CompanyDRepository companyDRepository) {
        this.companyDRepository = companyDRepository;
    }

    @Override
    public CompanyD save(CompanyD companyD) {
        log.debug("Request to save CompanyD : {}", companyD);
        return companyDRepository.save(companyD);
    }

    @Override
    public CompanyD update(CompanyD companyD) {
        log.debug("Request to update CompanyD : {}", companyD);
        return companyDRepository.save(companyD);
    }

    @Override
    public Optional<CompanyD> partialUpdate(CompanyD companyD) {
        log.debug("Request to partially update CompanyD : {}", companyD);

        return companyDRepository
            .findById(companyD.getId())
            .map(existingCompanyD -> {
                if (companyD.getRegionName() != null) {
                    existingCompanyD.setRegionName(companyD.getRegionName());
                }
                if (companyD.getName() != null) {
                    existingCompanyD.setName(companyD.getName());
                }

                return existingCompanyD;
            })
            .map(companyDRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyD> findAll() {
        log.debug("Request to get all CompanyDS");
        return companyDRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CompanyD> findOne(Long id) {
        log.debug("Request to get CompanyD : {}", id);
        return companyDRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CompanyD : {}", id);
        companyDRepository.deleteById(id);
    }
}
