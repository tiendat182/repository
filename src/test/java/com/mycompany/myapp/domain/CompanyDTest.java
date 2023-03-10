package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CompanyDTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompanyD.class);
        CompanyD companyD1 = new CompanyD();
        companyD1.setId(1L);
        CompanyD companyD2 = new CompanyD();
        companyD2.setId(companyD1.getId());
        assertThat(companyD1).isEqualTo(companyD2);
        companyD2.setId(2L);
        assertThat(companyD1).isNotEqualTo(companyD2);
        companyD1.setId(null);
        assertThat(companyD1).isNotEqualTo(companyD2);
    }
}
