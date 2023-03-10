package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.NewCompany;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the NewCompany entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NewCompanyRepository extends JpaRepository<NewCompany, Long> {}
