package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CompanyD;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CompanyD entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanyDRepository extends JpaRepository<CompanyD, Long> {}
