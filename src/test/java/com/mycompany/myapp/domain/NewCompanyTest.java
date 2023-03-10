package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NewCompanyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NewCompany.class);
        NewCompany newCompany1 = new NewCompany();
        newCompany1.setId(1L);
        NewCompany newCompany2 = new NewCompany();
        newCompany2.setId(newCompany1.getId());
        assertThat(newCompany1).isEqualTo(newCompany2);
        newCompany2.setId(2L);
        assertThat(newCompany1).isNotEqualTo(newCompany2);
        newCompany1.setId(null);
        assertThat(newCompany1).isNotEqualTo(newCompany2);
    }
}
