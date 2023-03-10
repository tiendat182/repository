package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A NewCompany.
 */
@Entity
@Table(name = "new_company")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class NewCompany implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "user_update")
    private Instant userUpdate;

    @Column(name = "name")
    private String name;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NewCompany id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getUserUpdate() {
        return this.userUpdate;
    }

    public NewCompany userUpdate(Instant userUpdate) {
        this.setUserUpdate(userUpdate);
        return this;
    }

    public void setUserUpdate(Instant userUpdate) {
        this.userUpdate = userUpdate;
    }

    public String getName() {
        return this.name;
    }

    public NewCompany name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NewCompany)) {
            return false;
        }
        return id != null && id.equals(((NewCompany) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NewCompany{" +
            "id=" + getId() +
            ", userUpdate='" + getUserUpdate() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
